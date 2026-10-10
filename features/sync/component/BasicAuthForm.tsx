import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from "@/components/ui/Modal";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import { Copy } from "lucide-react";
import { useUpsertCalDavAccount } from "../../calendarCredential/query/upsert-calDavAccount";
import { useSyncCalDavAccount } from "../query/useSync";
import { useTranslations } from "next-intl";

type FieldConfig = {
  id: string;
  name: string;
  label: string;
  type?: string;
};

type BasicAuthFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  fields: FieldConfig[];
  service: string;
  onSuccess?: (data: unknown) => void;
  onError?: (data: unknown) => void;
  onSettled?: () => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
};

export const BasicAuthForm = ({
  open,
  setOpen,
  title,
  description,
  fields,
  service,
  onSuccess,
  onError,
  onSubmit,
  onSettled,
}: BasicAuthFormProps) => {
  const { toast } = useToast();
  const {
    upsertMutateAsyncFn: createCalendarAccount,
    upsertStatus: createCalendarAccountStatus,
    error: createCalendarCredentialError,
  } = useUpsertCalDavAccount();
  const {
    syncMutateAsync:syncCalendarEvents,
    syncStatus:syncCalendarEventsStatus,
    error: syncError,
  } = useSyncCalDavAccount();
  const t = useTranslations("sync");
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalOverlay>
        <ModalContent className="relative">
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {description && (
              <ModalDescription className="my-2">
                {description}
              </ModalDescription>
            )}
          </ModalHeader>
          <ModalClose className="absolute top-2 right-4 text-muted-foreground hover:text-foreground h-4 w-4">
            <X />
          </ModalClose>
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              try {
                e.preventDefault();
                if (onSubmit) onSubmit(e);
                // throw new Error("something random totally unexplicable unknown bizzare thing happened that could not be explained by science")
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries()) as Record<
                  string,
                  string
                >;
                const credentials = {
                  username: data["username"],
                  password: data["password"],
                  service: service,
                  serverUrl: data["serverUrl"],
                };
                // store the credentials in database
                await createCalendarAccount(credentials);
                // use the credentials from database to connect to caldav server and sync events
                await syncCalendarEvents({ service });
                if (
                  onSuccess &&
                  syncCalendarEventsStatus == "success" &&
                  createCalendarAccountStatus == "success"
                )
                  onSuccess(e);
              } catch (error) {
                if (error instanceof Error) {
                  toast({
                    variant: "destructive",
                    description: t("syncFailed", { error: error.message }),
                  });
                }
                toast({
                  variant: "destructive",
                  description: t("syncFailed", { error: String(error) }),
                });
                console.error(error);
                if (onError) onError(error);
              } finally {
                if (onSettled) onSettled();
              }
            }}
          >
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block" htmlFor={field.id}>
                  {field.label} *
                </label>
                <Input
                  required
                  id={field.id}
                  name={field.name}
                  type={field.type ?? "text"}
                />
              </div>
            ))}
            <div className="flex gap-4 mt-4 items-center justify-between ">
              <div>
                {createCalendarAccountStatus == "pending" ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />{" "}
                    <p>{t("linking")}</p>
                  </div>
                ) : syncCalendarEventsStatus == "pending" ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />{" "}
                    <p>{t("syncing")}</p>
                  </div>
                ) : createCalendarAccountStatus == "success" &&
                  syncCalendarEventsStatus == "success" ? (
                  <p>{t("syncedSuccessfully")}</p>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex gap-4 items-center justify-center ">
                <ModalClose>
                  <Button type="button" variant="destructive">
                    {t("cancel")}
                  </Button>
                </ModalClose>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={
                    createCalendarAccountStatus == "pending" ||
                    syncCalendarEventsStatus == "pending"
                  }
                >
                  {t("sync")}
                </Button>
              </div>
            </div>
            {(createCalendarAccountStatus == "error" ||
              syncCalendarEventsStatus == "error") && (
              <div className="relative p-1 border rounded-md w-full ">
                <p className="text-red py-4 whitespace-nowrap overflow-scroll">
                  {syncError?.message || createCalendarCredentialError?.message}
                </p>
                <button
                  onClick={async () =>
                    await navigator.clipboard.writeText(
                      syncError?.message ||
                        createCalendarCredentialError?.message ||
                        t("unexplainableError"),
                    )
                  }
                  type="button"
                  className="active:-translate-y-full hover:text-foreground p-4  text-muted-foreground transition-transform cursor-pointer absolute top-1/2 -translate-y-1/2 right-0 bg-background px-2"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

import { Input } from "@/components/ui/input";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalClose } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import { Copy } from "lucide-react";
import { useUpsertCalDavAccount } from "../../calendarCredential/query/upsert-calDavAccount";
import { useSyncCalDavAccount } from "../query/useSync";

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
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void
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
    const { upsertMutateAsyncFn: createCalendarCredentials, upsertStatus: createCalendarCredentialStatus, error: createCalendarCredentialError } = useUpsertCalDavAccount();
    const { syncMutateAsync, syncStatus, error: syncError } = useSyncCalDavAccount();
    console.log(createCalendarCredentialStatus);
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
                                const data = Object.fromEntries(formData.entries()) as Record<string, string>;
                                await createCalendarCredentials({ username: data["username"], password: data["password"], service: "apple", serverUrl: data["serverUrl"] });
                                await syncMutateAsync({ service });
                                if (onSuccess && syncStatus == "success" && createCalendarCredentialStatus == "success") onSuccess(e)
                            } catch (error) {
                                if (error instanceof Error) {
                                    toast({ variant: "destructive", description: `sync failed: ${error.message}` })
                                }
                                toast({ variant: "destructive", description: `sync failed: ${String(error)}` })
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
                                {
                                    createCalendarCredentialStatus == "pending" ?
                                        <div className="flex items-center gap-2"><Spinner className="w-4 h-4" /> <p>Linking Calendar Account...</p></div>
                                        : syncStatus == "pending" ?
                                            <div className="flex items-center gap-2"><Spinner className="w-4 h-4" /> <p>Syncing Local objects...</p></div>
                                            : (createCalendarCredentialStatus == "success" && syncStatus == "success") ?
                                                <p>Synced succesfully</p> : <></>
                                }
                            </div>
                            <div className="flex gap-4 items-center justify-center ">
                                <ModalClose>
                                    <Button type="button" variant="destructive">
                                        Cancel
                                    </Button>
                                </ModalClose>
                                <Button type="submit" variant="outline" disabled={createCalendarCredentialStatus == "pending" || syncStatus == "pending"}>
                                    Sync
                                </Button>
                            </div>
                        </div>
                        {(createCalendarCredentialStatus == "error" || syncStatus == "error") &&
                            <div className="relative p-1 border rounded-md w-full ">
                                <p className="text-red py-4 whitespace-nowrap overflow-scroll">{syncError?.message || createCalendarCredentialError?.message}</p>
                                <button
                                    onClick={async () => await navigator.clipboard.writeText(syncError?.message || createCalendarCredentialError?.message || "an unexplainable error occured")}
                                    type="button"
                                    className="active:-translate-y-full hover:text-foreground p-4  text-muted-foreground transition-transform cursor-pointer absolute top-1/2 -translate-y-1/2 right-0 bg-background px-2">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>}
                    </form>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
};
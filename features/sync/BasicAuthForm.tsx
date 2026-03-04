import { Input } from "@/components/ui/input";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalClose } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, SetStateAction, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import clsx from "clsx";
import { Copy } from "lucide-react";

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
    isSyncing: boolean,
    setIsSyncing: React.Dispatch<SetStateAction<boolean>>
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
    isSyncing,
    setIsSyncing
}: BasicAuthFormProps) => {
    const { toast } = useToast();
    const [error, setError] = useState<null | Error>(null);
    const [success, setSuccess] = useState(false);

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
                                setIsSyncing(true)
                                // throw new Error("something random totally unexplicable unknown bizzare thing happened that could not be explained by science")

                                const formData = new FormData(e.currentTarget);
                                const data = Object.fromEntries(formData.entries());
                                const res = await fetch(`/api/calDav/sync?service=${service}`, {
                                    method: "POST",
                                    body: JSON.stringify(data),
                                });
                                if (res.status != 200) {
                                    const body = await res.json()
                                    throw new Error(body.message)
                                }
                                setError(null)
                                toast({ description: "Synced Succesfully" })
                                setSuccess(true)
                                onSuccess?.(await res.json());
                            } catch (error) {
                                if (error instanceof Error) {
                                    setError(error)
                                    toast({ variant: "destructive", description: `sync failed: ${error.message}` })
                                }
                                setSuccess(false)
                                setError(new Error(String(error)))
                                toast({ variant: "destructive", description: `sync failed: ${String(error)}` })
                                console.error(error);
                                if (onError) onError(error);
                            } finally {
                                setIsSyncing(false);
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
                            <p className={clsx("text-transparent", success && !isSyncing && "text-lime!")}>Synced succesfully</p>
                            <div className="flex gap-4 items-center justify-center ">
                                {isSyncing && <Spinner className="w-4 h-4" />}
                                <ModalClose>
                                    <Button type="button" variant="destructive">
                                        Cancel
                                    </Button>
                                </ModalClose>
                                <Button type="submit" variant="outline" disabled={isSyncing}>
                                    Sync
                                </Button>
                            </div>
                        </div>
                        {error && !isSyncing &&
                            <div className="relative p-1 border rounded-md w-full ">
                                <p className="text-red py-4 whitespace-nowrap overflow-scroll">{error.message}</p>
                                <button
                                    onClick={async () => { console.log(error.message); await navigator.clipboard.writeText(error.message) }}
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
import { Input } from "@/components/ui/input";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalClose } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
};

export const BasicAuthForm = ({
    open,
    setOpen,
    title,
    description,
    fields,
    service,
    onSuccess,
}: BasicAuthFormProps) => {
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
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data = Object.fromEntries(formData.entries());
                            const res = await fetch(`/api/calDav/sync?service=${service}`, {
                                method: "POST",
                                body: JSON.stringify(data),
                            });
                            onSuccess?.(await res.json());
                        }}
                    >
                        {fields.map((field) => (
                            <div key={field.id}>
                                <label className="block" htmlFor={field.id}>
                                    {field.label} *
                                </label>
                                <Input
                                    id={field.id}
                                    name={field.name}
                                    type={field.type ?? "text"}
                                />
                            </div>
                        ))}
                        <div className="flex gap-4 mt-4 justify-end">
                            <ModalClose>
                                <Button type="button" variant="destructive">
                                    Cancel
                                </Button>
                            </ModalClose>
                            <Button type="submit" variant="outline">
                                Sync
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
};
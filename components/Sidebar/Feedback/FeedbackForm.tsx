import React, { FormEvent, useState } from 'react'
import { Mail, X } from 'lucide-react'
import { Modal, ModalOverlay, ModalContent, ModalTitle, ModalClose, ModalFooter } from '@/components/ui/Modal'
import { useCreateFeedback } from './query/create-feedback';
export default function FeedbackForm() {
    const [open, setOpen] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const { createMutateFn } = useCreateFeedback()
    return (
        <>
            {open && <Modal open={open} onOpenChange={setOpen}>
                <ModalOverlay>
                    <ModalContent className='relative'>
                        <ModalClose className='absolute top-4 right-4'>
                            <X />
                        </ModalClose>
                        <form
                            onSubmit={(e: FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const formData = new FormData(form);

                                const title = formData.get("title") as string;
                                const description = formData.get("description") as string;

                                console.log({ title, description });

                                createMutateFn({ title, description });
                            }}>
                            <ModalTitle className='mt-8 text-xl font-bold!'>
                                Feedback Form
                            </ModalTitle>
                            <div className='mt-8'>
                                <label htmlFor="title" className='text-muted-foreground text-sm'>title*</label>
                                <input required id="title" name="title" maxLength={100} className='bg-popover mt-1 w-full rounded-md outline-0 focus:outline-0 p-2 text-lg sm:text-base'></input>
                            </div>
                            <div className='mt-8'>
                                <div className='flex justify-between'>
                                    <label htmlFor='description' className='text-muted-foreground text-sm'>description</label>
                                    <span className='text-muted-foreground text-xs ml-auto'>
                                        {`${wordCount}/500`}

                                    </span>
                                </div>
                                <textarea
                                    maxLength={500}
                                    onInput={(e) => {
                                        setWordCount(e.currentTarget.value.length);
                                        console.log(e.currentTarget.value)
                                    }}
                                    id="description"
                                    name="description"
                                    rows={6}
                                    className='bg-popover mt-1 resize-y w-full rounded-md outline-0 focus:outline-0 p-2 text-lg sm:text-base'
                                />
                            </div>
                            <ModalFooter>
                                <ModalClose>
                                    <button
                                        type='button'
                                        className='py-1.5 px-2 rounded-md hover:bg-red/90 border cursor-pointer bg-accent'>
                                        Cancel
                                    </button>
                                </ModalClose>
                                <button
                                    type="submit"
                                    className='py-1.5 px-2 rounded-md hover:bg-lime/90 border cursor-pointer bg-accent'>
                                    Send
                                </button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            </Modal >}
            <div
                onClick={() => setOpen(true)}
                className='mt-auto flex justify-start items-center gap-2 p-2 hover:bg-popover rounded-md cursor-pointer hover:text-foreground'>
                <Mail className='w-4 h-4' />
                Feedback
            </div>
        </>
    )
}

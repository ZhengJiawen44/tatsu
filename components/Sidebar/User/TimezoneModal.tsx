import { SetStateAction, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
} from "@/components/ui/Modal";
import { Check, X } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useUserTimezone } from "@/features/user/query/get-timezone";
import { useUpdateTimezone } from "@/features/user/query/update-timezone";
import LineSeparator from "@/components/ui/lineSeparator";

export default function KeyboardShortcuts({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { userTimezone } = useUserTimezone();
  const [keyword, setKeyWord] = useState("");
  const [selectedTZ, setSelectedTZ] = useState(userTimezone);
  const timezoneList = Intl.supportedValuesOf("timeZone");
  const searchList = useMemo(() => {
    if (!keyword.length) return timezoneList;
    return timezoneList.filter((timezone) => {
      return timezone.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalOverlay>
        <ModalContent className="max-w-xl px-0">
          <ModalHeader className="relative mx-auto">
            <ModalTitle className="text-lg w-2/3 mx-auto">
              <SearchBar onInput={(e) => setKeyWord(e.currentTarget.value)} />
            </ModalTitle>
            <ModalClose className="absolute top-1/2 -translate-y-1/2 right-4 text-muted-foreground hover:text-foreground">
              <X />
            </ModalClose>
          </ModalHeader>
          <ModalBody>
            {/* current timezone */}
            <div className="sticky top-0 bg-inherit">
              <p className="text-muted-foreground sticky top-0">
                Current timezone
              </p>
              {userTimezone ? (
                <div className="shadow-md border border-border/30 w-full rounded-sm bg-popover/60 mx-auto my-1 p-3 flex items-center justify-between">
                  <span>{userTimezone}</span>
                </div>
              ) : (
                "null"
              )}
              <LineSeparator className="my-4" />
            </div>

            {/* timezone selection */}
            {searchList.map((timezone) => (
              <TimeZoneCard
                key={timezone}
                timezone={timezone}
                selectedTZ={selectedTZ}
                setSelectedTZ={setSelectedTZ}
              />
            ))}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
function TimeZoneCard({
  timezone,
  selectedTZ,
  setSelectedTZ,
}: {
  timezone: string;
  selectedTZ: string | undefined;
  setSelectedTZ: React.Dispatch<SetStateAction<string | undefined>>;
}) {
  const updateUserTZmutation = useUpdateTimezone();
  return (
    <div
      onClick={() => {
        setSelectedTZ(timezone);
        updateUserTZmutation.mutate(timezone);
      }}

      className="shadow-md cursor-pointer hover:bg-popover border border-border/30 w-full rounded-sm bg-popover/60 mx-auto my-1 p-3 flex items-center justify-between"
    >
      <span>{timezone}</span>
      {selectedTZ == timezone && <Check className="w-4 h-4" />}
    </div>
  );
}

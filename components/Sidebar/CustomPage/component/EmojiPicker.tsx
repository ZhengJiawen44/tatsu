import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const EmojiPicker = ({
  onSelect,
  className,
}: {
  onSelect: (emoji: string) => void;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const emojis = [
    "📅",
    "📆",
    "🗓️",
    "⏰",
    "⏳",
    "🔔",
    "✅",
    "☑️",
    "📝",
    "📋",
    "📌",
    "📎",
    "🎯",
    "⭐",
    "🔥",
    "💡",
    "🚀",
    "⚡",
    "🏠",
    "💼",
    "🏋️",
    "📚",
    "🛒",
    "✈️",
    "❤️",
    "💜",
    "💙",
    "💚",
    "🧡",
    "💛",
    "☀️",
    "🌙",
    "🌊",
    "🍀",
    "🌸",
    "🎵",
    "👤",
    "👥",
    "💬",
    "🔗",
    "🏷️",
    "🗂️",
  ];
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className={cn(
          "cursor-pointer text-muted-foreground p-1 outline-none",
          className,
        )}
      >
        <Smile className="w-5 h-5 hover:text-foreground cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent
        className="grid grid-cols-8 gap-0.5 max-h-60 overflow-auto w-fit p-1 z-60"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {emojis.map((emoji) => (
          <button
            type="button"
            className="flex justify-center items-center size-8 rounded-sm hover:bg-popover-accent cursor-pointer text-base"
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              setOpen(false);
            }}
          >
            {emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
export default EmojiPicker;

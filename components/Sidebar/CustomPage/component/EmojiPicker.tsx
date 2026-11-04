import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EmojiPicker = ({
    onSelect,
  className,
}: {
  onSelect: (emoji:string)=>void,
  className?: string;
}) => {
  const emojis = [
    "📅", "📆", "🗓️", "⏰", "⏳", "🔔",
    "✅", "☑️", "📝", "📋", "📌", "📎",
    "🎯", "⭐", "🔥", "💡", "🚀", "⚡",
    "🏠", "💼", "🏋️", "📚", "🛒", "✈️",
    "❤️", "💜", "💙", "💚", "🧡", "💛",
    "☀️", "🌙", "🌊", "🍀", "🌸", "🎵",
    "👤", "👥", "💬", "🔗", "🏷️", "🗂️",
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "cursor-pointer text-muted-foreground p-1 outline-none",
          className,
        )}
      >
        <Smile className="w-5 h-5 hover:text-foreground cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {emojis.map((emoji) => {
          return (
            <DropdownMenuItem
              key={emoji}
              onSelect={() => {
                onSelect(emoji);
              }}
            >
              {emoji}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default EmojiPicker;

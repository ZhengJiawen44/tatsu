import { usePathname } from "next/navigation";

export function useBackgroundColor() {
  const path = usePathname();

  switch (true) {
    case path.startsWith("/register"):
    case path.startsWith("/login"):
      return "bg-white";
    default:
      return "bg-background";
  }
}

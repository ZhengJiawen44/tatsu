import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "../ui/button";

const SidebarItem = ({
  children,
  className,
  asChild,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  props?: ButtonProps;
}) => {
  return (
    <Button
      asChild={asChild ?? false}
      type="button"
      variant={"ghost"}
      className={cn(
        "flex gap-3 justify-start items-center w-full select-none font-normal px-2!",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
export default SidebarItem;

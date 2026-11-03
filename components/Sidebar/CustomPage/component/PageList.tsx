import LineSeparator from "@/components/ui/lineSeparator";
import { usePage } from "../query/get-page";
import SidebarItem from "../../SidebarItem";
import { useMenu } from "@/providers/MenuProvider";
import { Link } from "@/i18n/navigation";
import useWindowSize from "@/hooks/useWindowSize";
import Meatball from "@/components/ui/icon/meatball";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
export const PageList = () => {
  const { pages } = usePage();
  const { width } = useWindowSize();

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();

  if (!pages.length) return <></>;

  return (
    <>
      <LineSeparator className="my-2" />
      {pages.map((page) => {
        return (
          <SidebarItem
            asChild
            className={
              activeMenu.name === page.title + ":" + page.id
                ? "bg-sidebar-primary"
                : ""
            }
            key={page.id}
          >
            <Link
              className="group text-foreground relative cursor-pointer"
              href="/app/todo"
              onClick={() => {
                setActiveMenu({ name: page.title + ":" + page.id });
                if (width <= 766) setShowMenu(false);
              }}
            >
              {page.title}
              <div className="flex cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden group-hover:block data-[state=open]:block cursor-pointer">
                    <Meatball className="w-5 h-5 hover:text-foreground cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {}}>
                      {" "}
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
          </SidebarItem>
        );
      })}
    </>
  );
};

import LineSeparator from "@/components/ui/lineSeparator";
import { usePage } from "../query/get-page"
import SidebarItem from "../../SidebarItem";
import { useMenu } from "@/providers/MenuProvider";
import { Link } from "@/i18n/navigation";
import useWindowSize from "@/hooks/useWindowSize";
export const PageList = ()=>{
    const {pages} = usePage();
  const { width } = useWindowSize();

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();

    if(!pages.length) return <></>

    return <>
    <LineSeparator className="my-2"/>
    {pages.map((page)=>{
        return <SidebarItem asChild className={activeMenu.name === page.title+":"+page.id ? "bg-sidebar-primary":""} key={page.id}>
             <Link 
             className="text-foreground"
                    href="/app/todo"
                    onClick={() => {
                      setActiveMenu({ name: page.title+":"+page.id });
                      if (width <= 766) setShowMenu(false);
                    }}
                  >
            {page.title}
                    
                  </Link>
            </SidebarItem>
    })}
    </>
}
import NewFeaturesAnnouncement from "@/components/popups/NewFeaturesPopup";
import SidebarToggleContainer from "@/components/Sidebar/SidebarToggleContainer";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div
            className="px-[clamp(5px,2%,5%)]"
        >
            <SidebarToggleContainer />
            <NewFeaturesAnnouncement />
            {children}
        </div>

    );
}

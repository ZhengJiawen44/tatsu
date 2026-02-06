import NewFeaturesAnnouncement from "@/components/popups/NewFeaturesPopup";
import SidebarToggleContainer from "@/components/Sidebar/SidebarToggleContainer";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div
            className=
            "w-full m-auto h-full overflow-scroll scrollbar-none px-4 md:px-[clamp(5px,5%,10%)] lg:px-[clamp(10px,10%,20%)] xl:px-[clamp(10px,15%,20%)] 2xl:px-[clamp(10px,20%,30%)] pt-4 sm:pt-20"
        >
            <SidebarToggleContainer />
            <NewFeaturesAnnouncement />
            {children}
        </div>

    );
}

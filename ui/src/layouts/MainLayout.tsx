import React from "react";
import NavBar from "@/layouts/navigation/NavBar.tsx";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    return (
        <div className="grid grid-rows-[64px_1fr] h-screen bg-gray-100">
            <NavBar/>
            <main className="overflow-y-auto">{children}</main>
        </div>
    );
};

export default MainLayout;

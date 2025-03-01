import React from "react";
import Navbar from "@/layouts/navigation/Navbar.tsx";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    return (
        <div className="grid grid-rows-[64px_1fr] h-screen bg-gray-100">
            <Navbar/>
            <main className="overflow-y-auto">{children}</main>
        </div>
    );
};

export default MainLayout;

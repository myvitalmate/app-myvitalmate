import React from "react";
import Navbar from "@/layouts/navigation/navbar-new.tsx";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    return (
        <div>
            <Navbar/>
            <main className="pt-4 pl-4 pr-4">{children}</main>
        </div>
    );
};


export default MainLayout;

import React from "react";
import Navbar from "@/layouts/navigation/navbar-new.tsx";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    return (
        <div>
            <Navbar/>
            <main>{children}</main>
        </div>
    );
};


export default MainLayout;

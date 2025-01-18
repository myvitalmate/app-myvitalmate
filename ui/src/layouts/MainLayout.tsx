import React from "react";
import NavBar from "./navigation/NavBar.tsx";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    return (
        <div>
            <NavBar/>
            <main style={styles.main}>{children}</main>
        </div>
    );
};

const styles = {
    main: {
        padding: "2rem",
        textAlign: "center" as "center",
    },
};

export default MainLayout;

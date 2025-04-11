import {Link} from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
    return (
        <nav className={styles.nav}>
            <h1 className={styles.title}>My Vital Mate</h1>
            <ul className={styles.navLinks}>
                <li>
                    <Link to="/" className={styles.link}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/chat" className={styles.link}>
                        Chat
                    </Link>
                </li>
                <li>
                    <Link to="/recipes" className={styles.link}>
                        Recipes
                    </Link>
                </li>
                <li>
                    <Link to="/registration" className={styles.link}>
                        Registration
                    </Link>
                </li>
                <li>
                    <Link to="/about" className={styles.link}>
                        About
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;

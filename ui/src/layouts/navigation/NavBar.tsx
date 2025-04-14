import {Link} from "react-router-dom";

export default function NavBar() {
    const navigation = [
        {name: "Home", href: "/"},
        {name: "Chat", href: "/chat"},
        {name: "Recipes", href: "/recipes"},
        {name: "Registration", href: "/registration"},
        {name: "About", href: "/about"},
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-zinc-900">
            <div className=" flex h-16 items-center justify-between px-4 sm:px-8">
                <Link to="/" className="text-2xl font-semibold text-white">
                    My Vital Mate
                </Link>

                <nav className="md:flex md:items-center">
                    <div className="flex space-x-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-sm font-medium text-white transition-colors hover:text-zinc-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>

            </div>
        </header>
    )
}


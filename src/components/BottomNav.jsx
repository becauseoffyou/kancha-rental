import { Link, useLocation } from "react-router-dom";
import {
    FiHome,
    FiGrid,
    FiCalendar,
    FiUser
} from "react-icons/fi";
export default function BottomNav() {
    const location = useLocation();
    const menus = [
        { label: "Home", icon: FiHome, path: "/" },
        { label: "Equipment", icon: FiGrid, path: "/equipment" },
        { label: "Booking", icon: FiCalendar, path: "/booking" },
        { label: "Profile", icon: FiUser, path: "/profile" },
    ];
    return (
        <nav style={styles.nav}>
            {menus.map((menu) => {
                const Icon = menu.icon;

                const active =
                    menu.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(menu.path);

                return (
                    <Link
                        key={menu.path}
                        to={menu.path}
                        style={{
                            ...styles.item,
                            ...(active ? styles.active : {}),
                        }}
                    >
                        <Icon size={21} strokeWidth={active ? 2.5 : 2} />

                        <span style={styles.label}>
                            {menu.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

const styles = {
    nav: {
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",

        width: "100%",
        maxWidth: 600,
        height: 68,

        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",

        zIndex: 1000,
        paddingBottom: "env(safe-area-inset-bottom)",
    },

    item: {
        flex: 1,
        height: "100%",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        gap: 4,

        color: "#9ca3af",
        textDecoration: "none",
    },

    active: {
        color: "#111827",
    },

    icon: {
        fontSize: 22,
        lineHeight: 1,
    },

    label: {
        fontSize: 11,
        fontWeight: 600,
    },
};
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
const equipment = [
    {
        id: 1,
        name: "Sony A7 III",
        category: "Camera",
        price: 350000,
        status: "Tersedia",
    },
    {
        id: 2,
        name: "Sony FX3",
        category: "Cinema Camera",
        price: 750000,
        status: "Tersedia",
    },
    {
        id: 3,
        name: "Sigma 24-70mm F2.8",
        category: "Lens",
        price: 250000,
        status: "Tersedia",
    },
    {
        id: 4,
        name: "Godox SL60W",
        category: "Lighting",
        price: 120000,
        status: "Tersedia",
    },
];

export default function Equipment() {
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.title}>Equipment</h2>
                    </div>
                </div>

                <div style={styles.filterBar}>
                    <input
                        style={styles.search}
                        placeholder="Cari kamera, lensa, lighting..."
                    />

                    <div style={styles.filters}>
                        <button style={styles.activeFilter}>Semua</button>
                        <button style={styles.filter}>Kamera</button>
                        <button style={styles.filter}>Lensa</button>
                        <button style={styles.filter}>Lighting</button>
                        <button style={styles.filter}>Audio</button>
                    </div>
                </div>
            </header>

            <div style={styles.content}>


                <div style={styles.grid}>
                    {equipment.map((item) => (
                        <Link
                            to={`/equipment/${item.id}`}
                            key={item.id}
                            style={styles.card}
                        >
                            <div style={styles.image}>📷</div>

                            <div style={styles.cardBody}>
                                <small style={styles.category}>{item.category}</small>

                                <h3 style={styles.name}>{item.name}</h3>

                                <span style={styles.status}>● {item.status}</span>

                                <p style={styles.price}>
                                    Rp{item.price.toLocaleString("id-ID")}
                                    <span style={styles.day}> / hari</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f7f7f8",
        paddingBottom: 90,
    },
    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #f1f1f1",
    },
    headerInner: {
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "14px 16px 10px",
    },
    small: {
        fontSize: 10,
        color: "#9ca3af",
        letterSpacing: 1.3,
        fontWeight: 700,
    },
    title: {
        margin: "3px 0 0",
        fontSize: 22,
    },
    filterBar: {
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 16px 12px",
    },

    search: {
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        fontSize: 14,
        outline: "none",
        background: "#fff",
    },
    filters: {
        display: "flex",
        gap: 8,
        overflowX: "auto",
        marginTop: 10,
        paddingBottom: 2,
    },

    filter: {
        border: "1px solid #e5e7eb",
        background: "#fff",
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 12,
        whiteSpace: "nowrap",
        cursor: "pointer",
    },

    activeFilter: {
        border: "1px solid #111827",
        background: "#111827",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 12,
        whiteSpace: "nowrap",
        cursor: "pointer",
    },
    content: {
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "14px 16px 90px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 16,
    },
    card: {
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid #ececec",
    },
    image: {
        height: 190,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eceff3",
        fontSize: 50,
    },
    cardBody: {
        padding: 16,
    },
    category: {
        color: "#6b7280",
    },
    name: {
        margin: "6px 0",
    },
    status: {
        color: "#15803d",
        fontSize: 13,
    },
    price: {
        fontWeight: 800,
        marginBottom: 0,
    },
    day: {
        fontWeight: 400,
        color: "#6b7280",
    },
};
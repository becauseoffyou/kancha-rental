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
                <Link to="/">←</Link>
                <h2 style={styles.title}>Equipment</h2>
                <div></div>
            </header>

            <div style={styles.content}>
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
        maxWidth: 1100,
        margin: "0 auto",
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "50px 1fr 50px",
        alignItems: "center",
        background: "#fff",
    },
    title: {
        margin: 0,
        textAlign: "center",
    },
    content: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: 20,
    },
    search: {
        width: "100%",
        padding: "15px 16px",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        fontSize: 15,
        background: "#fff",
    },
    filters: {
        display: "flex",
        gap: 8,
        overflowX: "auto",
        margin: "16px 0 24px",
    },
    filter: {
        border: "1px solid #e5e7eb",
        background: "#fff",
        padding: "10px 16px",
        borderRadius: 30,
        whiteSpace: "nowrap",
    },
    activeFilter: {
        border: 0,
        background: "#111827",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 30,
        whiteSpace: "nowrap",
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
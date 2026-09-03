import { Link } from "react-router-dom";
import kanchaLogo from "../assets/logo_kancha.png";
import BottomNav from "../components/BottomNav";
const categories = [
    "Kamera",
    "Lensa",
    "Lighting",
    "Audio",
    "Drone",
    "Grip",
];

export default function Home() {
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>

                    <div style={styles.brand}>
                        <img
                            src={kanchaLogo}
                            alt="Kancha"
                            style={styles.brandLogo}
                        />


                    </div>

                    <Link to="/login" style={styles.loginButton}>
                        Login
                    </Link>

                </div>
            </header>

            <div style={styles.heroWrapper}>
                <section style={styles.hero}>
                    <p style={styles.heroSmall}>Professional Film Equipment</p>

                    <h1 style={styles.heroTitle}>
                        Sewa Equipment Syuting Lebih Mudah
                    </h1>

                    <p style={styles.heroText}>
                        Temukan kamera, lensa, lighting, audio, dan kebutuhan produksi lainnya.
                    </p>

                    <Link to="/equipment">
                        <button style={styles.primaryButton}>
                            Cari Equipment
                        </button>
                    </Link>
                </section>
            </div>

            <section style={styles.section}>
                <h3>Kategori Equipment</h3>

                <div style={styles.categories}>
                    {categories.map((category) => (
                        <div key={category} style={styles.category}>
                            <div style={styles.categoryIcon}>🎬</div>
                            <span>{category}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h3>Equipment Populer</h3>
                    <span style={styles.viewAll}>Lihat Semua</span>
                </div>

                <div style={styles.products}>
                    <Product name="Sony A7 III" price="Rp350.000" />
                    <Product name="Sony FX3" price="Rp750.000" />
                    <Product name="Sigma 24-70mm" price="Rp250.000" />
                </div>
            </section>
            <BottomNav />
        </div>
    );
}

function Product({ name, price }) {
    return (
        <div style={styles.product}>
            <div style={styles.productImage}>📷</div>

            <div style={styles.productBody}>
                <strong>{name}</strong>

                <p style={styles.price}>
                    {price}
                    <span style={styles.perDay}> / hari</span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        maxWidth: 1200,
        margin: "0 auto",
        background: "#fff",
        minHeight: "100vh",
        paddingBottom: 90,
    },
    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,

        width: "100%",
        background: "rgba(255, 255, 255, 0.95)",

        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        borderBottom: "1px solid #f1f1f1",
    },

    headerInner: {
        width: "100%",
        maxWidth: 1132,
        margin: "0 auto",
        padding: "10px 16px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    small: {
        color: "#6b7280",
    },
    logo: {
        margin: 0,
    },
    loginButton: {
        padding: "9px 16px",
        borderRadius: 10,
        background: "#111827",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
    },
    heroWrapper: {
        width: "100%",
        maxWidth: 1132,
        margin: "12px auto 0",
        padding: "0 16px",
    },

    hero: {
        width: "100%",
        padding: "28px 22px",
        borderRadius: 20,
        background: "#111827",
        color: "#fff",
    },

    heroSmall: {
        margin: 0,
        marginBottom: 8,
        fontSize: 12,
        fontWeight: 600,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    heroTitle: {
        margin: 0,
        maxWidth: 480,
        fontSize: "clamp(24px, 5vw, 34px)",
        lineHeight: 1.15,
        fontWeight: 750,
    },

    heroText: {
        maxWidth: 500,
        marginTop: 10,
        marginBottom: 18,
        fontSize: 14,
        lineHeight: 1.6,
        color: "#d1d5db",
    },

    primaryButton: {
        padding: "11px 16px",
        border: 0,
        borderRadius: 10,
        background: "#fff",
        color: "#111827",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
    },
    section: {
        padding: "10px 20px 30px",
    },
    categories: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
        gap: 12,
    },
    category: {
        background: "#f3f4f6",
        padding: 18,
        borderRadius: 14,
        textAlign: "center",
        fontWeight: 600,
    },
    categoryIcon: {
        fontSize: 26,
        marginBottom: 8,
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    viewAll: {
        fontSize: 14,
        color: "#6b7280",
    },
    products: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 16,
    },
    product: {
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
    },
    productImage: {
        height: 170,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 50,
    },
    productBody: {
        padding: 15,
    },
    price: {
        marginBottom: 0,
        fontWeight: 700,
    },
    perDay: {
        color: "#6b7280",
        fontWeight: 400,
    },
    brand: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
    },

    brandLogo: {
        width: 135,
        height: 45,
        objectFit: "contain",
        objectPosition: "left center",
    },

    brandSubtitle: {
        marginLeft: 2,
        marginTop: -3,
        fontSize: 11,
        color: "#6b7280",
    },
};
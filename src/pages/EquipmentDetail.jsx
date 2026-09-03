import { Link, useParams } from "react-router-dom";

export default function EquipmentDetail() {
    const { id } = useParams();

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <Link to="/equipment">←</Link>
                <strong>Detail Equipment</strong>
                <div></div>
            </header>

            <main style={styles.container}>
                <div style={styles.image}>📷</div>

                <small style={styles.category}>CAMERA</small>

                <h1 style={styles.title}>Sony A7 III</h1>

                <div style={styles.status}>● Tersedia</div>

                <p style={styles.price}>
                    Rp350.000
                    <span style={styles.day}> / hari</span>
                </p>

                <hr style={styles.hr} />

                <h3>Deskripsi</h3>

                <p style={styles.description}>
                    Kamera mirrorless full-frame untuk kebutuhan produksi video,
                    commercial, dokumentasi, dan konten profesional.
                </p>

                <h3>Spesifikasi</h3>

                <div style={styles.spec}>
                    <span>Sensor</span>
                    <strong>Full Frame</strong>
                </div>

                <div style={styles.spec}>
                    <span>Resolusi</span>
                    <strong>24.2 MP</strong>
                </div>

                <div style={styles.spec}>
                    <span>Video</span>
                    <strong>4K</strong>
                </div>

                <button style={styles.button}>
                    Pilih Tanggal Rental
                </button>

                <small>ID Equipment: {id}</small>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#fff",
    },
    header: {
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        display: "grid",
        gridTemplateColumns: "50px 1fr 50px",
        textAlign: "center",
    },
    container: {
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 40px",
    },
    image: {
        height: 350,
        background: "#f1f2f4",
        borderRadius: 22,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 80,
        marginBottom: 24,
    },
    category: {
        color: "#6b7280",
    },
    title: {
        margin: "6px 0",
    },
    status: {
        color: "#15803d",
    },
    price: {
        fontSize: 22,
        fontWeight: 800,
    },
    day: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: 400,
    },
    hr: {
        border: 0,
        borderTop: "1px solid #ececec",
        margin: "24px 0",
    },
    description: {
        color: "#4b5563",
        lineHeight: 1.6,
    },
    spec: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #f1f1f1",
    },
    button: {
        width: "100%",
        marginTop: 28,
        marginBottom: 15,
        padding: 16,
        border: 0,
        borderRadius: 14,
        background: "#111827",
        color: "#fff",
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer",
    },
};
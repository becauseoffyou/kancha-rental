import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Buat Akun</h1>
                <p style={styles.subtitle}>
                    Daftar untuk mulai menyewa peralatan syuting.
                </p>

                <button style={styles.googleButton}>
                    <span style={styles.googleIcon}>G</span>
                    Daftar dengan Google
                </button>

                <div style={styles.divider}>
                    <span style={styles.line}></span>
                    <span style={styles.or}>atau</span>
                    <span style={styles.line}></span>
                </div>

                <input style={styles.input} placeholder="Nama lengkap" />
                <input style={styles.input} type="email" placeholder="Email" />
                <input style={styles.input} placeholder="Nomor WhatsApp" />
                <input style={styles.input} type="password" placeholder="Password" />

                <button style={styles.button}>Daftar</button>

                <p style={styles.text}>
                    Sudah punya akun?{" "}
                    <Link to="/login" style={styles.link}>
                        Masuk
                    </Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        padding: 28,
        borderRadius: 18,
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
    },
    title: {
        margin: 0,
    },
    subtitle: {
        color: "#6b7280",
        marginBottom: 24,
    },
    input: {
        width: "100%",
        padding: "14px 16px",
        marginBottom: 14,
        border: "1px solid #d1d5db",
        borderRadius: 12,
        fontSize: 16,
    },
    button: {
        width: "100%",
        padding: 14,
        background: "#111827",
        color: "#fff",
        border: 0,
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 700,
    },
    text: {
        textAlign: "center",
        marginTop: 20,
    },
    link: {
        fontWeight: 700,
    },
    googleButton: {
        width: "100%",
        padding: 14,
        border: "1px solid #d1d5db",
        background: "#fff",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
    },

    googleIcon: {
        marginRight: 10,
        fontWeight: 800,
    },

    divider: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "20px 0",
    },

    line: {
        flex: 1,
        height: 1,
        background: "#e5e7eb",
    },

    or: {
        fontSize: 13,
        color: "#9ca3af",
    },
};
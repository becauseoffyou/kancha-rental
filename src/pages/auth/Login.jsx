import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import logoKancha from "../../assets/logo_kancha.png";

export default function Login() {
    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <img
                    src={logoKancha}
                    alt="KANCHA Rental"
                    style={styles.logo}
                />
                <p style={styles.subtitle}>Rental Peralatan Syuting</p>

                {/* <button style={styles.googleButton}>
                    <span style={styles.googleIcon}>G</span>
                    Lanjutkan dengan Google
                </button>

                <div style={styles.divider}>
                    <span style={styles.line}></span>
                    <span style={styles.or}>atau</span>
                    <span style={styles.line}></span>
                </div> */}

                <input style={styles.input} type="email" placeholder="Email" />
                <input style={styles.input} type="password" placeholder="Password" />

                <button style={styles.button}>Masuk</button>

                <p style={styles.text}>
                    Belum punya akun?{" "}
                    <Link to="/register" style={styles.link}>
                        Daftar
                    </Link>
                </p>
            </div>
            <BottomNav />
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 20px 90px",
        background: "#f5f6f8",
    },
    card: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        padding: 28,
        borderRadius: 20,
        boxShadow: "0 12px 40px rgba(0,0,0,.08)",
    },
    logo: {
        margin: 0,
        fontSize: 34,
        textAlign: "center",
    },
    subtitle: {
        marginTop: 6,
        marginBottom: 24,
        color: "#6b7280",
        textAlign: "center",
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
        cursor: "pointer",
    },
    text: {
        textAlign: "center",
        marginTop: 20,
    },
    link: {
        fontWeight: 700,
    },
    logo: {
        width: 170,
        height: "auto",
        objectFit: "contain",
        display: "block",
        margin: "0 auto 20px",
    },
};
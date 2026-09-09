import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import BottomNav from "../../components/BottomNav";
import logoKancha from "../../assets/logo_kancha.png";
import authService from "../../services/authService";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi Data",
                text: "Email dan password wajib diisi.",
                confirmButtonColor: "#111827",
            });
            return;
        }

        try {
            setLoading(true);

            const data = await authService.login({
                email,
                password,
            });

            // Simpan JWT + data user
            authService.saveSession(data);

            await Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: `Selamat datang, ${data.user.name}!`,
                timer: 1200,
                showConfirmButton: false,
            });

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            console.error("Login error:", error);

            Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text:
                    error.message ||
                    "Email atau password tidak sesuai.",
                confirmButtonColor: "#111827",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <img
                    src={logoKancha}
                    alt="KANCHA Rental"
                    style={styles.logo}
                />

                <p style={styles.subtitle}>
                    Rental Peralatan Syuting
                </p>

                <form onSubmit={handleLogin}>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        autoComplete="email"
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        autoComplete="current-password"
                    />

                    <button
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                        }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Memproses..."
                            : "Masuk"}
                    </button>
                </form>

                <p style={styles.text}>
                    Belum punya akun?{" "}
                    <Link
                        to="/register"
                        style={styles.link}
                    >
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
        boxSizing: "border-box",
    },

    card: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        padding: 28,
        borderRadius: 20,
        boxShadow: "0 12px 40px rgba(0,0,0,.08)",
        boxSizing: "border-box",
    },

    logo: {
        width: 170,
        height: "auto",
        objectFit: "contain",
        display: "block",
        margin: "0 auto 20px",
    },

    subtitle: {
        marginTop: 6,
        marginBottom: 24,
        color: "#6b7280",
        textAlign: "center",
    },

    input: {
        width: "100%",
        padding: "14px 16px",
        marginBottom: 14,
        border: "1px solid #d1d5db",
        borderRadius: 12,
        fontSize: 16,
        boxSizing: "border-box",
        outline: "none",
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
        color: "#111827",
    },
};
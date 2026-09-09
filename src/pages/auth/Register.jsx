import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import BottomNav from "../../components/BottomNav";
import authService from "../../services/authService";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] =
        useState("");
    const [email, setEmail] =
        useState("");
    const [phone, setPhone] =
        useState("");
    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);
    const [error, setError] =
        useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const data =
                await authService.register({
                    name,
                    email,
                    phone,
                    password,
                });

            authService.saveSession(data);

            navigate("/verification");
        } catch (err) {
            setError(
                err.message ||
                "Registrasi gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>
                    Buat Akun
                </h1>

                <p style={styles.subtitle}>
                    Daftar untuk mulai menyewa
                    peralatan syuting.
                </p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        placeholder="Nama lengkap"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        style={styles.input}
                        placeholder="Nomor WhatsApp"
                        value={phone}
                        onChange={(e) =>
                            setPhone(
                                e.target.value
                            )
                        }
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        minLength={6}
                        required
                    />

                    <button
                        style={{
                            ...styles.button,
                            ...(loading
                                ? styles.buttonDisabled
                                : {}),
                        }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Mendaftarkan..."
                            : "Daftar"}
                    </button>
                </form>

                <p style={styles.text}>
                    Sudah punya akun?{" "}
                    <Link
                        to="/login"
                        style={styles.link}
                    >
                        Masuk
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
        borderRadius: 18,
        boxShadow:
            "0 10px 30px rgba(0,0,0,.08)",
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
        boxSizing: "border-box",
        padding: "14px 16px",
        marginBottom: 14,
        border:
            "1px solid #d1d5db",
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

    buttonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },

    error: {
        padding: "12px 14px",
        marginBottom: 16,
        background: "#fef2f2",
        color: "#b91c1c",
        borderRadius: 10,
        fontSize: 14,
    },

    text: {
        textAlign: "center",
        marginTop: 20,
    },

    link: {
        fontWeight: 700,
    },
};
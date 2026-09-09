import {
    useEffect,
    useState,
} from "react";
import {
    useNavigate,
} from "react-router-dom";

import BottomNav from "../components/BottomNav";
import authService from "../services/authService";
import verificationService from "../services/verificationService";

export default function Verification() {
    const navigate = useNavigate();

    const [nik, setNik] =
        useState("");

    const [fullName, setFullName] =
        useState("");

    const [ktp, setKtp] =
        useState(null);

    const [selfie, setSelfie] =
        useState(null);

    const [ktpPreview, setKtpPreview] =
        useState("");

    const [
        selfiePreview,
        setSelfiePreview,
    ] = useState("");

    const [status, setStatus] =
        useState("UNVERIFIED");

    const [
        rejectionReason,
        setRejectionReason,
    ] = useState("");

    const [loading, setLoading] =
        useState(true);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadVerification();
    }, []);

    const loadVerification = async () => {
        try {
            setLoading(true);
            setError("");

            const user =
                await authService.getMe();

            setFullName(user.name || "");

            if (
                user.verification_status ===
                "VERIFIED"
            ) {
                setStatus("VERIFIED");
                return;
            }

            const verification =
                await verificationService
                    .getMyVerification();

            if (verification) {
                setStatus(
                    verification.verification_status
                );

                setNik(
                    verification.nik || ""
                );

                setFullName(
                    verification.full_name ||
                    user.name ||
                    ""
                );

                setRejectionReason(
                    verification.rejection_reason ||
                    ""
                );
            } else {
                setStatus("UNVERIFIED");
            }
        } catch (err) {
            if (
                err.message === "Belum login" ||
                err.message.includes("Token")
            ) {
                navigate("/login");
                return;
            }

            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKtpChange = (e) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        setKtp(file);

        setKtpPreview(
            URL.createObjectURL(file)
        );
    };

    const handleSelfieChange = (e) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        setSelfie(file);

        setSelfiePreview(
            URL.createObjectURL(file)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{16}$/.test(nik)) {
            setError(
                "NIK harus terdiri dari 16 digit angka."
            );
            return;
        }

        if (!ktp) {
            setError(
                "Foto KTP wajib diupload."
            );
            return;
        }

        if (!selfie) {
            setError(
                "Foto selfie wajah wajib diupload."
            );
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await verificationService
                .submitVerification({
                    nik,
                    fullName,
                    ktp,
                    selfie,
                });

            /*
             * Refresh user dari backend supaya
             * localStorage ikut mendapatkan
             * status terbaru.
             */
            const user =
                await authService.getMe();

            localStorage.setItem(
                "kancha_user",
                JSON.stringify(user)
            );

            setStatus("PENDING");
            setRejectionReason("");
        } catch (err) {
            setError(
                err.message ||
                "Gagal mengirim verifikasi"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.centerPage}>
                <div style={styles.loading}>
                    Memuat data verifikasi...
                </div>
            </div>
        );
    }

    /*
     * SUDAH VERIFIED
     */
    if (status === "VERIFIED") {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <div style={styles.successIcon}>
                        ✓
                    </div>

                    <h1 style={styles.statusTitle}>
                        Identitas Terverifikasi
                    </h1>

                    <p style={styles.statusText}>
                        Identitas kamu sudah
                        berhasil diverifikasi.
                        Kamu sudah dapat melakukan
                        penyewaan peralatan KANCHA.
                    </p>

                    <button
                        style={styles.button}
                        onClick={() =>
                            navigate("/equipment")
                        }
                    >
                        Lihat Equipment
                    </button>
                </div>

                <BottomNav />
            </div>
        );
    }

    /*
     * MENUNGGU ADMIN
     */
    if (status === "PENDING") {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <div style={styles.pendingIcon}>
                        ⏳
                    </div>

                    <h1 style={styles.statusTitle}>
                        Verifikasi Sedang Diproses
                    </h1>

                    <p style={styles.statusText}>
                        Foto KTP dan selfie kamu
                        sudah berhasil dikirim.
                        Admin KANCHA akan melakukan
                        pemeriksaan data terlebih
                        dahulu.
                    </p>

                    <div style={styles.infoBox}>
                        Status
                        <strong
                            style={
                                styles.pendingText
                            }
                        >
                            Menunggu Verifikasi
                        </strong>
                    </div>

                    <button
                        style={styles.secondaryButton}
                        onClick={
                            loadVerification
                        }
                    >
                        Cek Status
                    </button>

                    <button
                        style={styles.homeButton}
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Kembali ke Home
                    </button>
                </div>

                <BottomNav />
            </div>
        );
    }

    /*
     * UNVERIFIED / REJECTED
     */
    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>
                    Verifikasi Identitas
                </h1>

                <p style={styles.subtitle}>
                    Verifikasi identitas diperlukan
                    sebelum melakukan penyewaan
                    equipment.
                </p>

                {status === "REJECTED" && (
                    <div
                        style={
                            styles.rejectedBox
                        }
                    >
                        <strong>
                            Verifikasi ditolak
                        </strong>

                        <span>
                            {rejectionReason ||
                                "Silakan periksa kembali data dan foto yang kamu kirim."}
                        </span>
                    </div>
                )}

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                >
                    <label style={styles.label}>
                        NIK
                    </label>

                    <input
                        style={styles.input}
                        type="text"
                        inputMode="numeric"
                        maxLength={16}
                        placeholder="16 digit NIK"
                        value={nik}
                        onChange={(e) =>
                            setNik(
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            )
                        }
                        required
                    />

                    <label style={styles.label}>
                        Nama Lengkap
                    </label>

                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Sesuai KTP"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(
                                e.target.value
                            )
                        }
                        required
                    />

                    <div style={styles.uploadSection}>
                        <label style={styles.label}>
                            Foto KTP
                        </label>

                        <p style={styles.helper}>
                            Pastikan seluruh bagian
                            KTP terlihat jelas dan
                            tidak buram.
                        </p>

                        <label
                            style={
                                styles.uploadBox
                            }
                        >
                            {ktpPreview ? (
                                <img
                                    src={ktpPreview}
                                    alt="Preview KTP"
                                    style={
                                        styles.ktpPreview
                                    }
                                />
                            ) : (
                                <>
                                    <span
                                        style={
                                            styles.uploadIcon
                                        }
                                    >
                                        ＋
                                    </span>

                                    <strong>
                                        Upload Foto KTP
                                    </strong>

                                    <small
                                        style={
                                            styles.uploadHint
                                        }
                                    >
                                        JPG, PNG atau
                                        WEBP • Maks. 5 MB
                                    </small>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handleKtpChange
                                }
                                style={
                                    styles.hiddenInput
                                }
                            />
                        </label>
                    </div>

                    <div style={styles.uploadSection}>
                        <label style={styles.label}>
                            Selfie Wajah
                        </label>

                        <p style={styles.helper}>
                            Pastikan wajah terlihat
                            jelas dan tidak
                            menggunakan masker atau
                            kacamata hitam.
                        </p>

                        <label
                            style={
                                styles.uploadBox
                            }
                        >
                            {selfiePreview ? (
                                <img
                                    src={
                                        selfiePreview
                                    }
                                    alt="Preview Selfie"
                                    style={
                                        styles.selfiePreview
                                    }
                                />
                            ) : (
                                <>
                                    <span
                                        style={
                                            styles.uploadIcon
                                        }
                                    >
                                        ◎
                                    </span>

                                    <strong>
                                        Upload Selfie
                                    </strong>

                                    <small
                                        style={
                                            styles.uploadHint
                                        }
                                    >
                                        Foto wajah
                                        terbaru
                                    </small>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                capture="user"
                                onChange={
                                    handleSelfieChange
                                }
                                style={
                                    styles.hiddenInput
                                }
                            />
                        </label>
                    </div>

                    <div style={styles.notice}>
                        Data identitas digunakan
                        untuk proses verifikasi
                        penyewa.
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            ...styles.button,
                            ...(submitting
                                ? styles.buttonDisabled
                                : {}),
                        }}
                    >
                        {submitting
                            ? "Mengirim..."
                            : status ===
                                "REJECTED"
                                ? "Kirim Ulang Verifikasi"
                                : "Kirim Verifikasi"}
                    </button>
                </form>
            </div>

            <BottomNav />
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "30px 20px 110px",
        background: "#f5f6f8",
        boxSizing: "border-box",
    },

    centerPage: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6f8",
    },

    loading: {
        color: "#6b7280",
        fontWeight: 600,
    },

    card: {
        width: "100%",
        maxWidth: 440,
        background: "#fff",
        padding: 28,
        borderRadius: 18,
        boxShadow:
            "0 10px 30px rgba(0,0,0,.08)",
        boxSizing: "border-box",
    },

    title: {
        margin: 0,
        fontSize: 26,
    },

    subtitle: {
        marginTop: 8,
        marginBottom: 26,
        color: "#6b7280",
        lineHeight: 1.6,
    },

    label: {
        display: "block",
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 8,
    },

    helper: {
        color: "#6b7280",
        fontSize: 13,
        lineHeight: 1.5,
        marginTop: -2,
        marginBottom: 10,
    },

    input: {
        width: "100%",
        padding: "14px 16px",
        marginBottom: 18,
        border: "1px solid #d1d5db",
        borderRadius: 12,
        fontSize: 16,
        boxSizing: "border-box",
        outline: "none",
    },

    uploadSection: {
        marginBottom: 22,
    },

    uploadBox: {
        minHeight: 150,
        border: "2px dashed #d1d5db",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        cursor: "pointer",
        overflow: "hidden",
        padding: 10,
        boxSizing: "border-box",
        textAlign: "center",
    },

    uploadIcon: {
        fontSize: 30,
        fontWeight: 700,
    },

    uploadHint: {
        color: "#9ca3af",
    },

    hiddenInput: {
        display: "none",
    },

    ktpPreview: {
        width: "100%",
        maxHeight: 230,
        objectFit: "contain",
        borderRadius: 10,
    },

    selfiePreview: {
        width: 150,
        height: 150,
        objectFit: "cover",
        borderRadius: "50%",
    },

    notice: {
        background: "#f3f4f6",
        padding: 13,
        borderRadius: 10,
        color: "#4b5563",
        fontSize: 13,
        lineHeight: 1.5,
        marginBottom: 18,
    },

    button: {
        width: "100%",
        padding: 14,
        border: 0,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
    },

    buttonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },

    error: {
        background: "#fef2f2",
        color: "#b91c1c",
        padding: 13,
        borderRadius: 10,
        marginBottom: 18,
        fontSize: 14,
    },

    rejectedBox: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        background: "#fef2f2",
        color: "#991b1b",
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        fontSize: 14,
        lineHeight: 1.5,
    },

    successIcon: {
        width: 64,
        height: 64,
        margin: "5px auto 18px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#dcfce7",
        color: "#15803d",
        fontSize: 30,
        fontWeight: 800,
    },

    pendingIcon: {
        fontSize: 50,
        textAlign: "center",
        marginBottom: 15,
    },

    statusTitle: {
        textAlign: "center",
        margin: 0,
        fontSize: 24,
    },

    statusText: {
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 1.6,
        margin: "12px 0 22px",
    },

    infoBox: {
        background: "#fffbeb",
        padding: 15,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginBottom: 14,
        fontSize: 13,
        color: "#6b7280",
    },

    pendingText: {
        color: "#b45309",
        fontSize: 15,
    },

    secondaryButton: {
        width: "100%",
        padding: 13,
        border: "1px solid #111827",
        borderRadius: 12,
        background: "#fff",
        color: "#111827",
        fontWeight: 700,
        cursor: "pointer",
        marginBottom: 10,
    },

    homeButton: {
        width: "100%",
        padding: 13,
        border: 0,
        background: "transparent",
        color: "#6b7280",
        fontWeight: 600,
        cursor: "pointer",
    },
};
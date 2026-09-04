import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCopy,
    FiClock,
    FiCheckCircle,
} from "react-icons/fi";

export default function Payment() {
    const { id } = useParams();
    const location = useLocation();

    const paymentData = location.state || {
        orderNumber: id || "KNC-20260905-001",
        paymentType: "DP",
        grandTotal: 1100000,
        paymentAmount: 550000,
        remainingAmount: 550000,
    };
    const [selectedBank, setSelectedBank] = useState("BCA");
    const [paymentMethod, setPaymentMethod] = useState("TRANSFER");
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const bankAccounts = {
        BCA: {
            bank: "BCA",
            accountNumber: "1234567890",
            accountName: "PT KANCHA CREATIVE",
        },
        MANDIRI: {
            bank: "Mandiri",
            accountNumber: "9876543210",
            accountName: "PT KANCHA CREATIVE",
        },
        BRI: {
            bank: "BRI",
            accountNumber: "1122334455",
            accountName: "PT KANCHA CREATIVE",
        },
        BNI: {
            bank: "BNI",
            accountNumber: "5566778899",
            accountName: "PT KANCHA CREATIVE",
        },
    };

    const activeBank = bankAccounts[selectedBank];
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const rupiah = (value) =>
        `Rp${Number(value).toLocaleString("id-ID")}`;

    const formatTimer = (seconds) => {
        const minute = Math.floor(seconds / 60);
        const second = seconds % 60;

        return `${String(minute).padStart(2, "0")}:${String(
            second
        ).padStart(2, "0")}`;
    };

    const copyAccount = () => {
        navigator.clipboard.writeText("1234567890");
        alert("Nomor rekening berhasil disalin");
    };

    const handleConfirmPayment = () => {
        alert(
            "Pembayaran berhasil dikonfirmasi. Mohon tunggu proses verifikasi."
        );
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <Link to="/booking" style={styles.backButton}>
                        <FiArrowLeft size={20} />
                    </Link>

                    <div>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.headerTitle}>Pembayaran</h2>
                    </div>
                </div>
            </header>

            <main style={styles.container}>
                <div style={styles.timerCard}>
                    <div style={styles.timerIcon}>
                        <FiClock size={20} />
                    </div>

                    <div>
                        <small style={styles.timerLabel}>
                            Selesaikan pembayaran dalam
                        </small>

                        <strong style={styles.timer}>
                            {formatTimer(timeLeft)}
                        </strong>
                    </div>
                </div>

                <div style={styles.card}>
                    <small style={styles.cardLabel}>
                        INFORMASI PESANAN
                    </small>

                    <div style={styles.row}>
                        <span>Nomor Pesanan</span>
                        <strong>{paymentData.orderNumber}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Jenis Pembayaran</span>
                        <strong>
                            {paymentData.paymentType === "DP"
                                ? "DP 50%"
                                : "Lunas"}
                        </strong>
                    </div>

                    <div style={styles.row}>
                        <span>Total Pesanan</span>
                        <strong>
                            {rupiah(paymentData.grandTotal)}
                        </strong>
                    </div>

                    {paymentData.paymentType === "DP" && (
                        <div style={styles.row}>
                            <span>Sisa Pembayaran</span>
                            <strong style={{ color: "#c2410c" }}>
                                {rupiah(paymentData.remainingAmount)}
                            </strong>
                        </div>
                    )}
                </div>

                <div style={styles.amountCard}>
                    <small style={styles.amountLabel}>
                        TOTAL YANG HARUS DIBAYAR
                    </small>

                    <strong style={styles.amount}>
                        {rupiah(paymentData.paymentAmount)}
                    </strong>
                </div>

                <div style={styles.card}>
                    <small style={styles.cardLabel}>
                        METODE PEMBAYARAN
                    </small>

                    <div style={styles.methodGrid}>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("TRANSFER")}
                            style={{
                                ...styles.methodButton,
                                ...(paymentMethod === "TRANSFER" && (
                                    <div style={styles.card}>
                                        <small style={styles.cardLabel}>
                                            PILIH BANK TUJUAN
                                        </small>

                                        <div style={styles.bankGrid}>
                                            {Object.keys(bankAccounts).map((bankKey) => (
                                                <button
                                                    key={bankKey}
                                                    type="button"
                                                    onClick={() => setSelectedBank(bankKey)}
                                                    style={{
                                                        ...styles.bankOption,
                                                        ...(selectedBank === bankKey
                                                            ? styles.bankOptionActive
                                                            : {}),
                                                    }}
                                                >
                                                    {bankAccounts[bankKey].bank}
                                                </button>
                                            ))}
                                        </div>

                                        <div style={styles.divider} />

                                        <small style={styles.cardLabel}>
                                            INFORMASI REKENING
                                        </small>

                                        <div style={styles.bankBox}>
                                            <div>
                                                <small style={styles.bankName}>
                                                    BANK {activeBank.bank.toUpperCase()}
                                                </small>

                                                <strong style={styles.accountNumber}>
                                                    {activeBank.accountNumber}
                                                </strong>

                                                <span style={styles.accountName}>
                                                    {activeBank.accountName}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        activeBank.accountNumber
                                                    );

                                                    alert(
                                                        `Nomor rekening ${activeBank.bank} berhasil disalin`
                                                    );
                                                }}
                                                style={styles.copyButton}
                                            >
                                                <FiCopy size={16} />
                                            </button>
                                        </div>

                                        <div style={styles.transferNote}>
                                            Transfer sesuai nominal pembayaran ke rekening
                                            KANCHA di atas.
                                        </div>
                                    </div>
                                )
                                    ? styles.methodActive
                                    : {}),
                            }}
                        >
                            <strong>Transfer Bank</strong>
                            <span>Transfer ke rekening KANCHA</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod("QRIS")}
                            style={{
                                ...styles.methodButton,
                                ...(paymentMethod === "QRIS"
                                    ? styles.methodActive
                                    : {}),
                            }}
                        >
                            <strong>QRIS</strong>
                            <span>Scan QR melalui aplikasi pembayaran</span>
                        </button>
                    </div>
                </div>


                {paymentMethod === "TRANSFER" && (
                    <div style={styles.card}>
                        <small style={styles.cardLabel}>
                            PILIH BANK TUJUAN
                        </small>

                        <div style={styles.bankGrid}>
                            {Object.keys(bankAccounts).map((bankKey) => (
                                <button
                                    key={bankKey}
                                    type="button"
                                    onClick={() => setSelectedBank(bankKey)}
                                    style={{
                                        ...styles.bankOption,
                                        ...(selectedBank === bankKey
                                            ? styles.bankOptionActive
                                            : {}),
                                    }}
                                >
                                    {bankAccounts[bankKey].bank}
                                </button>
                            ))}
                        </div>

                        <div style={styles.divider} />

                        <small style={styles.cardLabel}>
                            INFORMASI REKENING
                        </small>

                        <div style={styles.bankBox}>
                            <div>
                                <small style={styles.bankName}>
                                    BANK {activeBank.bank.toUpperCase()}
                                </small>

                                <strong style={styles.accountNumber}>
                                    {activeBank.accountNumber}
                                </strong>

                                <span style={styles.accountName}>
                                    {activeBank.accountName}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        activeBank.accountNumber
                                    );

                                    alert(
                                        `Nomor rekening ${activeBank.bank} berhasil disalin`
                                    );
                                }}
                                style={styles.copyButton}
                            >
                                <FiCopy size={16} />
                            </button>
                        </div>

                        <div style={styles.transferNote}>
                            Transfer sesuai nominal pembayaran ke rekening
                            KANCHA di atas.
                        </div>
                    </div>
                )}

                {paymentMethod === "QRIS" && (
                    <div style={styles.card}>
                        <small style={styles.cardLabel}>QRIS</small>

                        <div style={styles.qrPlaceholder}>
                            <div style={styles.fakeQr}>
                                QR
                            </div>

                            <strong>Scan QRIS KANCHA</strong>

                            <span style={styles.qrText}>
                                Gunakan mobile banking atau e-wallet yang
                                mendukung QRIS.
                            </span>
                        </div>
                    </div>
                )}

                <div style={styles.statusCard}>
                    <FiCheckCircle size={19} />

                    <div>
                        <strong>Menunggu Pembayaran</strong>

                        <span>
                            Status akan diperbarui setelah pembayaran
                            berhasil diverifikasi.
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    style={styles.bookingButton}
                    onClick={handleConfirmPayment}
                >
                    Konfirmasi Pembayaran
                </button>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f7f7f7",
        color: "#111827",
    },

    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #f1f1f1",
    },

    headerInner: {
        maxWidth: 700,
        margin: "0 auto",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    bankGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8,
    },

    bankOption: {
        minHeight: 42,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        background: "#fff",
        color: "#6b7280",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
    },

    bankOptionActive: {
        border: "2px solid #111827",
        background: "#111827",
        color: "#fff",
    },

    divider: {
        height: 1,
        background: "#eeeeee",
        margin: "16px 0",
    },
    backButton: {
        width: 38,
        height: 38,
        minWidth: 38,
        borderRadius: 10,
        background: "#f3f4f6",
        color: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    small: {
        fontSize: 9,
        color: "#9ca3af",
        letterSpacing: 1.2,
        fontWeight: 700,
    },

    headerTitle: {
        margin: "2px 0 0",
        fontSize: 19,
    },

    container: {
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        padding: "16px 16px 40px",
    },

    card: {
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        border: "1px solid #eeeeee",
    },

    cardLabel: {
        display: "block",
        marginBottom: 14,
        fontSize: 9,
        letterSpacing: 1.1,
        color: "#9ca3af",
        fontWeight: 700,
    },

    row: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        padding: "7px 0",
        fontSize: 12,
    },

    timerCard: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        marginBottom: 14,
        background: "#fff7ed",
        color: "#c2410c",
        borderRadius: 16,
        border: "1px solid #fed7aa",
    },

    timerIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffedd5",
    },

    timerLabel: {
        display: "block",
        fontSize: 10,
        marginBottom: 3,
    },

    timer: {
        fontSize: 18,
    },

    amountCard: {
        padding: 18,
        marginBottom: 14,
        borderRadius: 16,
        background: "#111827",
        color: "#fff",
    },

    amountLabel: {
        display: "block",
        marginBottom: 6,
        fontSize: 9,
        color: "#d1d5db",
        letterSpacing: 1,
    },

    amount: {
        fontSize: 26,
    },

    methodGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
    },

    methodButton: {
        padding: 13,
        minHeight: 85,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: "#fff",
        color: "#111827",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },

    methodActive: {
        border: "2px solid #111827",
        background: "#f9fafb",
    },

    bankBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 12,
        background: "#f9fafb",
    },

    bankName: {
        display: "block",
        fontSize: 10,
        color: "#6b7280",
    },

    accountNumber: {
        display: "block",
        fontSize: 20,
        margin: "4px 0",
    },

    accountName: {
        fontSize: 10,
        color: "#6b7280",
    },

    copyButton: {
        width: 38,
        height: 38,
        border: 0,
        borderRadius: 10,
        background: "#111827",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    transferNote: {
        marginTop: 12,
        padding: 11,
        borderRadius: 10,
        background: "#f9fafb",
        color: "#6b7280",
        fontSize: 10,
        lineHeight: 1.5,
    },

    qrPlaceholder: {
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 10,
    },

    fakeQr: {
        width: 150,
        height: 150,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
        fontWeight: 700,
    },

    qrText: {
        maxWidth: 300,
        fontSize: 10,
        lineHeight: 1.5,
        color: "#9ca3af",
    },

    statusCard: {
        display: "flex",
        alignItems: "flex-start",
        gap: 11,
        padding: 14,
        marginBottom: 14,
        borderRadius: 14,
        background: "#fff",
        border: "1px solid #e5e7eb",
        fontSize: 11,
    },

    bookingButton: {
        width: "100%",
        height: 48,
        border: 0,
        borderRadius: 13,
        background: "#111827",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: "pointer",
    },
};
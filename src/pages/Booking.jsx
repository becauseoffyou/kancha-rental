import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";

const bookings = [
    {
        id: "BK-001",
        orderNumber: "KNC-20260905-001",
        equipment: "Sony A7 III",
        date: "05 Sep 2026 - 07 Sep 2026",
        duration: 3,
        total: 1100000,
        paymentStatus: "UNPAID",
        rentalStatus: "PENDING_PAYMENT",
    },
    {
        id: "BK-002",
        orderNumber: "KNC-20260901-002",
        equipment: "Sigma 24-70mm F2.8",
        date: "01 Sep 2026 - 02 Sep 2026",
        duration: 2,
        total: 500000,
        paymentStatus: "DP_PAID",
        rentalStatus: "WAITING_CONFIRMATION",
    },
    {
        id: "BK-003",
        orderNumber: "KNC-20260828-003",
        equipment: "Sony FX3",
        date: "28 Agu 2026 - 30 Agu 2026",
        duration: 3,
        total: 2250000,
        paymentStatus: "PAID",
        rentalStatus: "READY_FOR_PICKUP",
    },
    {
        id: "BK-004",
        orderNumber: "KNC-20260820-004",
        equipment: "Godox SL60W",
        date: "20 Agu 2026 - 21 Agu 2026",
        duration: 2,
        total: 240000,
        paymentStatus: "PAID",
        rentalStatus: "COMPLETED",
    },
];

const getRentalStatus = (status) => {
    switch (status) {
        case "PENDING_PAYMENT":
            return {
                label: "Menunggu Pembayaran",
                color: "#b91c1c",
                background: "#fef2f2",
            };

        case "WAITING_CONFIRMATION":
            return {
                label: "Menunggu Konfirmasi",
                color: "#c2410c",
                background: "#fff7ed",
            };

        case "CONFIRMED":
            return {
                label: "Dikonfirmasi",
                color: "#1d4ed8",
                background: "#eff6ff",
            };

        case "READY_FOR_PICKUP":
            return {
                label: "Siap Diambil",
                color: "#0369a1",
                background: "#f0f9ff",
            };

        case "RENTED":
            return {
                label: "Sedang Disewa",
                color: "#7c3aed",
                background: "#f5f3ff",
            };

        case "OVERDUE":
            return {
                label: "Terlambat",
                color: "#b91c1c",
                background: "#fef2f2",
            };

        case "COMPLETED":
            return {
                label: "Selesai",
                color: "#15803d",
                background: "#f0fdf4",
            };

        case "CANCELLED":
            return {
                label: "Dibatalkan",
                color: "#6b7280",
                background: "#f3f4f6",
            };

        default:
            return {
                label: status,
                color: "#6b7280",
                background: "#f3f4f6",
            };
    }
};

const getPaymentStatus = (status) => {
    switch (status) {
        case "DP_PAID":
            return {
                label: "DP 50% Dibayar",
                color: "#c2410c",
            };

        case "PAID":
            return {
                label: "Lunas",
                color: "#15803d",
            };

        default:
            return {
                label: "Belum Dibayar",
                color: "#b91c1c",
            };
    }
};

export default function Booking() {
    const handleCancel = (bookingId) => {
        const confirmCancel = window.confirm(
            "Apakah Anda yakin ingin membatalkan pesanan ini?"
        );

        if (confirmCancel) {
            alert(`Pesanan ${bookingId} dibatalkan`);
        }
    };

    const rupiah = (value) =>
        `Rp${Number(value).toLocaleString("id-ID")}`;

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.title}>Booking Saya</h2>
                    </div>

                    <span style={styles.headerCount}>
                        {bookings.length} Booking
                    </span>
                </div>
            </header>

            <main style={styles.content}>
                <div style={styles.list}>
                    {bookings.map((booking) => {
                        const rentalStatus = getRentalStatus(
                            booking.rentalStatus
                        );

                        const paymentStatus = getPaymentStatus(
                            booking.paymentStatus
                        );

                        return (
                            <div key={booking.id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <div>
                                        <small style={styles.orderNumber}>
                                            {booking.orderNumber}
                                        </small>

                                        <h3 style={styles.equipmentName}>
                                            {booking.equipment}
                                        </h3>
                                    </div>

                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            color: rentalStatus.color,
                                            background: rentalStatus.background,
                                        }}
                                    >
                                        {rentalStatus.label}
                                    </span>
                                </div>

                                <div style={styles.bookingInfo}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>
                                            Periode Rental
                                        </span>

                                        <strong style={styles.infoValue}>
                                            {booking.date}
                                        </strong>
                                    </div>

                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>
                                            Durasi
                                        </span>

                                        <strong style={styles.infoValue}>
                                            {booking.duration} Hari
                                        </strong>
                                    </div>

                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>
                                            Total
                                        </span>

                                        <strong style={styles.infoValue}>
                                            {rupiah(booking.total)}
                                        </strong>
                                    </div>
                                </div>

                                <div style={styles.paymentInfo}>
                                    <span>Pembayaran</span>

                                    <strong
                                        style={{
                                            color: paymentStatus.color,
                                        }}
                                    >
                                        {paymentStatus.label}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        ...styles.actions,
                                        gridTemplateColumns:
                                            booking.rentalStatus ===
                                                "PENDING_PAYMENT"
                                                ? "1fr 1fr"
                                                : "1fr",
                                    }}
                                >
                                    <Link
                                        to={`/booking/${booking.id}`}
                                        style={styles.buttonLink}
                                    >
                                        Lihat Detail
                                    </Link>

                                    {booking.rentalStatus ===
                                        "PENDING_PAYMENT" && (
                                            <button
                                                type="button"
                                                style={styles.cancelButton}
                                                onClick={() =>
                                                    handleCancel(booking.id)
                                                }
                                            >
                                                Batalkan
                                            </button>
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

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
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #f1f1f1",
    },

    headerInner: {
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerCount: {
        padding: "7px 10px",
        borderRadius: 999,
        background: "#f3f4f6",
        color: "#6b7280",
        fontSize: 11,
        fontWeight: 700,
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

    content: {
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "14px 16px",
    },

    list: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
    },

    card: {
        background: "#fff",
        borderRadius: 18,
        padding: 18,
        border: "1px solid #eeeeee",
        boxShadow: "0 6px 20px rgba(0,0,0,.04)",
    },

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 16,
    },

    orderNumber: {
        display: "block",
        marginBottom: 5,
        fontSize: 9,
        color: "#9ca3af",
        fontWeight: 700,
        letterSpacing: 0.5,
    },

    equipmentName: {
        margin: 0,
        fontSize: 16,
    },

    statusBadge: {
        padding: "6px 9px",
        borderRadius: 999,
        fontSize: 9,
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    bookingInfo: {
        padding: "12px 0",
        borderTop: "1px solid #f3f4f6",
        borderBottom: "1px solid #f3f4f6",
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 20,
        padding: "5px 0",
    },

    infoLabel: {
        fontSize: 11,
        color: "#6b7280",
    },

    infoValue: {
        fontSize: 11,
        textAlign: "right",
    },

    paymentInfo: {
        marginTop: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
        fontSize: 10,
        color: "#6b7280",
    },

    actions: {
        display: "grid",
        gap: 10,
        marginTop: 16,
    },

    buttonLink: {
        width: "100%",
        height: 42,
        padding: "0 12px",
        border: "1px solid #111827",
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    },

    cancelButton: {
        width: "100%",
        height: 42,
        padding: "0 12px",
        border: "1px solid #dc2626",
        borderRadius: 12,
        background: "#fff",
        color: "#dc2626",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    },
};
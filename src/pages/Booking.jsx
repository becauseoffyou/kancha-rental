import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";
const bookings = [
    {
        id: "BK-001",
        equipment: "Sony A7 III",
        date: "05 Sep 2026 - 07 Sep 2026",
        duration: 3,
        total: 1050000,
        status: "Menunggu Pembayaran",
    },
    {
        id: "BK-002",
        equipment: "Sigma 24-70mm F2.8",
        date: "28 Agu 2026 - 29 Agu 2026",
        duration: 2,
        total: 500000,
        status: "Selesai",
    },
];

export default function Booking() {

    const handleCancel = (bookingId) => {
        const confirmCancel = window.confirm(
            "Apakah Anda yakin ingin membatalkan pesanan ini?"
        );

        if (confirmCancel) {
            alert(`Pesanan ${bookingId} dibatalkan`);
        }
    };
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.title}>Booking Saya</h2>
                    </div>

                    <span style={styles.headerCount}>
                        {bookings.length} Item
                    </span>
                </div>
            </header>

            <main style={styles.content}>


                <div style={styles.list}>
                    {bookings.map((booking) => (
                        <div key={booking.id} style={styles.card}>
                            <div style={styles.cardTop}>
                                <div>
                                    <small style={styles.bookingId}>{booking.id}</small>
                                    <h3 style={styles.equipment}>{booking.equipment}</h3>
                                </div>

                                <span
                                    style={{
                                        ...styles.status,
                                        ...(booking.status === "Selesai"
                                            ? styles.completed
                                            : styles.pending),
                                    }}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.label}>Tanggal Rental</span>
                                <strong style={styles.value}>{booking.date}</strong>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.label}>Durasi</span>
                                <strong style={styles.value}>
                                    {booking.duration} Hari
                                </strong>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.totalRow}>
                                <span style={styles.totalLabel}>Total</span>

                                <strong style={styles.total}>
                                    Rp{booking.total.toLocaleString("id-ID")}
                                </strong>
                            </div>

                            {/* {booking.status !== "Selesai" && ( */}
                            <div style={styles.actions}>
                                <div
                                    style={{
                                        ...styles.actions,
                                        gridTemplateColumns:
                                            booking.status === "Menunggu Pembayaran"
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

                                    {booking.status === "Menunggu Pembayaran" && (
                                        <button
                                            type="button"
                                            style={styles.cancelButton}
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            Batalkan
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* )} */}
                        </div>
                    ))}
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

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },

    sectionTitle: {
        margin: 0,
        fontSize: 16,
    },

    count: {
        fontSize: 12,
        color: "#6b7280",
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
        marginBottom: 18,
    },

    bookingId: {
        color: "#9ca3af",
        fontSize: 11,
    },

    equipment: {
        margin: "4px 0 0",
        fontSize: 17,
    },

    status: {
        padding: "7px 9px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    pending: {
        background: "#fff7ed",
        color: "#c2410c",
    },

    completed: {
        background: "#ecfdf5",
        color: "#047857",
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        marginBottom: 10,
    },

    label: {
        fontSize: 12,
        color: "#6b7280",
    },

    value: {
        fontSize: 12,
        textAlign: "right",
    },

    divider: {
        height: 1,
        background: "#eeeeee",
        margin: "14px 0",
    },

    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    totalLabel: {
        fontSize: 13,
        color: "#6b7280",
    },

    total: {
        fontSize: 18,
    },

    button: {
        width: "100%",
        marginTop: 16,
        padding: 12,
        border: 0,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
    },
    actions: {
        display: "grid",
        gap: 10,
        marginTop: 16,
    },

    button: {
        flex: 1,
        padding: 12,
        border: 0,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
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

    invoiceButton: {
        flex: 1,
        padding: 12,
        border: "1px solid #111827",
        borderRadius: 12,
        textAlign: "center",
        background: "#fff",
        color: "#111827",
        fontWeight: 700,
        cursor: "pointer",
    },

};
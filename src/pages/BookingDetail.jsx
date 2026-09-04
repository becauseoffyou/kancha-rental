import { Link, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiFileText,
    FiCheckCircle,
} from "react-icons/fi";

export default function BookingDetail() {
    const { id } = useParams();

    // sementara dummy, nanti ambil dari API berdasarkan ID
    const booking = {
        id: id,
        orderNumber: "KNC-20260905-001",

        equipment: "Sony A7 III",
        equipmentCode: "CAM-SNY-A73-001",
        category: "Camera",

        startDate: "05 September 2026",
        endDate: "07 September 2026",
        duration: 3,

        pricePerDay: 350000,

        subtotal: 1050000,
        deliveryFee: 50000,
        total: 1100000,

        paymentType: "DP",
        paymentStatus: "DP_PAID",

        paidAmount: 550000,
        remainingAmount: 550000,

        rentalStatus: "Menunggu Konfirmasi",

        accessories: [
            "Sony A7 III Body",
            "Battery NP-FZ100 × 2",
            "Battery Charger",
            "Strap",
            "Body Cap",
            "Memory Card 64GB",
            "Camera Bag",
        ],
    };

    const getPaymentStatus = () => {
        switch (booking.paymentStatus) {
            case "DP_PAID":
                return {
                    label: "DP 50% Dibayar",
                    color: "#c2410c",
                    background: "#fff7ed",
                };

            case "PAID":
                return {
                    label: "Lunas",
                    color: "#15803d",
                    background: "#f0fdf4",
                };

            default:
                return {
                    label: "Belum Dibayar",
                    color: "#b91c1c",
                    background: "#fef2f2",
                };
        }
    };

    const paymentStatus = getPaymentStatus();

    const rupiah = (value) =>
        `Rp${Number(value).toLocaleString("id-ID")}`;

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <Link to="/booking" style={styles.backButton}>
                        <FiArrowLeft size={20} />
                    </Link>

                    <div style={styles.headerText}>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.title}>Detail Booking</h2>
                    </div>
                </div>
            </header>

            <main style={styles.content}>
                {/* STATUS */}
                <div style={styles.statusCard}>
                    <div style={styles.statusIcon}>
                        <FiClock size={22} />
                    </div>

                    <div>
                        <small style={styles.statusLabel}>Status Rental</small>
                        <h3 style={styles.statusTitle}>
                            {booking.rentalStatus}
                        </h3>
                    </div>
                </div>
                <div style={styles.card}>
                    <small style={styles.cardLabel}>INFORMASI PESANAN</small>

                    <div style={styles.row}>
                        <span>Nomor Pesanan</span>
                        <strong>{booking.orderNumber}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Tanggal Pesanan</span>
                        <strong>{booking.bookingDate}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Kode Unit</span>
                        <strong>{booking.equipmentCode}</strong>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span>Mulai Rental</span>
                        <strong>{booking.startDate}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Selesai Rental</span>
                        <strong>{booking.endDate}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Durasi Rental</span>
                        <strong>{booking.duration} Hari</strong>
                    </div>
                </div>

                {/* EQUIPMENT */}
                <div style={styles.card}>
                    <small style={styles.cardLabel}>EQUIPMENT</small>

                    <div style={styles.equipment}>
                        <div style={styles.image}>📷</div>

                        <div>
                            <small style={styles.category}>
                                {booking.category}
                            </small>

                            <h3 style={styles.equipmentName}>
                                {booking.equipment}
                            </h3>

                            <p style={styles.price}>
                                Rp{booking.pricePerDay.toLocaleString("id-ID")}
                                <span style={styles.day}> / hari</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div style={styles.card}>
                    <small style={styles.cardLabel}>KELENGKAPAN EQUIPMENT</small>

                    <div style={styles.accessoryList}>
                        {booking.accessories.map((item, index) => (
                            <div key={index} style={styles.accessoryItem}>
                                <FiCheckCircle size={16} />

                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DETAIL RENTAL */}


                {/* PEMBAYARAN */}
                <div style={styles.card}>
                    <small style={styles.cardLabel}>PEMBAYARAN</small>

                    <div style={styles.row}>
                        <span>Metode Pembayaran</span>
                        <strong>
                            {booking.paymentType === "DP"
                                ? "DP 50%"
                                : "Bayar Lunas"}
                        </strong>
                    </div>

                    <div style={styles.row}>
                        <span>Status Pembayaran</span>

                        <span
                            style={{
                                ...styles.paymentBadge,
                                color: paymentStatus.color,
                                background: paymentStatus.background,
                            }}
                        >
                            {paymentStatus.label}
                        </span>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span>Subtotal Rental</span>
                        <strong>{rupiah(booking.subtotal)}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Biaya Delivery</span>
                        <strong>
                            {booking.deliveryFee === 0
                                ? "Gratis"
                                : rupiah(booking.deliveryFee)}
                        </strong>
                    </div>

                    <div style={styles.row}>
                        <span>Total Pesanan</span>
                        <strong>{rupiah(booking.total)}</strong>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span>Sudah Dibayar</span>
                        <strong style={{ color: "#15803d" }}>
                            {rupiah(booking.paidAmount)}
                        </strong>
                    </div>

                    {booking.remainingAmount > 0 && (
                        <div style={styles.row}>
                            <span>Sisa Pembayaran</span>
                            <strong style={{ color: "#c2410c" }}>
                                {rupiah(booking.remainingAmount)}
                            </strong>
                        </div>
                    )}
                </div>

                {/* BOOKING ID */}
                <div style={styles.bookingInfo}>
                    <span>Booking ID</span>
                    <strong>{booking.id}</strong>
                </div>

                {/* ACTION */}
                <div style={styles.actions}>
                    <Link
                        to={`/invoice/${booking.id}`}
                        style={styles.invoiceButton}
                    >
                        <FiFileText size={17} />
                        Lihat Invoice
                    </Link>

                    {booking.paymentStatus === "UNPAID" && (
                        <Link
                            to={`/payment/${booking.orderNumber}`}
                            state={{
                                orderNumber: booking.orderNumber,
                                paymentType: booking.paymentType,
                                grandTotal: booking.total,
                                paymentAmount:
                                    booking.paymentType === "DP"
                                        ? booking.total * 0.5
                                        : booking.total,
                                remainingAmount:
                                    booking.paymentType === "DP"
                                        ? booking.total * 0.5
                                        : 0,
                            }}
                            style={styles.payButton}
                        >
                            Bayar Sekarang
                        </Link>
                    )}

                    {booking.paymentStatus === "DP_PAID" && (
                        <Link
                            to={`/payment/${booking.orderNumber}`}
                            state={{
                                orderNumber: booking.orderNumber,
                                paymentType: "REMAINING",
                                grandTotal: booking.total,
                                paymentAmount: booking.remainingAmount,
                                remainingAmount: 0,
                            }}
                            style={styles.payButton}
                        >
                            Lunasi Sisa • {rupiah(booking.remainingAmount)}
                        </Link>
                    )}
                </div>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f7f7f8",
        paddingBottom: 30,
    },
    paymentBadge: {
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        whiteSpace: "nowrap",
    },
    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
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

    backButton: {
        width: 38,
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        background: "#f3f4f6",
        color: "#111827",
    },

    headerText: {
        flex: 1,
    },

    small: {
        fontSize: 9,
        color: "#9ca3af",
        letterSpacing: 1.2,
        fontWeight: 700,
    },

    title: {
        margin: "2px 0 0",
        fontSize: 19,
    },

    content: {
        maxWidth: 700,
        margin: "0 auto",
        padding: "14px 16px",
    },

    statusCard: {
        background: "#111827",
        color: "#fff",
        padding: 16,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },

    statusIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        background: "rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    statusLabel: {
        color: "#9ca3af",
        fontSize: 10,
    },

    statusTitle: {
        margin: "3px 0 0",
        fontSize: 15,
    },

    card: {
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #eeeeee",
        padding: 16,
        marginBottom: 12,
    },

    cardLabel: {
        display: "block",
        fontSize: 9,
        letterSpacing: 1.2,
        color: "#9ca3af",
        fontWeight: 700,
        marginBottom: 14,
    },

    equipment: {
        display: "flex",
        alignItems: "center",
        gap: 14,
    },

    image: {
        width: 75,
        height: 75,
        borderRadius: 14,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
    },

    category: {
        color: "#9ca3af",
        fontSize: 10,
    },

    equipmentName: {
        margin: "3px 0",
        fontSize: 16,
    },

    price: {
        margin: 0,
        fontWeight: 700,
        fontSize: 13,
    },

    day: {
        fontWeight: 400,
        color: "#9ca3af",
    },

    info: {
        display: "flex",
        gap: 12,
        alignItems: "center",
        marginBottom: 14,
    },

    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    infoContent: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
        fontSize: 12,
    },

    infoLabel: {
        color: "#9ca3af",
        fontSize: 10,
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 10,
        fontSize: 12,
    },

    divider: {
        height: 1,
        background: "#eeeeee",
        margin: "14px 0",
    },

    totalRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 13,
    },

    total: {
        fontSize: 19,
    },

    paymentStatus: {
        marginTop: 14,
        padding: 12,
        background: "#fff7ed",
        color: "#c2410c",
        borderRadius: 10,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
    },

    bookingInfo: {
        padding: "4px 2px 14px",
        display: "flex",
        justifyContent: "space-between",
        color: "#6b7280",
        fontSize: 11,
    },

    actions: {
        display: "flex",
        gap: 10,
    },

    invoiceButton: {
        flex: 1,
        padding: 13,
        border: "1px solid #111827",
        borderRadius: 12,
        background: "#fff",
        color: "#111827",
        fontWeight: 700,
        fontSize: 12,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },

    payButton: {
        flex: 1,
        padding: 13,
        border: 0,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },
    accessoryList: {
        display: "flex",
        flexDirection: "column",
        gap: 11,
    },

    accessoryItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12,
        color: "#374151",
    },
};
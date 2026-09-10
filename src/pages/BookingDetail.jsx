import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import bookingService from "../services/bookingService";
import paymentService from "../services/paymentService";
import Swal from "sweetalert2";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiFileText,
    FiCheckCircle,
} from "react-icons/fi";

export default function BookingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [creatingRemaining, setCreatingRemaining] =
        useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBooking();
    }, [id]);

    const loadBooking = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await bookingService.getByOrderNumber(id);

            setBookingData(data);
        } catch (error) {
            console.error(
                "Load booking detail error:",
                error
            );

            setError(
                error.message ||
                "Gagal mengambil detail booking"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 30 }}>
                Memuat detail booking...
            </div>
        );
    }

    if (error || !bookingData) {
        return (
            <div style={{ padding: 30 }}>
                {error || "Booking tidak ditemukan"}
            </div>
        );
    }

    const booking = bookingData.booking;
    const items = bookingData.items || [];
    const payments = bookingData.payments || [];

    const equipment = items[0];

    const paidAmount = payments
        .filter(
            (payment) =>
                payment.payment_status === "PAID"
        )
        .reduce(
            (total, payment) =>
                total + Number(payment.amount),
            0
        );

    const remainingAmount = Math.max(
        Number(booking.grand_total) - paidAmount,
        0
    );
    const remainingPayment = payments.find(
        (payment) =>
            payment.payment_type === "REMAINING" &&
            [
                "PENDING",
                "WAITING_VERIFICATION",
                "PAID",
            ].includes(payment.payment_status)
    );

    const remainingWaiting =
        remainingPayment?.payment_status ===
        "WAITING_VERIFICATION";

    const remainingPending =
        remainingPayment?.payment_status ===
        "PENDING";
    let paymentStatus = "UNPAID";

    if (
        paidAmount >= Number(booking.grand_total)
    ) {
        paymentStatus = "PAID";
    } else if (paidAmount > 0) {
        paymentStatus = "DP_PAID";
    }

    const rupiah = (value) =>
        `Rp. ${Number(value || 0).toLocaleString("id-ID")}`;

    const getPaymentStatusInfo = () => {
        switch (paymentStatus) {
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

    const paymentStatusInfo =
        getPaymentStatusInfo();
    const getRentalStatusLabel = (status) => {
        const labels = {
            PENDING_PAYMENT:
                "Menunggu Pembayaran",
            WAITING_CONFIRMATION:
                "Menunggu Konfirmasi",
            CONFIRMED:
                "Dikonfirmasi",
            READY_FOR_PICKUP:
                "Siap Diambil",
            RENTED:
                "Sedang Disewa",
            OVERDUE:
                "Terlambat",
            COMPLETED:
                "Selesai",
            CANCELLED:
                "Dibatalkan",
        };

        return labels[status] || status;
    };

    const handleRemainingPayment = async () => {
        try {
            setCreatingRemaining(true);

            const result =
                await Swal.fire({
                    title: "Lunasi Sisa Pembayaran?",
                    html: `
                    <div style="font-size:14px">
                        Sisa pembayaran
                        <br>
                        <strong style="font-size:20px">
                            ${rupiah(remainingAmount)}
                        </strong>
                    </div>
                `,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Ya, Lunasi",
                    cancelButtonText: "Nanti",
                    confirmButtonColor: "#111827",
                });

            if (!result.isConfirmed) {
                return;
            }

            await paymentService.createRemainingPayment(
                booking.order_number
            );

            navigate(
                `/payment/${booking.order_number}`
            );
        } catch (error) {
            console.error(
                "Create remaining payment error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.message ||
                    "Gagal membuat pembayaran pelunasan",
            });
        } finally {
            setCreatingRemaining(false);
        }
    };
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
                            {getRentalStatusLabel(
                                booking.rental_status
                            )}
                        </h3>
                    </div>
                </div>
                <div style={styles.card}>
                    <small style={styles.cardLabel}>INFORMASI PESANAN</small>

                    <div style={styles.row}>
                        <span>Nomor Pesanan</span>
                        <strong>{booking.order_number}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Tanggal Pesanan</span>
                        <strong>{new Date(
                            booking.created_at
                        ).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Kode Unit</span>
                        {/* <strong>{booking.equipment_code}</strong> */}
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span>Mulai Rental</span>
                        <strong>{booking.start_date}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Selesai Rental</span>
                        <strong>{booking.end_date}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Durasi Rental</span>
                        <strong>{equipment?.duration || 0} Hari</strong>
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
                                {equipment?.equipment_name || "-"}
                            </h3>

                            <p style={styles.price}>
                                {rupiah(
                                    equipment?.price_per_day || 0
                                )}
                                <span style={styles.day}>
                                    {" "}/ hari
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* <div style={styles.card}>
                    <small style={styles.cardLabel}>KELENGKAPAN EQUIPMENT</small>

                    <div style={styles.accessoryList}>
                        {booking.accessories.map((item, index) => (
                            <div key={index} style={styles.accessoryItem}>
                                <FiCheckCircle size={16} />

                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* DETAIL RENTAL */}


                {/* PEMBAYARAN */}
                <div style={styles.card}>
                    <small style={styles.cardLabel}>PEMBAYARAN</small>

                    <div style={styles.row}>
                        <span>Metode Pembayaran</span>
                        <strong>
                            {booking.payment_type === "DP"
                                ? "DP 50%"
                                : "Bayar Lunas"}
                        </strong>
                    </div>

                    <div style={styles.row}>
                        <span>Status Pembayaran</span>

                        <span
                            style={{
                                ...styles.paymentBadge,
                                color: paymentStatusInfo.color,
                                background: paymentStatusInfo.background,
                            }}
                        >
                            {paymentStatusInfo.label}
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
                            {Number(booking.delivery_fee) === 0
                                ? "Gratis"
                                : rupiah(booking.delivery_fee)}
                        </strong>
                    </div>

                    <div style={styles.row}>
                        <span>Total Pesanan</span>
                        <strong>{rupiah(booking.grand_total)}</strong>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span>Sudah Dibayar</span>
                        <strong style={{ color: "#15803d" }}>
                            {rupiah(paidAmount)}
                        </strong>
                    </div>

                    {remainingAmount > 0 && (
                        <div style={styles.row}>
                            <span>Sisa Pembayaran</span>

                            <strong
                                style={{ color: "#c2410c" }}
                            >
                                {rupiah(remainingAmount)}
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
                        to={`/invoice/${booking.order_number}`}
                        style={styles.invoiceButton}
                    >
                        <FiFileText size={17} />
                        Lihat Invoice
                    </Link>

                    {paymentStatus === "UNPAID" && (
                        <Link
                            to={`/payment/${booking.order_number}`}
                            style={styles.payButton}
                        >
                            Bayar Sekarang
                        </Link>
                    )}

                    {paymentStatus === "DP_PAID" &&
                        remainingAmount > 0 &&
                        !remainingPayment && (
                            <button
                                type="button"
                                onClick={handleRemainingPayment}
                                disabled={creatingRemaining}
                                style={{
                                    ...styles.payButton,
                                    opacity: creatingRemaining ? 0.6 : 1,
                                }}
                            >
                                {creatingRemaining
                                    ? "Memproses..."
                                    : `Lunasi Sisa • ${rupiah(
                                        remainingAmount
                                    )}`}
                            </button>
                        )}

                    {remainingPending && (
                        <Link
                            to={`/payment/${booking.order_number}`}
                            style={styles.payButton}
                        >
                            Lanjutkan Pelunasan
                        </Link>
                    )}

                    {remainingWaiting && (
                        <button
                            type="button"
                            disabled
                            style={{
                                ...styles.payButton,
                                opacity: 0.6,
                                cursor: "not-allowed",
                            }}
                        >
                            Pelunasan Menunggu Verifikasi
                        </button>
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
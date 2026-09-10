import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import bookingService from "../services/bookingService";

export default function Invoice() {
    const { id } = useParams();

    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadInvoice();
    }, [id]);

    const loadInvoice = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await bookingService.getByOrderNumber(id);

            setBookingData(data);
        } catch (error) {
            console.error("Load invoice error:", error);

            setError(
                error.message ||
                "Gagal mengambil invoice"
            );
        } finally {
            setLoading(false);
        }
    };

    const rupiah = (value) =>
        `Rp${Number(value || 0).toLocaleString("id-ID")}`;

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatDateTime = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentTypeLabel = (type) => {
        switch (type) {
            case "DP":
                return "DP 50%";

            case "REMAINING":
                return "Pelunasan";

            case "FULL":
                return "Bayar Lunas";

            default:
                return type || "Pembayaran";
        }
    };

    const getPaymentMethod = (payment) => {
        if (payment.payment_method === "TRANSFER") {
            if (payment.bank_code) {
                return `Transfer ${payment.bank_code}`;
            }

            if (payment.payment_channel) {
                return `Transfer ${payment.payment_channel}`;
            }

            return "Transfer Bank";
        }

        if (payment.payment_method === "QRIS") {
            return payment.payment_channel
                ? `QRIS ${payment.payment_channel}`
                : "QRIS";
        }

        if (payment.payment_channel) {
            return payment.payment_channel;
        }

        return payment.payment_method || "-";
    };

    const getPaymentStatusLabel = (status) => {
        switch (status) {
            case "PAID":
                return "PAID";

            case "WAITING_VERIFICATION":
                return "Menunggu Verifikasi";

            case "PENDING":
                return "Belum Dibayar";

            case "REJECTED":
                return "Ditolak";

            case "FAILED":
                return "Gagal";

            case "EXPIRED":
                return "Kadaluarsa";

            case "REFUNDED":
                return "Refund";

            default:
                return status || "-";
        }
    };

    const getPaymentStatusStyle = (status) => {
        switch (status) {
            case "PAID":
                return styles.paymentPaid;

            case "WAITING_VERIFICATION":
                return styles.paymentWaiting;

            case "REJECTED":
            case "FAILED":
                return styles.paymentRejected;

            default:
                return styles.paymentPending;
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingPage}>
                Memuat invoice...
            </div>
        );
    }

    if (error || !bookingData) {
        return (
            <div style={styles.loadingPage}>
                {error || "Invoice tidak ditemukan"}
            </div>
        );
    }

    const booking = bookingData.booking;
    const items = bookingData.items || [];
    const payments = bookingData.payments || [];

    const equipment = items[0];

    // ============================
    // PAYMENT CALCULATION
    // ============================

    const paidPayments = payments.filter(
        (payment) =>
            payment.payment_status === "PAID"
    );

    const paidAmount = paidPayments.reduce(
        (total, payment) =>
            total + Number(payment.amount || 0),
        0
    );

    const grandTotal = Number(
        booking.grand_total || 0
    );

    const remainingAmount = Math.max(
        grandTotal - paidAmount,
        0
    );

    const waitingPayment = payments.some(
        (payment) =>
            payment.payment_status ===
            "WAITING_VERIFICATION"
    );

    let paymentStatus = "Belum Dibayar";

    if (
        paidAmount >= grandTotal &&
        grandTotal > 0
    ) {
        paymentStatus = "Lunas";
    } else if (paidAmount > 0) {
        paymentStatus = "DP Dibayar";
    } else if (waitingPayment) {
        paymentStatus = "Menunggu Verifikasi";
    }

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <Link
                        to={`/booking/${booking.order_number}`}
                        style={styles.backButton}
                    >
                        <FiArrowLeft size={20} />
                    </Link>

                    <div>
                        <small style={styles.small}>
                            KANCHA RENTAL
                        </small>

                        <h2 style={styles.title}>
                            Invoice
                        </h2>
                    </div>
                </div>
            </header>

            <main style={styles.content}>
                <div style={styles.invoice}>

                    {/* WATERMARK PAID */}
                    {paymentStatus === "Lunas" && (
                        <div
                            style={
                                styles.paidWatermark
                            }
                        >
                            PAID
                        </div>
                    )}

                    {/* INVOICE HEADER */}
                    <div style={styles.invoiceTop}>
                        <div>
                            <small style={styles.label}>
                                INVOICE
                            </small>

                            <h2
                                style={
                                    styles.invoiceNumber
                                }
                            >
                                INV-
                                {booking.order_number}
                            </h2>
                        </div>

                        <div
                            style={{
                                ...styles.status,

                                ...(paymentStatus ===
                                    "Lunas"
                                    ? styles.statusPaid
                                    : paymentStatus ===
                                        "Menunggu Verifikasi"
                                        ? styles.statusWaiting
                                        : styles.statusUnpaid),
                            }}
                        >
                            {paymentStatus}
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* INFORMASI PESANAN */}
                    <div style={styles.section}>
                        <small
                            style={
                                styles.sectionTitle
                            }
                        >
                            INFORMASI PESANAN
                        </small>

                        <div style={styles.row}>
                            <span>
                                Nomor Pesanan
                            </span>

                            <strong>
                                {
                                    booking.order_number
                                }
                            </strong>
                        </div>

                        <div style={styles.row}>
                            <span>
                                Tanggal Invoice
                            </span>

                            <strong>
                                {formatDate(
                                    booking.created_at
                                )}
                            </strong>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* PENYEWA */}
                    <div style={styles.section}>
                        <small
                            style={
                                styles.sectionTitle
                            }
                        >
                            PENYEWA
                        </small>

                        <h3
                            style={
                                styles.customerName
                            }
                        >
                            {booking.customer_name ||
                                "-"}
                        </h3>

                        <p
                            style={
                                styles.customerInfo
                            }
                        >
                            {booking.customer_email ||
                                "-"}
                        </p>

                        <p
                            style={
                                styles.customerInfo
                            }
                        >
                            {booking.customer_phone ||
                                "-"}
                        </p>
                    </div>

                    <div style={styles.divider} />

                    {/* DETAIL RENTAL */}
                    <div style={styles.section}>
                        <small
                            style={
                                styles.sectionTitle
                            }
                        >
                            DETAIL RENTAL
                        </small>

                        {items.map((item) => (
                            <div
                                key={item.id}
                                style={styles.item}
                            >
                                <div>
                                    <strong>
                                        {
                                            item.equipment_name
                                        }
                                    </strong>

                                    <p
                                        style={
                                            styles.itemCode
                                        }
                                    >
                                        Qty:{" "}
                                        {
                                            item.quantity
                                        }
                                    </p>
                                </div>

                                <strong>
                                    {rupiah(
                                        item.price_per_day
                                    )}{" "}
                                    / hari
                                </strong>
                            </div>
                        ))}

                        <div
                            style={
                                styles.rentalInfo
                            }
                        >
                            <div>
                                <small>
                                    Mulai Rental
                                </small>

                                <strong>
                                    {formatDate(
                                        booking.start_date
                                    )}
                                </strong>
                            </div>

                            <div>
                                <small>
                                    Selesai Rental
                                </small>

                                <strong>
                                    {formatDate(
                                        booking.end_date
                                    )}
                                </strong>
                            </div>

                            <div>
                                <small>
                                    Durasi
                                </small>

                                <strong>
                                    {equipment?.duration ||
                                        0}{" "}
                                    Hari
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* RINCIAN BIAYA */}
                    <div style={styles.section}>
                        <small
                            style={
                                styles.sectionTitle
                            }
                        >
                            RINCIAN BIAYA
                        </small>

                        {items.map((item) => (
                            <div
                                key={item.id}
                                style={styles.row}
                            >
                                <span>
                                    {
                                        item.equipment_name
                                    }
                                    {" • "}
                                    {rupiah(
                                        item.price_per_day
                                    )}
                                    {" × "}
                                    {item.duration} hari
                                </span>

                                <strong>
                                    {rupiah(
                                        item.subtotal
                                    )}
                                </strong>
                            </div>
                        ))}

                        <div style={styles.row}>
                            <span>
                                Subtotal Rental
                            </span>

                            <strong>
                                {rupiah(
                                    booking.subtotal
                                )}
                            </strong>
                        </div>

                        <div style={styles.row}>
                            <span>
                                Biaya Delivery
                            </span>

                            <strong>
                                {Number(
                                    booking.delivery_fee
                                ) === 0
                                    ? "Gratis"
                                    : rupiah(
                                        booking.delivery_fee
                                    )}
                            </strong>
                        </div>

                        <div
                            style={styles.totalBox}
                        >
                            <span>
                                Total Pesanan
                            </span>

                            <strong
                                style={
                                    styles.total
                                }
                            >
                                {rupiah(
                                    grandTotal
                                )}
                            </strong>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* RIWAYAT PEMBAYARAN */}
                    <div style={styles.section}>
                        <small
                            style={
                                styles.sectionTitle
                            }
                        >
                            RIWAYAT PEMBAYARAN
                        </small>

                        {payments.length === 0 ? (
                            <div
                                style={
                                    styles.emptyPayment
                                }
                            >
                                Belum ada transaksi
                                pembayaran
                            </div>
                        ) : (
                            payments.map(
                                (payment) => (
                                    <div
                                        key={
                                            payment.id
                                        }
                                        style={
                                            styles.paymentItem
                                        }
                                    >
                                        <div
                                            style={
                                                styles.paymentTop
                                            }
                                        >
                                            <div>
                                                <strong>
                                                    {getPaymentTypeLabel(
                                                        payment.payment_type
                                                    )}
                                                </strong>

                                                <p
                                                    style={
                                                        styles.paymentMethod
                                                    }
                                                >
                                                    Pembayaran
                                                    melalui{" "}
                                                    <strong>
                                                        {getPaymentMethod(
                                                            payment
                                                        )}
                                                    </strong>
                                                </p>
                                            </div>

                                            <strong>
                                                {rupiah(
                                                    payment.amount
                                                )}
                                            </strong>
                                        </div>

                                        <div
                                            style={
                                                styles.paymentBottom
                                            }
                                        >
                                            <span>
                                                {formatDateTime(
                                                    payment.paid_at ||
                                                    payment.updated_at ||
                                                    payment.created_at
                                                )}
                                            </span>

                                            <span
                                                style={{
                                                    ...styles.paymentStatusBadge,
                                                    ...getPaymentStatusStyle(
                                                        payment.payment_status
                                                    ),
                                                }}
                                            >
                                                {getPaymentStatusLabel(
                                                    payment.payment_status
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )
                        )}

                        <div
                            style={styles.divider}
                        />

                        {/* SUMMARY PAYMENT */}
                        <div style={styles.row}>
                            <span>
                                Total Pesanan
                            </span>

                            <strong>
                                {rupiah(
                                    grandTotal
                                )}
                            </strong>
                        </div>

                        <div style={styles.row}>
                            <span>
                                Sudah Dibayar
                            </span>

                            <strong
                                style={{
                                    color: "#15803d",
                                }}
                            >
                                {rupiah(
                                    paidAmount
                                )}
                            </strong>
                        </div>

                        <div style={styles.row}>
                            <span>
                                Sisa Pembayaran
                            </span>

                            <strong
                                style={{
                                    color:
                                        remainingAmount >
                                            0
                                            ? "#c2410c"
                                            : "#15803d",
                                }}
                            >
                                {rupiah(
                                    remainingAmount
                                )}
                            </strong>
                        </div>
                    </div>
                </div>

                <button
                    style={styles.printButton}
                    onClick={() =>
                        window.print()
                    }
                >
                    <FiPrinter size={17} />
                    Print / Simpan PDF
                </button>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f7f7f8",
    },

    loadingPage: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f8",
        color: "#6b7280",
        fontSize: 13,
    },

    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #eeeeee",
    },

    headerInner: {
        width: "100%",
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
        borderRadius: 10,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#111827",
        textDecoration: "none",
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
        padding: "16px",
    },

    invoice: {
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #eeeeee",
        padding: 20,
    },

    // WATERMARK PAID
    paidWatermark: {
        position: "absolute",
        top: "45%",
        left: "50%",

        transform:
            "translate(-50%, -50%) rotate(-20deg)",

        fontSize: 90,
        fontWeight: 900,

        color:
            "rgba(220, 38, 38, 0.10)",

        border:
            "8px solid rgba(220, 38, 38, 0.10)",

        borderRadius: 12,

        padding: "5px 22px",

        letterSpacing: 8,

        pointerEvents: "none",
        userSelect: "none",

        zIndex: 1,
    },

    invoiceTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
        position: "relative",
        zIndex: 2,
    },

    label: {
        fontSize: 9,
        letterSpacing: 1.3,
        color: "#9ca3af",
        fontWeight: 700,
    },

    invoiceNumber: {
        margin: "4px 0 0",
        fontSize: 17,
    },

    status: {
        padding: "7px 10px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 10,
    },

    statusPaid: {
        background: "#f0fdf4",
        color: "#15803d",
    },

    statusWaiting: {
        background: "#fff7ed",
        color: "#c2410c",
    },

    statusUnpaid: {
        background: "#fef2f2",
        color: "#b91c1c",
    },

    divider: {
        height: 1,
        background: "#eeeeee",
        margin: "18px 0",
    },

    section: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        zIndex: 2,
    },

    sectionTitle: {
        fontSize: 9,
        letterSpacing: 1.2,
        color: "#9ca3af",
        fontWeight: 700,
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        fontSize: 12,
    },

    customerName: {
        margin: 0,
        fontSize: 15,
    },

    customerInfo: {
        margin: 0,
        color: "#6b7280",
        fontSize: 12,
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        gap: 15,
        fontSize: 12,
    },

    itemCode: {
        margin: "4px 0 0",
        color: "#9ca3af",
        fontSize: 10,
    },

    rentalInfo: {
        marginTop: 8,
        padding: 12,
        borderRadius: 12,
        background: "#f9fafb",
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: 10,
        fontSize: 10,
    },

    totalBox: {
        marginTop: 8,
        padding: 14,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
    },

    total: {
        fontSize: 19,
    },

    // ==========================
    // PAYMENT HISTORY
    // ==========================

    paymentItem: {
        padding: 12,
        border: "1px solid #eeeeee",
        borderRadius: 12,
        background: "#fafafa",
    },

    paymentTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        fontSize: 12,
    },

    paymentMethod: {
        margin: "5px 0 0",
        color: "#6b7280",
        fontSize: 11,
    },

    paymentBottom: {
        marginTop: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        color: "#9ca3af",
        fontSize: 10,
    },

    paymentStatusBadge: {
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 9,
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    paymentPaid: {
        background: "#f0fdf4",
        color: "#15803d",
    },

    paymentWaiting: {
        background: "#fff7ed",
        color: "#c2410c",
    },

    paymentPending: {
        background: "#f3f4f6",
        color: "#6b7280",
    },

    paymentRejected: {
        background: "#fef2f2",
        color: "#b91c1c",
    },

    emptyPayment: {
        padding: 14,
        borderRadius: 10,
        background: "#f9fafb",
        color: "#6b7280",
        fontSize: 11,
        textAlign: "center",
    },

    printButton: {
        marginTop: 12,
        width: "100%",
        padding: 14,
        border: 0,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
};
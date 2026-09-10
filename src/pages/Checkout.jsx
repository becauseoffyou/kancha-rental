import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    FiArrowLeft,
    FiCalendar,
    FiCheckCircle,
    FiShield,
} from "react-icons/fi";
import bookingService from "../services/bookingService";
import authService from "../services/authService";

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();

    const rental = location.state;
    const [user, setUser] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser =
                    await authService.getMe();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Load user checkout error:",
                    error
                );

                authService.logout();
                navigate("/login");
            }
        };

        loadUser();
    }, [navigate]);
    // Kalau checkout dibuka langsung tanpa pilih equipment
    if (!rental) {
        return (
            <div style={styles.emptyPage}>
                <h3>Data rental tidak ditemukan</h3>
                <p>Silakan pilih equipment dan periode rental terlebih dahulu.</p>

                <Link to="/equipment" style={styles.backEquipment}>
                    Pilih Equipment
                </Link>
            </div>
        );
    }

    const {
        equipmentId,
        equipmentName,
        equipmentCode,
        pricePerDay,
        startDate,
        endDate,
        duration,
        total,
    } = rental;

    const rupiah = (value) =>
        `Rp${Number(value).toLocaleString("id-ID")}`;

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };
    const [pickupMethod, setPickupMethod] = useState("PICKUP");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [paymentType, setPaymentType] = useState("DP");

    // 1. Hitung ongkir dulu
    const deliveryFee =
        pickupMethod === "DELIVERY" ? 50000 : 0;

    // 2. Baru hitung grand total
    const grandTotal = total + deliveryFee;

    // 3. Setelah grandTotal ada, baru hitung DP
    const paymentAmount =
        paymentType === "DP"
            ? Math.ceil(grandTotal * 0.5)
            : grandTotal;

    // 4. Hitung sisanya
    const remainingAmount =
        paymentType === "DP"
            ? grandTotal - paymentAmount
            : 0;

    const handleBooking = async () => {
        if (
            pickupMethod === "DELIVERY" &&
            !address.trim()
        ) {
            alert("Alamat delivery wajib diisi.");
            return;
        }

        try {
            setSubmitting(true);
            setBookingError("");

            const data =
                await bookingService.createBooking({
                    equipment_id: equipmentId,
                    start_date: startDate,
                    end_date: endDate,
                    pickup_method: pickupMethod,
                    delivery_address:
                        pickupMethod === "DELIVERY"
                            ? address
                            : null,
                    notes: notes,
                    payment_type: paymentType,
                });

            console.log(
                "BOOKING DARI BACKEND:",
                data
            );

            navigate(
                `/payment/${data.booking.order_number}`
            );

        } catch (error) {
            console.error(
                "Create booking error:",
                error
            );

            setBookingError(
                error.message ||
                "Gagal membuat pesanan"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={styles.backButton}
                    >
                        <FiArrowLeft size={20} />
                    </button>

                    <div>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.title}>Checkout</h2>
                    </div>
                </div>
            </header>

            <main style={styles.content}>
                {/* EQUIPMENT */}
                <div style={styles.card}>
                    <small style={styles.cardLabel}>EQUIPMENT</small>

                    <div style={styles.equipment}>
                        <div style={styles.image}>📷</div>

                        <div style={styles.equipmentInfo}>
                            <small style={styles.code}>
                                {equipmentCode || `EQ-${equipmentId}`}
                            </small>

                            <h3 style={styles.equipmentName}>
                                {equipmentName}
                            </h3>

                            <strong style={styles.price}>
                                {rupiah(pricePerDay)}
                                <span style={styles.day}> / hari</span>
                            </strong>
                        </div>
                    </div>
                </div>
                <div style={styles.card}>
                    <small style={styles.cardLabel}>DATA PENYEWA</small>

                    <div style={styles.customerHeader}>
                        <div style={styles.avatar}>
                            {user?.name?.charAt(0) || "U"}
                        </div>

                        <div>
                            <h3 style={styles.customerName}>{user?.name || "-"}</h3>
                            <span style={styles.customerEmail}>{user?.email || "-"}</span>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span>No. WhatsApp</span>
                        <strong>{user?.phone || "-"}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Status Identitas</span>

                        <strong
                            style={{
                                color:
                                    user?.verification_status ===
                                        "VERIFIED"
                                        ? "#15803d"
                                        : "#d97706",
                            }}
                        >
                            {user?.verification_status === "VERIFIED"
                                ? "Terverifikasi"
                                : user?.verification_status === "PENDING"
                                    ? "Sedang Diproses"
                                    : user?.verification_status === "REJECTED"
                                        ? "Ditolak"
                                        : "Belum Terverifikasi"}
                        </strong>
                    </div>
                </div>
                {/* PERIODE */}
                <div style={styles.card}>
                    <small style={styles.cardLabel}>PERIODE RENTAL</small>

                    <div style={styles.infoRow}>
                        <div style={styles.infoIcon}>
                            <FiCalendar />
                        </div>

                        <div style={styles.dateInfo}>
                            <span>Mulai Rental</span>
                            <strong>{formatDate(startDate)}</strong>
                        </div>
                    </div>

                    <div style={styles.infoRow}>
                        <div style={styles.infoIcon}>
                            <FiCalendar />
                        </div>

                        <div style={styles.dateInfo}>
                            <span>Selesai Rental</span>
                            <strong>{formatDate(endDate)}</strong>
                        </div>
                    </div>

                    <div style={styles.durationBox}>
                        <span>Durasi Rental</span>
                        <strong>{duration} Hari</strong>
                    </div>
                </div>


                <div style={styles.card}>
                    <small style={styles.cardLabel}>METODE PENGAMBILAN</small>

                    <div style={styles.methodGrid}>
                        <button
                            type="button"
                            onClick={() => setPickupMethod("PICKUP")}
                            style={{
                                ...styles.methodButton,
                                ...(pickupMethod === "PICKUP"
                                    ? styles.methodButtonActive
                                    : {}),
                            }}
                        >
                            <strong>Ambil Sendiri</strong>
                            <span>Ambil langsung di lokasi KANCHA</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPickupMethod("DELIVERY")}
                            style={{
                                ...styles.methodButton,
                                ...(pickupMethod === "DELIVERY"
                                    ? styles.methodButtonActive
                                    : {}),
                            }}
                        >
                            <strong>Delivery</strong>
                            <span>Equipment dikirim ke alamat Anda</span>
                        </button>
                    </div>

                    {pickupMethod === "DELIVERY" && (
                        <div style={styles.deliveryForm}>
                            <label style={styles.fieldLabel}>
                                Alamat Pengiriman
                            </label>

                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Masukkan alamat lengkap pengiriman..."
                                style={styles.textarea}
                            />

                            <small style={styles.deliveryNote}>
                                Biaya delivery sementara Rp. 35.000 / KM Nanti dapat
                                dihitung berdasarkan jarak/lokasi.
                            </small>
                        </div>
                    )}
                </div>

                <div style={styles.card}>
                    <small style={styles.cardLabel}>CATATAN PESANAN</small>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Equipment digunakan untuk shooting outdoor..."
                        style={styles.textarea}
                    />

                    <small style={styles.optionalText}>
                        Opsional
                    </small>
                </div>
                {/* VERIFIKASI */}
                <div style={styles.verificationCard}>
                    <FiShield size={22} />

                    <div style={styles.verificationText}>
                        <strong>Verifikasi Identitas</strong>

                        <span>
                            Identitas penyewa akan diverifikasi sebelum
                            pengambilan equipment.
                        </span>
                    </div>
                </div>

                <div style={styles.card}>
                    <small style={styles.cardLabel}>METODE PEMBAYARAN</small>

                    <div style={styles.methodGrid}>
                        <button
                            type="button"
                            onClick={() => setPaymentType("DP")}
                            style={{
                                ...styles.methodButton,
                                ...(paymentType === "DP"
                                    ? styles.methodButtonActive
                                    : {}),
                            }}
                        >
                            <strong>DP 50%</strong>
                            <span>
                                Bayar 50% sekarang, sisanya ketika pengambilan equipment
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentType("FULL")}
                            style={{
                                ...styles.methodButton,
                                ...(paymentType === "FULL"
                                    ? styles.methodButtonActive
                                    : {}),
                            }}
                        >
                            <strong>Bayar Lunas</strong>
                            <span>Bayar 100% biaya rental di depan</span>
                        </button>
                    </div>
                </div>
                {/* RINGKASAN */}
                <div style={styles.card}>
                    <small style={styles.cardLabel}>
                        RINGKASAN PEMBAYARAN
                    </small>

                    <div style={styles.row}>
                        <span>Subtotal Rental</span>
                        <strong>{rupiah(total)}</strong>
                    </div>

                    <div style={styles.row}>
                        <span>Biaya Pengiriman</span>
                        <strong>
                            {deliveryFee === 0
                                ? "Gratis"
                                : rupiah(deliveryFee)}
                        </strong>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span>Total Pesanan</span>
                        <strong>{rupiah(grandTotal)}</strong>
                    </div>

                    <div style={styles.paymentBox}>
                        <div>
                            <span style={styles.paymentLabel}>
                                {paymentType === "DP"
                                    ? "DP 50% Dibayar Sekarang"
                                    : "Dibayar Sekarang"}
                            </span>

                            <strong style={styles.paymentAmount}>
                                {rupiah(paymentAmount)}
                            </strong>
                        </div>
                    </div>

                    {paymentType === "DP" && (
                        <div style={styles.remainingRow}>
                            <span>Sisa Pembayaran</span>
                            <strong>{rupiah(remainingAmount)}</strong>
                        </div>
                    )}
                </div>

                {/* AGREEMENT */}
                <div style={styles.agreement}>
                    <FiCheckCircle size={17} />

                    <span>
                        Dengan melanjutkan pesanan, Anda menyetujui syarat
                        dan ketentuan rental KANCHA.
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleBooking}
                    disabled={submitting}
                    style={{
                        ...styles.bookingButton,
                        opacity: submitting ? 0.6 : 1,
                        cursor: submitting
                            ? "not-allowed"
                            : "pointer",
                    }}
                >
                    {submitting
                        ? "Membuat Pesanan..."
                        : "Buat Pesanan"}
                </button>
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
    customerHeader: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    bookingButton: {
        width: "100%",
        height: 52,
        border: "none",
        borderRadius: 14,
        background: "#111827",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 18px rgba(17, 24, 39, 0.12)",
    },
    avatar: {
        width: 44,
        height: 44,
        minWidth: 44,
        borderRadius: "50%",
        background: "#111827",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 700,
    },

    customerName: {
        margin: "0 0 3px",
        fontSize: 14,
    },

    customerEmail: {
        color: "#9ca3af",
        fontSize: 11,
    },

    optionalText: {
        display: "block",
        marginTop: 6,
        color: "#9ca3af",
        fontSize: 9,
    },
    paymentBox: {
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
    },

    paymentLabel: {
        display: "block",
        marginBottom: 4,
        fontSize: 10,
        color: "#d1d5db",
    },

    paymentAmount: {
        fontSize: 20,
    },

    remainingRow: {
        marginTop: 12,
        padding: "10px 12px",
        borderRadius: 10,
        background: "#fff7ed",
        color: "#c2410c",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
    },

    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #f1f1f1",
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
        minWidth: 38,
        border: 0,
        borderRadius: 10,
        background: "#f3f4f6",
        color: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
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
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        padding: "14px 16px",
    },

    card: {
        padding: 16,
        marginBottom: 12,
        background: "#fff",
        border: "1px solid #eeeeee",
        borderRadius: 16,
    },

    cardLabel: {
        display: "block",
        marginBottom: 14,
        fontSize: 9,
        letterSpacing: 1.2,
        color: "#9ca3af",
        fontWeight: 700,
    },

    equipment: {
        display: "flex",
        alignItems: "center",
        gap: 14,
    },

    image: {
        width: 70,
        height: 70,
        minWidth: 70,
        borderRadius: 13,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
    },

    equipmentInfo: {
        minWidth: 0,
    },

    code: {
        color: "#9ca3af",
        fontSize: 9,
    },

    equipmentName: {
        margin: "3px 0 6px",
        fontSize: 15,
    },

    price: {
        fontSize: 13,
    },

    day: {
        color: "#9ca3af",
        fontWeight: 400,
    },

    infoRow: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        marginBottom: 12,
    },

    infoIcon: {
        width: 36,
        height: 36,
        minWidth: 36,
        borderRadius: 10,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    dateInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
        fontSize: 12,
    },

    durationBox: {
        marginTop: 5,
        padding: 12,
        borderRadius: 11,
        background: "#f9fafb",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
    },

    verificationCard: {
        marginBottom: 12,
        padding: 15,
        borderRadius: 16,
        background: "#111827",
        color: "#fff",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
    },

    verificationText: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 12,
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        gap: 15,
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
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
    },

    agreement: {
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        padding: "4px 3px 14px",
        color: "#6b7280",
        fontSize: 10,
        lineHeight: 1.5,
    },

    checkoutButton: {
        width: "100%",
        height: 48,
        border: 0,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
    },

    emptyPage: {
        minHeight: "100vh",
        padding: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },

    backEquipment: {
        marginTop: 10,
        padding: "12px 18px",
        background: "#111827",
        color: "#fff",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: 13,
    },
    methodGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
    },

    methodButton: {
        minHeight: 88,
        padding: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fff",
        color: "#111827",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },

    methodButtonActive: {
        border: "2px solid #111827",
        background: "#f9fafb",
    },

    deliveryForm: {
        marginTop: 14,
        display: "flex",
        flexDirection: "column",
        gap: 7,
    },

    fieldLabel: {
        fontSize: 11,
        fontWeight: 700,
        color: "#374151",
    },

    textarea: {
        width: "100%",
        minHeight: 90,
        padding: 12,
        border: "1px solid #d1d5db",
        borderRadius: 10,
        resize: "vertical",
        fontFamily: "inherit",
        fontSize: 12,
        outline: "none",
        boxSizing: "border-box",
    },

    deliveryNote: {
        color: "#9ca3af",
        fontSize: 9,
        lineHeight: 1.5,
    },
};
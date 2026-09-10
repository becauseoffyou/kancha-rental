import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import equipmentService from "../services/equipmentService";
import Swal from "sweetalert2";
import authService from "../services/authService";

export default function EquipmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [availability, setAvailability] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        loadEquipment();
    }, [id]);

    useEffect(() => {
        const checkAvailability = async () => {
            if (!startDate || !endDate) {
                setAvailability(null);
                return;
            }

            try {
                setCheckingAvailability(true);

                const result =
                    await equipmentService.checkAvailability(
                        id,
                        startDate,
                        endDate
                    );

                setAvailability(result);
            } catch (error) {
                console.error(
                    "Check availability error:",
                    error
                );

                setAvailability(null);
            } finally {
                setCheckingAvailability(false);
            }
        };

        checkAvailability();
    }, [id, startDate, endDate]);

    const loadEquipment = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await equipmentService.getById(id);

            setEquipment(data);
            setActiveImage(0);
        } catch (error) {
            console.error("Load equipment detail error:", error);
            setError("Equipment tidak ditemukan");
        } finally {
            setLoading(false);
        }
    };

    const pricePerDay = Number(equipment?.price_per_day || 0);
    const availableUnits = Number(equipment?.available_units || 0);
    const totalUnits = Number(equipment?.total_units || 0);

    /*
     * Backend kita sekarang baru punya 1 image_url.
     * Nanti kalau sudah ada tabel equipment_images,
     * array ini bisa langsung diisi banyak gambar dari API.
     */
    const equipmentImages = equipment?.image_url
        ? [equipment.image_url]
        : [];

    const calculateDuration = () => {
        if (!startDate || !endDate) return 0;

        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);

        const diff = end - start;

        if (diff < 0) return 0;

        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const duration = calculateDuration();
    const total = duration * pricePerDay;

    const rupiah = (value) =>
        `Rp${Number(value).toLocaleString("id-ID")}`;

    const handlePreviousImage = () => {
        if (equipmentImages.length <= 1) return;

        setActiveImage((prev) =>
            prev === 0
                ? equipmentImages.length - 1
                : prev - 1
        );
    };

    const handleNextImage = () => {
        if (equipmentImages.length <= 1) return;

        setActiveImage((prev) =>
            prev === equipmentImages.length - 1
                ? 0
                : prev + 1
        );
    };

    const handleCheckout = async () => {
        // 1. Validasi periode rental
        if (!startDate || !endDate || duration <= 0) {
            await Swal.fire({
                icon: "warning",
                title: "Pilih Periode Rental",
                text: "Silakan pilih periode rental terlebih dahulu.",
                confirmButtonColor: "#111827",
            });

            return;
        }

        // 2. Validasi ketersediaan
        if (!availability) {
            await Swal.fire({
                icon: "warning",
                title: "Ketersediaan Belum Dicek",
                text: "Ketersediaan equipment belum berhasil dicek.",
                confirmButtonColor: "#111827",
            });

            return;
        }

        if (!availability.available) {
            await Swal.fire({
                icon: "error",
                title: "Equipment Tidak Tersedia",
                text: "Equipment tidak tersedia pada periode tersebut.",
                confirmButtonColor: "#111827",
            });

            return;
        }

        // 3. Cek apakah user sudah login
        const token = authService.getToken();

        if (!token) {
            const result = await Swal.fire({
                icon: "info",
                title: "Login Diperlukan",
                text: "Silakan login terlebih dahulu untuk melakukan rental.",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Batal",
                confirmButtonColor: "#111827",
            });

            if (result.isConfirmed) {
                navigate("/login");
            }

            return;
        }

        // 4. Ambil data user terbaru dari backend
        try {
            const user = await authService.getMe();

            // 5. Cek status verifikasi
            if (user.verification_status !== "VERIFIED") {
                let title = "Verifikasi Identitas Diperlukan";
                let text =
                    "Silakan verifikasi identitas terlebih dahulu sebelum melakukan rental.";

                if (user.verification_status === "PENDING") {
                    title = "Verifikasi Sedang Diproses";
                    text =
                        "Data identitas kamu masih dalam proses pemeriksaan admin.";
                }

                if (user.verification_status === "REJECTED") {
                    title = "Verifikasi Ditolak";
                    text =
                        "Silakan periksa alasan penolakan dan kirim ulang verifikasi identitas.";
                }

                const result = await Swal.fire({
                    icon:
                        user.verification_status === "REJECTED"
                            ? "error"
                            : "info",
                    title,
                    text,
                    showCancelButton: true,
                    confirmButtonText: "Lihat Verifikasi",
                    cancelButtonText: "Batal",
                    confirmButtonColor: "#111827",
                });

                if (result.isConfirmed) {
                    navigate("/verification");
                }

                return;
            }

            // 6. VERIFIED -> boleh checkout
            navigate("/checkout", {
                state: {
                    equipmentId: equipment.id,
                    equipmentName: equipment.name,
                    equipmentCode: null,
                    pricePerDay,
                    startDate,
                    endDate,
                    duration,
                    total,
                    availableUnits:
                        availability.available_units,
                },
            });
        } catch (error) {
            console.error("Checkout auth error:", error);

            authService.logout();

            await Swal.fire({
                icon: "warning",
                title: "Sesi Berakhir",
                text: "Silakan login kembali untuk melanjutkan.",
                confirmButtonColor: "#111827",
            });

            navigate("/login");
        }
    };

    if (loading) {
        return (
            <div style={styles.messagePage}>
                <div style={styles.messageCard}>
                    Memuat equipment...
                </div>
            </div>
        );
    }

    if (error || !equipment) {
        return (
            <div style={styles.messagePage}>
                <div style={styles.messageCard}>
                    <strong>Equipment tidak ditemukan.</strong>

                    <Link
                        to="/equipment"
                        style={styles.backToEquipment}
                    >
                        Kembali ke Equipment
                    </Link>
                </div>
            </div>
        );
    }

    const canCheckout =
        duration > 0 &&
        availability?.available === true &&
        !checkingAvailability;

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <Link
                        to="/equipment"
                        style={styles.backButton}
                    >
                        <FiArrowLeft size={20} />
                    </Link>

                    <div style={styles.headerText}>
                        <small style={styles.small}>
                            KANCHA RENTAL
                        </small>

                        <h2 style={styles.headerTitle}>
                            Detail Equipment
                        </h2>
                    </div>
                </div>
            </header>

            <main style={styles.container}>
                {/* =========================
                    GALLERY
                ========================= */}
                <div style={styles.gallery}>
                    <div style={styles.mainImageWrapper}>
                        {equipmentImages.length > 0 ? (
                            <img
                                src={
                                    equipmentImages[
                                    activeImage
                                    ]
                                }
                                alt={equipment.name}
                                style={styles.mainImage}
                            />
                        ) : (
                            <div style={styles.noImage}>
                                No Image
                            </div>
                        )}

                        {equipmentImages.length > 0 && (
                            <span style={styles.imageCounter}>
                                {activeImage + 1} /{" "}
                                {equipmentImages.length}
                            </span>
                        )}

                        {equipmentImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    style={{
                                        ...styles.sliderButton,
                                        left: 10,
                                    }}
                                    onClick={
                                        handlePreviousImage
                                    }
                                >
                                    ‹
                                </button>

                                <button
                                    type="button"
                                    style={{
                                        ...styles.sliderButton,
                                        right: 10,
                                    }}
                                    onClick={handleNextImage}
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>

                    {equipmentImages.length > 1 && (
                        <div style={styles.thumbnails}>
                            {equipmentImages.map(
                                (image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            setActiveImage(
                                                index
                                            )
                                        }
                                        style={{
                                            ...styles.thumbnailButton,
                                            ...(activeImage ===
                                                index
                                                ? styles.thumbnailActive
                                                : {}),
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`${equipment.name} ${index + 1
                                                }`}
                                            style={
                                                styles.thumbnailImage
                                            }
                                        />
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* =========================
                    INFORMASI EQUIPMENT
                ========================= */}
                <small style={styles.category}>
                    {equipment.category?.toUpperCase()}
                </small>

                <h1 style={styles.title}>
                    {equipment.name}
                </h1>

                <div
                    style={{
                        ...styles.status,
                        color:
                            availableUnits > 0
                                ? "#15803d"
                                : "#b91c1c",
                    }}
                >
                    ●{" "}
                    {availableUnits > 0
                        ? "Tersedia"
                        : "Tidak Tersedia"}
                </div>

                <p style={styles.price}>
                    {rupiah(pricePerDay)}

                    <span style={styles.day}>
                        {" "}
                        / hari
                    </span>
                </p>

                <hr style={styles.hr} />

                {/* =========================
                    DESKRIPSI
                ========================= */}
                <h3 style={styles.sectionTitle}>
                    Deskripsi
                </h3>

                <p style={styles.description}>
                    {equipment.description ||
                        "Belum ada deskripsi equipment."}
                </p>

                {/* =========================
                    INFO UNIT
                ========================= */}
                <h3 style={styles.sectionTitle}>
                    Informasi Unit
                </h3>

                <div style={styles.spec}>
                    <span>Total Unit</span>

                    <strong>
                        {totalUnits} Unit
                    </strong>
                </div>

                <div style={styles.spec}>
                    <span>Unit Tersedia</span>

                    <strong
                        style={{
                            color:
                                availableUnits > 0
                                    ? "#15803d"
                                    : "#b91c1c",
                        }}
                    >
                        {availableUnits} Unit
                    </strong>
                </div>

                <div style={styles.spec}>
                    <span>Kategori</span>

                    <strong>
                        {equipment.category || "-"}
                    </strong>
                </div>

                {/* =========================
                    PERIODE RENTAL
                ========================= */}
                <div style={styles.card}>
                    <small style={styles.cardLabel}>
                        PERIODE RENTAL
                    </small>

                    <div style={styles.dateGrid}>
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Mulai Rental
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    const value =
                                        e.target.value;

                                    setStartDate(value);

                                    if (
                                        endDate &&
                                        value > endDate
                                    ) {
                                        setEndDate("");
                                    }
                                }}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>
                                Selesai Rental
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                disabled={!startDate}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                                style={{
                                    ...styles.input,
                                    opacity: !startDate
                                        ? 0.5
                                        : 1,
                                    cursor: !startDate
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                            />
                        </div>
                    </div>

                    {checkingAvailability && (
                        <div style={styles.availabilityChecking}>
                            Mengecek ketersediaan...
                        </div>
                    )}

                    {!checkingAvailability &&
                        availability && (
                            <div
                                style={{
                                    ...styles.availabilityBox,
                                    ...(availability.available
                                        ? styles.availabilityAvailable
                                        : styles.availabilityUnavailable),
                                }}
                            >
                                {availability.available ? (
                                    <>
                                        <strong>
                                            ✓ Equipment tersedia
                                        </strong>

                                        <span>
                                            {
                                                availability.available_units
                                            }{" "}
                                            unit tersedia pada periode ini.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <strong>
                                            ✕ Equipment tidak tersedia
                                        </strong>

                                        <span>
                                            Semua unit sudah terbooking
                                            pada periode tersebut.
                                        </span>
                                    </>
                                )}
                            </div>
                        )}

                    {duration > 0 && (
                        <div style={styles.summary}>
                            <div
                                style={
                                    styles.summaryRow
                                }
                            >
                                <span>Harga / hari</span>

                                <strong>
                                    {rupiah(
                                        pricePerDay
                                    )}
                                </strong>
                            </div>

                            <div
                                style={
                                    styles.summaryRow
                                }
                            >
                                <span>
                                    Durasi Rental
                                </span>

                                <strong>
                                    {duration} Hari
                                </strong>
                            </div>

                            <div
                                style={styles.divider}
                            />

                            <div style={styles.totalRow}>
                                <span>Total</span>

                                <strong
                                    style={styles.total}
                                >
                                    {rupiah(total)}
                                </strong>
                            </div>
                        </div>
                    )}
                </div>

                {/* =========================
                    CHECKOUT
                ========================= */}
                <button
                    type="button"
                    style={{
                        ...styles.button,
                        opacity: canCheckout ? 1 : 0.5,
                        cursor: canCheckout
                            ? "pointer"
                            : "not-allowed",
                    }}
                    disabled={!canCheckout}
                    onClick={handleCheckout}
                >
                    {checkingAvailability
                        ? "Mengecek Ketersediaan..."
                        : availability &&
                            !availability.available
                            ? "Tidak Tersedia"
                            : "Lanjut Checkout"}
                </button>

                <small style={styles.equipmentId}>
                    ID Equipment: {equipment.id}
                </small>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#fff",
        color: "#111827",
    },
    availabilityChecking: {
        marginTop: 14,
        padding: 12,
        background: "#f9fafb",
        borderRadius: 10,
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
    },

    availabilityBox: {
        marginTop: 14,
        padding: 12,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 12,
    },

    availabilityAvailable: {
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#15803d",
    },

    availabilityUnavailable: {
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        background: "#f3f4f6",
        color: "#111827",
        textDecoration: "none",
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

    headerTitle: {
        margin: "2px 0 0",
        fontSize: 19,
    },

    container: {
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        padding: "16px 20px 40px",
    },

    gallery: {
        width: "100%",
        marginBottom: 18,
    },

    mainImageWrapper: {
        position: "relative",
        width: "100%",
        height: 280,
        overflow: "hidden",
        borderRadius: 16,
        background: "#f3f4f6",
    },

    mainImage: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
    },

    noImage: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9ca3af",
        fontSize: 13,
        fontWeight: 600,
    },

    imageCounter: {
        position: "absolute",
        right: 10,
        bottom: 10,
        padding: "5px 9px",
        borderRadius: 999,
        background: "rgba(17,24,39,.75)",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
    },

    sliderButton: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 34,
        height: 34,
        border: 0,
        borderRadius: "50%",
        background: "rgba(255,255,255,.9)",
        color: "#111827",
        fontSize: 24,
        lineHeight: 1,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,.12)",
    },

    thumbnails: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8,
        marginTop: 8,
    },

    thumbnailButton: {
        height: 62,
        padding: 2,
        border: "2px solid transparent",
        borderRadius: 10,
        background: "#f3f4f6",
        overflow: "hidden",
        cursor: "pointer",
    },

    thumbnailActive: {
        border: "2px solid #111827",
    },

    thumbnailImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 7,
        display: "block",
    },

    category: {
        display: "block",
        color: "#6b7280",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1,
        marginTop: 4,
    },

    title: {
        margin: "6px 0",
        fontSize: 27,
    },

    status: {
        fontSize: 12,
        fontWeight: 700,
    },

    price: {
        fontSize: 22,
        fontWeight: 800,
        margin: "12px 0",
    },

    day: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: 400,
    },

    hr: {
        border: 0,
        borderTop: "1px solid #ececec",
        margin: "24px 0",
    },

    sectionTitle: {
        margin: "18px 0 8px",
        fontSize: 16,
    },

    description: {
        color: "#4b5563",
        lineHeight: 1.6,
        fontSize: 13,
        marginTop: 8,
    },

    spec: {
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        padding: "12px 0",
        borderBottom: "1px solid #f1f1f1",
        fontSize: 12,
    },

    card: {
        background: "#fff",
        border: "1px solid #eeeeee",
        borderRadius: 16,
        padding: 16,
        marginTop: 22,
    },

    cardLabel: {
        display: "block",
        marginBottom: 14,
        fontSize: 9,
        letterSpacing: 1.2,
        color: "#9ca3af",
        fontWeight: 700,
    },

    dateGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
    },

    field: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },

    label: {
        fontSize: 11,
        color: "#6b7280",
        fontWeight: 600,
    },

    input: {
        width: "100%",
        padding: "11px 10px",
        border: "1px solid #d1d5db",
        borderRadius: 10,
        fontSize: 12,
        outline: "none",
        background: "#fff",
        boxSizing: "border-box",
    },

    summary: {
        marginTop: 16,
        padding: 14,
        background: "#f9fafb",
        borderRadius: 12,
    },

    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        fontSize: 12,
        marginBottom: 9,
    },

    divider: {
        height: 1,
        background: "#e5e7eb",
        margin: "12px 0",
    },

    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        fontSize: 13,
    },

    total: {
        fontSize: 18,
    },

    button: {
        width: "100%",
        marginTop: 14,
        padding: 14,
        border: 0,
        borderRadius: 12,
        background: "#111827",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "inherit",
    },

    equipmentId: {
        display: "block",
        marginTop: 12,
        textAlign: "center",
        fontSize: 9,
        color: "#9ca3af",
    },

    messagePage: {
        minHeight: "100vh",
        background: "#f7f7f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    messageCard: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        border: "1px solid #eeeeee",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 15,
        textAlign: "center",
    },

    backToEquipment: {
        padding: 12,
        borderRadius: 10,
        background: "#111827",
        color: "#fff",
        textDecoration: "none",
        fontSize: 12,
        fontWeight: 700,
    },
};
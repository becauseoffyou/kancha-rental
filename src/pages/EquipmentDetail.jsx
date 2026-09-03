import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export default function EquipmentDetail() {
    const { id } = useParams();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const pricePerDay = 350000;

    const calculateDuration = () => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diff = end - start;

        if (diff < 0) return 0;

        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const duration = calculateDuration();
    const total = duration * pricePerDay;
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <Link to="/equipment">←</Link>
                <strong>Detail Equipment</strong>
                <div></div>
            </header>

            <main style={styles.container}>
                <div style={styles.image}>📷</div>

                <small style={styles.category}>CAMERA</small>

                <h1 style={styles.title}>Sony A7 III</h1>

                <div style={styles.status}>● Tersedia</div>

                <p style={styles.price}>
                    Rp350.000
                    <span style={styles.day}> / hari</span>
                </p>

                <hr style={styles.hr} />

                <h3>Deskripsi</h3>

                <p style={styles.description}>
                    Kamera mirrorless full-frame untuk kebutuhan produksi video,
                    commercial, dokumentasi, dan konten profesional.
                </p>

                <h3>Spesifikasi</h3>

                <div style={styles.spec}>
                    <span>Sensor</span>
                    <strong>Full Frame</strong>
                </div>

                <div style={styles.spec}>
                    <span>Resolusi</span>
                    <strong>24.2 MP</strong>
                </div>

                <div style={styles.spec}>
                    <span>Video</span>
                    <strong>4K</strong>
                </div>

                <div style={styles.card}>
                    <small style={styles.cardLabel}>PERIODE RENTAL</small>

                    <div style={styles.dateGrid}>
                        <div style={styles.field}>
                            <label style={styles.label}>Mulai Rental</label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);

                                    if (endDate && e.target.value > endDate) {
                                        setEndDate("");
                                    }
                                }}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Selesai Rental</label>

                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                disabled={!startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{
                                    ...styles.input,
                                    opacity: !startDate ? 0.5 : 1,
                                }}
                            />
                        </div>
                    </div>

                    {duration > 0 && (
                        <div style={styles.summary}>
                            <div style={styles.summaryRow}>
                                <span>Harga / hari</span>
                                <strong>
                                    Rp{pricePerDay.toLocaleString("id-ID")}
                                </strong>
                            </div>

                            <div style={styles.summaryRow}>
                                <span>Durasi Rental</span>
                                <strong>{duration} Hari</strong>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.totalRow}>
                                <span>Total</span>

                                <strong style={styles.total}>
                                    Rp{total.toLocaleString("id-ID")}
                                </strong>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    style={{
                        ...styles.button,
                        opacity: duration > 0 ? 1 : 0.5,
                        cursor: duration > 0 ? "pointer" : "not-allowed",
                    }}
                    disabled={duration === 0}
                    onClick={() => {
                        console.log({
                            equipmentId: id,
                            startDate,
                            endDate,
                            duration,
                            total,
                        });
                    }}
                >
                    Lanjut Checkout
                </button>

                <small>ID Equipment: {id}</small>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#fff",
    },
    header: {
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        display: "grid",
        gridTemplateColumns: "50px 1fr 50px",
        textAlign: "center",
    },
    container: {
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 40px",
    },
    image: {
        height: 350,
        background: "#f1f2f4",
        borderRadius: 22,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 80,
        marginBottom: 24,
    },
    category: {
        color: "#6b7280",
    },
    title: {
        margin: "6px 0",
    },
    status: {
        color: "#15803d",
    },
    price: {
        fontSize: 22,
        fontWeight: 800,
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
    description: {
        color: "#4b5563",
        lineHeight: 1.6,
    },
    spec: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #f1f1f1",
    },

    card: {
        background: "#fff",
        border: "1px solid #eeeeee",
        borderRadius: 16,
        padding: 16,
        marginTop: 18,
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
    },
};
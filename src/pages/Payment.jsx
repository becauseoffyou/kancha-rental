import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCopy,
    FiClock,
    FiCheckCircle,
} from "react-icons/fi";

import bookingService from "../services/bookingService";
import paymentService from "../services/paymentService";

export default function Payment() {
    const { id } = useParams();

    const [bookingData, setBookingData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedBank, setSelectedBank] =
        useState("BCA");

    const [paymentMethod, setPaymentMethod] =
        useState("TRANSFER");
    const [proofFile, setProofFile] =
        useState(null);

    const [proofPreview, setProofPreview] =
        useState("");

    const [uploadingProof, setUploadingProof] =
        useState(false);

    const [timeLeft, setTimeLeft] =
        useState(30 * 60);

    const [confirming, setConfirming] =
        useState(false);

    const [confirmError, setConfirmError] =
        useState("");

    const bankAccounts = {
        BCA: {
            bank: "BCA",
            accountNumber: "1234567890",
            accountName:
                "PT KANCHA CREATIVE",
        },

        MANDIRI: {
            bank: "Mandiri",
            accountNumber: "9876543210",
            accountName:
                "PT KANCHA CREATIVE",
        },

        BRI: {
            bank: "BRI",
            accountNumber: "1122334455",
            accountName:
                "PT KANCHA CREATIVE",
        },

        BNI: {
            bank: "BNI",
            accountNumber: "5566778899",
            accountName:
                "PT KANCHA CREATIVE",
        },
    };

    const activeBank =
        bankAccounts[selectedBank];

    // ==============================
    // LOAD BOOKING DARI BACKEND
    // ==============================
    useEffect(() => {
        const loadBooking = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await bookingService.getByOrderNumber(
                        id
                    );

                setBookingData(data);
            } catch (error) {
                console.error(
                    "Load booking error:",
                    error
                );

                setError(
                    error.message ||
                    "Gagal memuat data pembayaran"
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadBooking();
        }
    }, [id]);

    // ==============================
    // TIMER
    // ==============================
    useEffect(() => {
        const payments =
            bookingData?.payments || [];

        const remainingPayment =
            [...payments]
                .reverse()
                .find(
                    (item) =>
                        item.payment_type ===
                        "REMAINING"
                );

        const initialPayment =
            payments.find(
                (item) =>
                    item.payment_type === "DP" ||
                    item.payment_type === "FULL"
            );

        const activePayment =
            remainingPayment ||
            initialPayment;

        if (
            activePayment?.payment_status !==
            "PENDING"
        ) {
            return;
        }

        setTimeLeft(30 * 60);

        const timer =
            setInterval(() => {
                setTimeLeft(
                    (prev) => {
                        if (prev <= 1) {
                            clearInterval(
                                timer
                            );

                            return 0;
                        }

                        return prev - 1;
                    }
                );
            }, 1000);

        return () =>
            clearInterval(timer);
    }, [bookingData]);


    const handleProofChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            alert(
                "File harus JPG, PNG, atau WEBP."
            );

            event.target.value =
                "";

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            alert(
                "Ukuran file maksimal 5 MB."
            );

            event.target.value =
                "";

            return;
        }

        setProofFile(file);

        setProofPreview(
            URL.createObjectURL(
                file
            )
        );
    };
    // ==============================
    // HELPERS
    // ==============================
    const rupiah = (value) =>
        `Rp${Number(
            value || 0
        ).toLocaleString("id-ID")}`;

    const formatTimer = (
        seconds
    ) => {
        const minute =
            Math.floor(
                seconds / 60
            );

        const second =
            seconds % 60;

        return `${String(
            minute
        ).padStart(
            2,
            "0"
        )}:${String(
            second
        ).padStart(
            2,
            "0"
        )}`;
    };

    const formatDate = (
        date
    ) => {
        if (!date) return "-";

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const copyAccount =
        async () => {
            try {
                await navigator
                    .clipboard
                    .writeText(
                        activeBank
                            .accountNumber
                    );

                alert(
                    `Nomor rekening ${activeBank.bank} berhasil disalin`
                );
            } catch (error) {
                console.error(
                    "Copy account error:",
                    error
                );

                alert(
                    "Gagal menyalin nomor rekening"
                );
            }
        };

    // ==============================
    // LOADING
    // ==============================
    if (loading) {
        return (
            <div
                style={
                    styles.messagePage
                }
            >
                <div
                    style={
                        styles.messageCard
                    }
                >
                    <FiClock
                        size={26}
                    />

                    <strong>
                        Memuat pembayaran...
                    </strong>
                </div>
            </div>
        );
    }

    // ==============================
    // ERROR
    // ==============================
    if (
        error ||
        !bookingData
    ) {
        return (
            <div
                style={
                    styles.messagePage
                }
            >
                <div
                    style={
                        styles.messageCard
                    }
                >
                    <strong>
                        Data pembayaran tidak ditemukan
                    </strong>

                    <span
                        style={
                            styles.errorText
                        }
                    >
                        {error ||
                            "Booking tidak ditemukan"}
                    </span>

                    <Link
                        to="/booking"
                        style={
                            styles.errorButton
                        }
                    >
                        Kembali ke Booking
                    </Link>
                </div>
            </div>
        );
    }

    // ==============================
    // DATA BACKEND
    // ==============================
    const booking =
        bookingData.booking;

    const items =
        bookingData.items ||
        [];

    const payments =
        bookingData.payments ||
        [];

    const item =
        items[0] || null;

    const remainingPayment = [...payments]
        .reverse()
        .find(
            (item) =>
                item.payment_type === "REMAINING" &&
                [
                    "PENDING",
                    "WAITING_VERIFICATION",
                    "REJECTED",
                    "PAID",
                ].includes(item.payment_status)
        );

    const initialPayment = payments.find(
        (item) =>
            item.payment_type === "DP" ||
            item.payment_type === "FULL"
    );

    const payment =
        remainingPayment ||
        initialPayment ||
        null;

    const grandTotal =
        Number(
            booking
                ?.grand_total ||
            0
        );

    const paymentAmount =
        Number(
            payment?.amount ||
            0
        );

    const paymentType =
        payment
            ?.payment_type ||
        booking
            ?.payment_type ||
        "FULL";

    const remainingAmount =
        paymentType === "DP"
            ? Math.max(
                grandTotal -
                paymentAmount,
                0
            )
            : 0;

    const paymentStatus =
        payment
            ?.payment_status ||
        "PENDING";

    const isWaitingVerification =
        paymentStatus ===
        "WAITING_VERIFICATION";

    const isPaid =
        paymentStatus ===
        "PAID";

    const isExpired =
        timeLeft <= 0;

    // ==============================
    // CONFIRM PAYMENT
    // ==============================
    const handleConfirmPayment =
        async () => {
            if (
                !payment
                    ?.payment_reference
            ) {
                alert(
                    "Referensi pembayaran tidak ditemukan."
                );

                return;
            }

            if (isExpired) {
                alert(
                    "Waktu pembayaran telah habis."
                );

                return;
            }

            if (
                paymentMethod ===
                "TRANSFER" &&
                !payment.proof_url &&
                !proofFile
            ) {
                alert(
                    "Upload bukti transfer terlebih dahulu."
                );

                return;
            }

            try {
                setConfirming(true);
                setConfirmError("");

                if (
                    paymentMethod ===
                    "TRANSFER" &&
                    proofFile
                ) {
                    setUploadingProof(
                        true
                    );

                    await paymentService
                        .uploadProof(
                            payment
                                .payment_reference,
                            proofFile
                        );

                    setUploadingProof(
                        false
                    );
                }

                await paymentService
                    .confirmPayment(
                        payment
                            .payment_reference,
                        {
                            payment_method:
                                paymentMethod,

                            bank_code:
                                paymentMethod ===
                                    "TRANSFER"
                                    ? selectedBank
                                    : null,
                        }
                    );

                const refreshed =
                    await bookingService
                        .getByOrderNumber(
                            id
                        );

                setBookingData(
                    refreshed
                );

                setProofFile(
                    null
                );

                setProofPreview(
                    ""
                );
            } catch (error) {
                console.error(
                    "Confirm payment error:",
                    error
                );

                setConfirmError(
                    error.message ||
                    "Gagal mengkonfirmasi pembayaran"
                );
            } finally {
                setUploadingProof(
                    false
                );

                setConfirming(
                    false
                );
            }
        };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header
                style={
                    styles.header
                }
            >
                <div
                    style={
                        styles.headerInner
                    }
                >
                    <Link
                        to="/booking"
                        style={
                            styles.backButton
                        }
                    >
                        <FiArrowLeft
                            size={20}
                        />
                    </Link>

                    <div>
                        <small
                            style={
                                styles.small
                            }
                        >
                            KANCHA RENTAL
                        </small>

                        <h2
                            style={
                                styles.headerTitle
                            }
                        >
                            Pembayaran
                        </h2>
                    </div>
                </div>
            </header>

            <main
                style={
                    styles.container
                }
            >
                {/* TIMER */}
                {paymentStatus === "PENDING" && (
                    <div
                        style={{
                            ...styles.timerCard,
                            ...(isExpired
                                ? styles.timerExpired
                                : {}),
                        }}
                    >
                        <div style={styles.timerIcon}>
                            <FiClock size={20} />
                        </div>

                        <div>
                            <small style={styles.timerLabel}>
                                {isExpired
                                    ? "Waktu pembayaran telah habis"
                                    : "Selesaikan pembayaran dalam"}
                            </small>

                            <strong style={styles.timer}>
                                {formatTimer(timeLeft)}
                            </strong>
                        </div>
                    </div>
                )}

                {/* INFORMASI PESANAN */}
                <div
                    style={
                        styles.card
                    }
                >
                    <small
                        style={
                            styles.cardLabel
                        }
                    >
                        INFORMASI PESANAN
                    </small>

                    <div
                        style={
                            styles.row
                        }
                    >
                        <span>
                            Nomor Pesanan
                        </span>

                        <strong>
                            {
                                booking
                                    .order_number
                            }
                        </strong>
                    </div>

                    {item && (
                        <div
                            style={
                                styles.row
                            }
                        >
                            <span>
                                Equipment
                            </span>

                            <strong>
                                {
                                    item
                                        .equipment_name
                                }
                            </strong>
                        </div>
                    )}

                    <div
                        style={
                            styles.row
                        }
                    >
                        <span>
                            Periode
                        </span>

                        <strong>
                            {formatDate(
                                booking
                                    .start_date
                            )}
                            {" - "}
                            {formatDate(
                                booking
                                    .end_date
                            )}
                        </strong>
                    </div>

                    {item && (
                        <div
                            style={
                                styles.row
                            }
                        >
                            <span>
                                Durasi
                            </span>

                            <strong>
                                {
                                    item
                                        .duration
                                }{" "}
                                Hari
                            </strong>
                        </div>
                    )}

                    <div
                        style={
                            styles.row
                        }
                    >
                        <span>
                            Jenis Pembayaran
                        </span>

                        <strong>
                            {paymentType ===
                                "DP"
                                ? "DP 50%"
                                : paymentType ===
                                    "REMAINING"
                                    ? "Pelunasan"
                                    : "Lunas"}
                        </strong>
                    </div>

                    <div
                        style={
                            styles.row
                        }
                    >
                        <span>
                            Total Pesanan
                        </span>

                        <strong>
                            {rupiah(
                                grandTotal
                            )}
                        </strong>
                    </div>

                    {paymentType ===
                        "DP" && (
                            <div
                                style={
                                    styles.row
                                }
                            >
                                <span>
                                    Sisa Pembayaran
                                </span>

                                <strong
                                    style={{
                                        color:
                                            "#c2410c",
                                    }}
                                >
                                    {rupiah(
                                        remainingAmount
                                    )}
                                </strong>
                            </div>
                        )}
                </div>

                {/* NOMINAL */}
                <div
                    style={
                        styles.amountCard
                    }
                >
                    <small
                        style={
                            styles.amountLabel
                        }
                    >
                        TOTAL YANG HARUS DIBAYAR
                    </small>

                    <strong
                        style={
                            styles.amount
                        }
                    >
                        {rupiah(
                            paymentAmount
                        )}
                    </strong>

                    {payment
                        ?.payment_reference && (
                            <span
                                style={
                                    styles.paymentReference
                                }
                            >
                                {
                                    payment
                                        .payment_reference
                                }
                            </span>
                        )}
                </div>

                {/* METODE PEMBAYARAN */}
                <div
                    style={
                        styles.card
                    }
                >
                    <small
                        style={
                            styles.cardLabel
                        }
                    >
                        METODE PEMBAYARAN
                    </small>

                    <div
                        style={
                            styles.methodGrid
                        }
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setPaymentMethod(
                                    "TRANSFER"
                                )
                            }
                            style={{
                                ...styles.methodButton,

                                ...(paymentMethod ===
                                    "TRANSFER"
                                    ? styles.methodActive
                                    : {}),
                            }}
                        >
                            <strong>
                                Transfer Bank
                            </strong>

                            <span>
                                Transfer ke
                                rekening KANCHA
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setPaymentMethod(
                                    "QRIS"
                                )
                            }
                            style={{
                                ...styles.methodButton,

                                ...(paymentMethod ===
                                    "QRIS"
                                    ? styles.methodActive
                                    : {}),
                            }}
                        >
                            <strong>
                                QRIS
                            </strong>

                            <span>
                                Scan QR melalui
                                aplikasi pembayaran
                            </span>
                        </button>
                    </div>
                </div>

                {/* TRANSFER BANK */}
                {paymentMethod ===
                    "TRANSFER" && (
                        <div
                            style={
                                styles.card
                            }
                        >
                            <small
                                style={
                                    styles.cardLabel
                                }
                            >
                                PILIH BANK TUJUAN
                            </small>

                            <div
                                style={
                                    styles.bankGrid
                                }
                            >
                                {Object.keys(
                                    bankAccounts
                                ).map(
                                    (
                                        bankKey
                                    ) => (
                                        <button
                                            key={
                                                bankKey
                                            }
                                            type="button"
                                            onClick={() =>
                                                setSelectedBank(
                                                    bankKey
                                                )
                                            }
                                            style={{
                                                ...styles.bankOption,

                                                ...(selectedBank ===
                                                    bankKey
                                                    ? styles.bankOptionActive
                                                    : {}),
                                            }}
                                        >
                                            {
                                                bankAccounts[
                                                    bankKey
                                                ]
                                                    .bank
                                            }
                                        </button>
                                    )
                                )}
                            </div>

                            <div
                                style={
                                    styles.divider
                                }
                            />

                            <small
                                style={
                                    styles.cardLabel
                                }
                            >
                                INFORMASI REKENING
                            </small>

                            <div
                                style={
                                    styles.bankBox
                                }
                            >
                                <div>
                                    <small
                                        style={
                                            styles.bankName
                                        }
                                    >
                                        BANK{" "}
                                        {activeBank.bank.toUpperCase()}
                                    </small>

                                    <strong
                                        style={
                                            styles.accountNumber
                                        }
                                    >
                                        {
                                            activeBank.accountNumber
                                        }
                                    </strong>

                                    <span
                                        style={
                                            styles.accountName
                                        }
                                    >
                                        {
                                            activeBank.accountName
                                        }
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        copyAccount
                                    }
                                    style={
                                        styles.copyButton
                                    }
                                >
                                    <FiCopy
                                        size={16}
                                    />
                                </button>
                            </div>

                            <div
                                style={
                                    styles.transferNote
                                }
                            >
                                Transfer tepat
                                sebesar{" "}
                                <strong>
                                    {rupiah(
                                        paymentAmount
                                    )}
                                </strong>{" "}
                                ke rekening KANCHA
                                di atas.
                            </div>
                            <div style={styles.proofSection}>
                                <small style={styles.cardLabel}>
                                    BUKTI TRANSFER
                                </small>

                                <label style={styles.uploadBox}>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleProofChange
                                        }
                                        style={{
                                            display:
                                                "none",
                                        }}
                                    />

                                    <strong>
                                        {proofFile
                                            ? "Ganti Bukti Transfer"
                                            : "Upload Bukti Transfer"}
                                    </strong>

                                    <span>
                                        JPG, PNG, WEBP
                                        maksimal 5 MB
                                    </span>
                                </label>

                                {proofPreview && (
                                    <div
                                        style={
                                            styles.previewBox
                                        }
                                    >
                                        <img
                                            src={
                                                proofPreview
                                            }
                                            alt="Bukti transfer"
                                            style={
                                                styles.previewImage
                                            }
                                        />
                                    </div>
                                )}

                                {!proofPreview &&
                                    payment
                                        ?.proof_url && (
                                        <div
                                            style={
                                                styles.uploadedProof
                                            }
                                        >
                                            ✓ Bukti transfer
                                            sudah diupload
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}

                {/* QRIS */}
                {paymentMethod ===
                    "QRIS" && (
                        <div
                            style={
                                styles.card
                            }
                        >
                            <small
                                style={
                                    styles.cardLabel
                                }
                            >
                                QRIS
                            </small>

                            <div
                                style={
                                    styles.qrPlaceholder
                                }
                            >
                                <div
                                    style={
                                        styles.fakeQr
                                    }
                                >
                                    QR
                                </div>

                                <strong>
                                    Scan QRIS KANCHA
                                </strong>

                                <span
                                    style={
                                        styles.qrText
                                    }
                                >
                                    Gunakan mobile
                                    banking atau
                                    e-wallet yang
                                    mendukung QRIS.
                                </span>

                                <strong>
                                    {rupiah(
                                        paymentAmount
                                    )}
                                </strong>
                            </div>
                        </div>
                    )}

                {/* STATUS */}
                <div
                    style={
                        styles.statusCard
                    }
                >
                    <FiCheckCircle
                        size={19}
                    />

                    <div
                        style={
                            styles.statusContent
                        }
                    >
                        <strong>
                            {isPaid
                                ? "Pembayaran Terverifikasi"
                                : isWaitingVerification
                                    ? "Menunggu Verifikasi"
                                    : "Menunggu Pembayaran"}
                        </strong>

                        <span>
                            {isPaid
                                ? "Pembayaran telah berhasil diverifikasi."
                                : isWaitingVerification
                                    ? "Konfirmasi pembayaran telah diterima. Admin KANCHA akan melakukan verifikasi."
                                    : "Silakan lakukan pembayaran lalu konfirmasi pembayaran."}
                        </span>
                    </div>
                </div>

                {confirmError && (
                    <div
                        style={
                            styles.confirmError
                        }
                    >
                        {
                            confirmError
                        }
                    </div>
                )}

                {/* BUTTON */}
                {paymentStatus ===
                    "PENDING" && (
                        <button
                            type="button"
                            onClick={
                                handleConfirmPayment
                            }
                            disabled={
                                isExpired ||
                                confirming
                            }
                            style={{
                                ...styles.bookingButton,

                                opacity:
                                    isExpired ||
                                        confirming
                                        ? 0.5
                                        : 1,

                                cursor:
                                    isExpired ||
                                        confirming
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            {confirming
                                ? uploadingProof
                                    ? "Mengupload Bukti..."
                                    : "Mengirim Konfirmasi..."
                                : isExpired
                                    ? "Waktu Pembayaran Habis"
                                    : "Konfirmasi Pembayaran"}
                        </button>
                    )}
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
        background:
            "rgba(255,255,255,.96)",
        backdropFilter:
            "blur(10px)",
        WebkitBackdropFilter:
            "blur(10px)",
        borderBottom:
            "1px solid #f1f1f1",
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
        minWidth: 38,
        borderRadius: 10,
        background: "#f3f4f6",
        color: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
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
        padding:
            "16px 16px 40px",
    },

    card: {
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        border:
            "1px solid #eeeeee",
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
        justifyContent:
            "space-between",
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
        border:
            "1px solid #fed7aa",
    },

    timerExpired: {
        background: "#fef2f2",
        color: "#b91c1c",
        border:
            "1px solid #fecaca",
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
        display: "block",
        fontSize: 26,
    },

    paymentReference: {
        display: "block",
        marginTop: 6,
        color: "#9ca3af",
        fontSize: 10,
    },

    methodGrid: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: 10,
    },

    methodButton: {
        padding: 13,
        minHeight: 85,
        borderRadius: 12,
        border:
            "1px solid #e5e7eb",
        background: "#fff",
        color: "#111827",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        fontFamily: "inherit",
    },

    methodActive: {
        border:
            "2px solid #111827",
        background: "#f9fafb",
    },

    bankGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, 1fr)",
        gap: 8,
    },

    bankOption: {
        minHeight: 42,
        border:
            "1px solid #e5e7eb",
        borderRadius: 10,
        background: "#fff",
        color: "#6b7280",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
    },

    bankOptionActive: {
        border:
            "2px solid #111827",
        background: "#111827",
        color: "#fff",
    },

    divider: {
        height: 1,
        background: "#eeeeee",
        margin: "16px 0",
    },

    bankBox: {
        display: "flex",
        alignItems: "center",
        justifyContent:
            "space-between",
        gap: 15,
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
        display: "block",
        fontSize: 10,
        color: "#6b7280",
    },

    copyButton: {
        width: 38,
        height: 38,
        minWidth: 38,
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
        justifyContent:
            "center",
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
        justifyContent:
            "center",
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
        alignItems:
            "flex-start",
        gap: 11,
        padding: 14,
        marginBottom: 14,
        borderRadius: 14,
        background: "#fff",
        border:
            "1px solid #e5e7eb",
        fontSize: 11,
    },

    statusContent: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },

    confirmError: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 10,
        background: "#fef2f2",
        border:
            "1px solid #fecaca",
        color: "#b91c1c",
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
    },

    messagePage: {
        minHeight: "100vh",
        background: "#f7f7f7",
        display: "flex",
        alignItems: "center",
        justifyContent:
            "center",
        padding: 20,
    },

    messageCard: {
        width: "100%",
        maxWidth: 400,
        padding: 24,
        background: "#fff",
        border:
            "1px solid #eeeeee",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        textAlign: "center",
    },

    errorText: {
        color: "#6b7280",
        fontSize: 12,
    },

    errorButton: {
        width: "100%",
        padding: 12,
        borderRadius: 10,
        background: "#111827",
        color: "#fff",
        textDecoration: "none",
        fontSize: 12,
        fontWeight: 700,
    },
    proofSection: {
        marginTop: 18,
    },

    uploadBox: {
        minHeight: 90,
        border: "1px dashed #d1d5db",
        borderRadius: 12,
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        cursor: "pointer",
        textAlign: "center",
        fontSize: 11,
    },

    previewBox: {
        marginTop: 12,
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
    },

    previewImage: {
        width: "100%",
        maxHeight: 320,
        objectFit: "contain",
        display: "block",
        background: "#f9fafb",
    },

    uploadedProof: {
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#15803d",
        fontSize: 11,
    },
};
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

export default function Invoice() {
    const { id } = useParams();

    const invoice = {
        invoiceNumber: "INV-KNC-20260905-001",
        orderNumber: id || "KNC-20260905-001",
        customer: "Irhandy Ardiansyah",
        email: "irhandy@email.com",
        phone: "08xxxxxxxxxx",

        equipment: "Sony A7 III",
        equipmentCode: "CAM-SNY-A73-001",

        startDate: "05 September 2026",
        endDate: "07 September 2026",
        duration: 3,

        pricePerDay: 350000,
        subtotal: 1050000,
        deposit: 0,
        total: 1050000,

        paymentStatus: "Belum Dibayar",
        issuedAt: "03 September 2026",
    };

    const rupiah = (value) =>
        `Rp${value.toLocaleString("id-ID")}`;

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <Link
                        to={`/booking/${invoice.orderNumber}`}
                        style={styles.backButton}
                    >
                        <FiArrowLeft size={20} />
                    </Link>

                    <div>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.title}>Invoice</h2>
                    </div>
                </div>
            </header>

            <main style={styles.content}>
                <div style={styles.invoice}>
                    <div style={styles.invoiceTop}>
                        <div>
                            <small style={styles.label}>INVOICE</small>
                            <h2 style={styles.invoiceNumber}>
                                {invoice.invoiceNumber}
                            </h2>
                        </div>

                        <div style={styles.status}>
                            {invoice.paymentStatus}
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.section}>
                        <small style={styles.sectionTitle}>
                            INFORMASI PESANAN
                        </small>

                        <div style={styles.row}>
                            <span>Nomor Pesanan</span>
                            <strong>{invoice.orderNumber}</strong>
                        </div>

                        <div style={styles.row}>
                            <span>Tanggal Invoice</span>
                            <strong>{invoice.issuedAt}</strong>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.section}>
                        <small style={styles.sectionTitle}>
                            PENYEWA
                        </small>

                        <h3 style={styles.customerName}>
                            {invoice.customer}
                        </h3>

                        <p style={styles.customerInfo}>
                            {invoice.email}
                        </p>

                        <p style={styles.customerInfo}>
                            {invoice.phone}
                        </p>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.section}>
                        <small style={styles.sectionTitle}>
                            DETAIL RENTAL
                        </small>

                        <div style={styles.item}>
                            <div>
                                <strong>{invoice.equipment}</strong>

                                <p style={styles.itemCode}>
                                    {invoice.equipmentCode}
                                </p>
                            </div>

                            <strong>
                                {rupiah(invoice.pricePerDay)} / hari
                            </strong>
                        </div>

                        <div style={styles.rentalInfo}>
                            <div>
                                <small>Mulai Rental</small>
                                <strong>{invoice.startDate}</strong>
                            </div>

                            <div>
                                <small>Selesai Rental</small>
                                <strong>{invoice.endDate}</strong>
                            </div>

                            <div>
                                <small>Durasi</small>
                                <strong>{invoice.duration} Hari</strong>
                            </div>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.section}>
                        <div style={styles.row}>
                            <span>
                                {rupiah(invoice.pricePerDay)} ×{" "}
                                {invoice.duration} hari
                            </span>

                            <strong>{rupiah(invoice.subtotal)}</strong>
                        </div>

                        <div style={styles.row}>
                            <span>Deposit</span>
                            <strong>{rupiah(invoice.deposit)}</strong>
                        </div>

                        <div style={styles.totalBox}>
                            <span>Total Pembayaran</span>

                            <strong style={styles.total}>
                                {rupiah(invoice.total)}
                            </strong>
                        </div>
                    </div>
                </div>

                <button
                    style={styles.printButton}
                    onClick={() => window.print()}
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
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #eeeeee",
        padding: 20,
    },

    invoiceTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
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
        background: "#fff7ed",
        color: "#c2410c",
        fontWeight: 700,
        fontSize: 10,
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
        gridTemplateColumns: "repeat(3, 1fr)",
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
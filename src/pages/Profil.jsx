import BottomNav from "../components/BottomNav";
import { FiUser, FiShield, FiFileText, FiLogOut, FiChevronRight } from "react-icons/fi";

export default function Profile() {
    const user = {
        name: "Irhandy Ardiansyah",
        email: "irhandy@email.com",
        phone: "08xxxxxxxxxx",
        verificationStatus: "Belum Terverifikasi",
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div>
                        <small style={styles.small}>KANCHA RENTAL</small>
                        <h2 style={styles.title}>Profile Saya</h2>
                    </div>
                </div>
            </header>

            <main style={styles.content}>
                <div style={styles.profileCard}>
                    <div style={styles.avatar}>
                        <FiUser size={28} />
                    </div>

                    <div style={styles.profileInfo}>
                        <h3 style={styles.name}>{user.name}</h3>
                        <p style={styles.email}>{user.email}</p>
                        <p style={styles.phone}>{user.phone}</p>
                    </div>
                </div>

                <div style={styles.verificationCard}>
                    <div>
                        <small style={styles.verificationLabel}>Status Verifikasi</small>

                        <h3 style={styles.verificationStatus}>
                            {user.verificationStatus}
                        </h3>

                        <p style={styles.verificationText}>
                            Verifikasi identitas diperlukan sebelum melakukan rental.
                        </p>
                    </div>

                    <button style={styles.verifyButton}>
                        Verifikasi Sekarang
                    </button>
                </div>

                <div style={styles.menuCard}>
                    <MenuItem
                        icon={<FiShield />}
                        title="Verifikasi Identitas"
                        subtitle="KTP dan verifikasi wajah"
                    />

                    <MenuItem
                        icon={<FiFileText />}
                        title="Riwayat Booking"
                        subtitle="Lihat transaksi rental"
                    />

                    <MenuItem
                        icon={<FiUser />}
                        title="Data Akun"
                        subtitle="Ubah nama, email dan nomor telepon"
                    />
                </div>

                <button style={styles.logoutButton}>
                    <FiLogOut size={18} />
                    Keluar
                </button>
            </main>

            <BottomNav />
        </div>
    );
}

function MenuItem({ icon, title, subtitle }) {
    return (
        <button style={styles.menuItem}>
            <div style={styles.menuIcon}>
                {icon}
            </div>

            <div style={styles.menuText}>
                <strong style={styles.menuTitle}>{title}</strong>
                <span style={styles.menuSubtitle}>{subtitle}</span>
            </div>

            <FiChevronRight size={18} color="#9ca3af" />
        </button>
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
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #f1f1f1",
    },

    headerInner: {
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "14px 16px",
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

    profileCard: {
        background: "#fff",
        borderRadius: 18,
        padding: 18,
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: "1px solid #eeeeee",
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    profileInfo: {
        flex: 1,
    },

    name: {
        margin: 0,
        fontSize: 17,
    },

    email: {
        margin: "5px 0 0",
        fontSize: 12,
        color: "#6b7280",
    },

    phone: {
        margin: "3px 0 0",
        fontSize: 12,
        color: "#6b7280",
    },

    verificationCard: {
        marginTop: 14,
        background: "#111827",
        color: "#fff",
        borderRadius: 18,
        padding: 18,
    },

    verificationLabel: {
        fontSize: 10,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    verificationStatus: {
        margin: "5px 0",
        fontSize: 17,
    },

    verificationText: {
        margin: 0,
        fontSize: 12,
        lineHeight: 1.6,
        color: "#d1d5db",
    },

    verifyButton: {
        width: "100%",
        marginTop: 14,
        padding: 12,
        background: "#fff",
        color: "#111827",
        border: 0,
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
    },

    menuCard: {
        marginTop: 14,
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #eeeeee",
        overflow: "hidden",
    },

    menuItem: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        border: 0,
        borderBottom: "1px solid #f1f1f1",
        background: "#fff",
        textAlign: "left",
        cursor: "pointer",
    },

    menuIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
    },

    menuText: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
    },

    menuTitle: {
        fontSize: 13,
    },

    menuSubtitle: {
        fontSize: 11,
        color: "#9ca3af",
    },

    logoutButton: {
        width: "100%",
        marginTop: 14,
        padding: 14,
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontWeight: 700,
        cursor: "pointer",
    },
};
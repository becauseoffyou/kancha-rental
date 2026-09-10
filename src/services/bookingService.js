const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:9090/api";
const createBooking = async (payload) => {
    const token =
        localStorage.getItem("kancha_token");

    if (!token) {
        throw new Error(
            "Silakan login terlebih dahulu"
        );
    }

    const response = await fetch(
        `${API_URL}/booking`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Gagal membuat booking"
        );
    }

    return result.data;
};

const getByOrderNumber = async (orderNumber) => {
    const response = await fetch(
        `${API_URL}/booking/${encodeURIComponent(
            orderNumber
        )}`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Booking tidak ditemukan"
        );
    }

    return result.data;
};

const getMyBookings = async () => {
    const token =
        localStorage.getItem("kancha_token");

    if (!token) {
        throw new Error(
            "Silakan login terlebih dahulu"
        );
    }

    const response = await fetch(
        `${API_URL}/booking/me`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Gagal mengambil pesanan"
        );
    }

    return result.data || [];
};

const bookingService = {
    createBooking,
    getByOrderNumber,
    getMyBookings
};

export default bookingService;
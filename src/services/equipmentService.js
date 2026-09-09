const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:9090/api";
const getAll = async () => {
    const response = await fetch(`${API_URL}/equipment`);

    if (!response.ok) {
        throw new Error("Gagal mengambil data equipment");
    }

    const result = await response.json();

    return result.data;
};

const getById = async (id) => {
    const response = await fetch(`${API_URL}/equipment/${id}`);

    if (!response.ok) {
        throw new Error("Equipment tidak ditemukan");
    }

    const result = await response.json();

    return result.data;
};

const checkAvailability = async (
    id,
    startDate,
    endDate
) => {
    const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
    });

    const response = await fetch(
        `${API_URL}/equipment/${id}/availability?${params.toString()}`
    );

    if (!response.ok) {
        const result = await response.json();

        throw new Error(
            result.message ||
            "Gagal mengecek ketersediaan"
        );
    }

    const result = await response.json();

    return result.data;
};

const equipmentService = {
    getAll,
    getById,
    checkAvailability,
};

export default equipmentService;
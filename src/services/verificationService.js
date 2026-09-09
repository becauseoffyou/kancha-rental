const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:9090/api";

const parseResponse = async (response) => {
    const text = await response.text();

    let result;

    try {
        result = JSON.parse(text);
    } catch {
        console.error("NON JSON RESPONSE:", text);

        throw new Error(
            `Server mengembalikan response tidak valid (${response.status})`
        );
    }

    return result;
};

const submitVerification = async ({
    nik,
    fullName,
    ktp,
    selfie,
}) => {
    const token =
        localStorage.getItem("kancha_token");

    if (!token) {
        throw new Error(
            "Silakan login terlebih dahulu"
        );
    }

    const formData = new FormData();

    formData.append("nik", nik);
    formData.append("full_name", fullName);
    formData.append("ktp", ktp);
    formData.append("selfie", selfie);

    const response = await fetch(
        `${API_URL}/verification/submit`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    const result =
        await parseResponse(response);

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Gagal mengirim verifikasi"
        );
    }

    return result.data;
};

const getMyVerification = async () => {
    const token =
        localStorage.getItem("kancha_token");

    if (!token) {
        throw new Error(
            "Silakan login terlebih dahulu"
        );
    }

    const response = await fetch(
        `${API_URL}/verification/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result =
        await parseResponse(response);

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Gagal mengambil status verifikasi"
        );
    }

    return result.data.verification;
};

export default {
    submitVerification,
    getMyVerification,
};
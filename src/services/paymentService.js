const API_URL =
    "http://localhost:5000/api";

const uploadProof = async (
    paymentReference,
    file
) => {
    const formData =
        new FormData();

    formData.append(
        "proof",
        file
    );

    const response =
        await fetch(
            `${API_URL}/payments/${encodeURIComponent(
                paymentReference
            )}/proof`,
            {
                method: "POST",
                body: formData,
            }
        );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Gagal upload bukti pembayaran"
        );
    }

    return result.data;
};

const confirmPayment = async (
    paymentReference,
    payload
) => {
    const response =
        await fetch(
            `${API_URL}/payments/${encodeURIComponent(
                paymentReference
            )}/confirm`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify(
                    payload
                ),
            }
        );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Gagal mengkonfirmasi pembayaran"
        );
    }

    return result.data;
};

const paymentService = {
    uploadProof,
    confirmPayment,
};

export default paymentService;
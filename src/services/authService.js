const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:9090/api";

const register = async (payload) => {
    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Registrasi gagal"
        );
    }

    return result.data;
};

const login = async (payload) => {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Login gagal"
        );
    }

    return result.data;
};

const getMe = async () => {
    const token =
        localStorage.getItem("kancha_token");

    if (!token) {
        throw new Error("Belum login");
    }

    const response = await fetch(
        `${API_URL}/auth/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Gagal mengambil data user"
        );
    }

    return result.data.user;
};

const saveSession = (data) => {
    localStorage.setItem(
        "kancha_token",
        data.token
    );

    localStorage.setItem(
        "kancha_user",
        JSON.stringify(data.user)
    );
};

const logout = () => {
    localStorage.removeItem("kancha_token");
    localStorage.removeItem("kancha_user");
};

const getToken = () => {
    return localStorage.getItem("kancha_token");
};

const getUser = () => {
    const user =
        localStorage.getItem("kancha_user");

    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
};

export default {
    register,
    login,
    getMe,
    saveSession,
    logout,
    getToken,
    getUser,
};
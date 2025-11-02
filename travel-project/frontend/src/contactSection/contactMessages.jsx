const API_BASE = "http://localhost:8080"; // 🔴 Hardcoded backend base URL

function authHeaders() {
    const token = localStorage.getItem("token"); // <- matches what you store
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchMessages({ status, page = 0, size = 10 }) {
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);
    params.set("page", page);
    params.set("size", size);

    const res = await fetch(`${API_BASE}/api/admin/contact-messages?${params.toString()}`, {
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load messages (${res.status}): ${text}`);
    }
    return res.json(); // Spring Data Page
}

export async function markMessageRead(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/admin/contact-messages/${id}/read`, {
        method: "PATCH",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });


    if (!(res.status === 200 || res.status === 204)) {
        const text = await res.text();
        throw new Error(`Mark read failed (${res.status}): ${text}`);

    }
// 🔔 tell the badge to refetch immediately
    window.dispatchEvent(new CustomEvent("contact:changed"));


    return {
        status: res.status,
        success: true,
        message: "Message marked as read successfully",
    };
}




export async function fetchUnreadCount() {
    const token = localStorage.getItem("token"); // make sure key matches your login
    const res = await fetch(`${API_BASE}/api/admin/contact-messages/unread-count`, {
        method: "GET",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // no Content-Type on GET
        },
        cache: "no-store", // avoid stale values
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to get unread count (${res.status}): ${text}`);
    }

    const raw = (await res.text() || "").trim();
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
}


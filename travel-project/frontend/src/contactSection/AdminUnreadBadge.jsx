import { useEffect, useState } from "react";
import { fetchUnreadCount } from "../contactSection/contactMessages";

export default function AdminUnreadBadge({ pollMs = 0 }) {
    const [count, setCount] = useState(0);

    const load = async (why = "") => {
        try {
            const n = await fetchUnreadCount();
            // console.log("badge reloaded", why, "→", n);
            setCount(n);
        } catch { /* ignore */ }
    };

    useEffect(() => {
        load("mount");

        const handler = () => load("contact:changed"); // refresh on event
        window.addEventListener("contact:changed", handler);

        let t;
        if (pollMs > 0) t = setInterval(() => load("poll"), pollMs);

        return () => {
            window.removeEventListener("contact:changed", handler);
            if (t) clearInterval(t);
        };
    }, [pollMs]);

    if (count <= 0) return null;
    return <span className="badge-unread">{count}</span>;
}

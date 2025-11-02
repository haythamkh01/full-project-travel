import { useEffect, useMemo, useState } from "react";
import {
    fetchMessages,
    markMessageRead,
    fetchUnreadCount,
} from "../contactSection/contactMessages";
import "./AdminContactMessages.css";
import Header from "../componenets/custom/Header.jsx";

export default function AdminContactMessages() {
    const [status, setStatus] = useState("NEW"); // NEW | READ | ALL
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [data, setData] = useState(null); // Spring Data Page
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [unread, setUnread] = useState(0);

    const totalPages = data?.totalPages ?? 0;

    const load = async () => {
        setLoading(true);
        setErr(null);
        try {
            const [pageData, unreadCount] = await Promise.all([
                fetchMessages({ status, page, size }),
                fetchUnreadCount(),
            ]);
            setData(pageData);
            setUnread(unreadCount);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, page, size]);

    const onMarkRead = async (id) => {
        try {
            await markMessageRead(id);
            // Optimistic refresh: reload current page + unread
            await load();
        } catch (e) {
            alert(e.message);
        }
    };

    const rows = data?.content ?? [];

    return (
        <>
            <Header/>
        <div className="adm-msgs">
            <div className="adm-msgs__header">
                <h2>Contact Messages</h2>
                <div className="adm-msgs__controls">
                    <label>
                        Status:&nbsp;
                        <select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }}>
                            <option value="NEW">NEW</option>
                            <option value="READ">READ</option>
                            <option value="ALL">ALL</option>
                        </select>
                    </label>

                    <label>
                        Page size:&nbsp;
                        <select value={size} onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }}>
                            <option>5</option>
                            <option>10</option>
                            <option>20</option>
                        </select>
                    </label>

                    <span className="adm-msgs__badge" title="Unread messages">
            Unread: {unread}
          </span>
                </div>
            </div>

            {err && <div className="adm-msgs__alert">⚠️ {err}</div>}
            {loading && <div className="adm-msgs__loading">Loading…</div>}

            <div className="adm-msgs__tablewrap">
                <table className="adm-msgs__table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>UserId</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!loading && rows.length === 0 && (
                        <tr><td colSpan="9" style={{ textAlign: "center" }}>No messages</td></tr>
                    )}
                    {rows.map((m) => (
                        <tr key={m.id} className={m.status === "NEW" ? "is-new" : ""}>
                            <td>{m.id}</td>
                            <td>{formatInstant(m.createdAt)}</td>
                            <td>{m.status}</td>
                            <td>{m.name}</td>
                            <td><a href={`mailto:${m.email}`}>{m.email}</a></td>
                            <td title={m.subject}>{truncate(m.subject, 40)}</td>
                            <td title={m.content} className="mono">
                                {truncate(m.content, 80)}
                            </td>
                            <td>{m.userId ?? "-"}</td>
                            <td className="actions">
                                {m.status === "NEW" ? (
                                    <button onClick={() => onMarkRead(m.id)}>Mark read</button>
                                ) : (
                                    <span className="muted">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="adm-msgs__pager">
                <button disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
                    ◀ Prev
                </button>
                <span>
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>
                <button
                    disabled={totalPages === 0 || page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next ▶
                </button>
            </div>
        </div>
            </>
    );
}

function truncate(s, n) {
    if (!s) return "";
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function formatInstant(iso) {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleString();
    } catch {
        return iso;
    }
}

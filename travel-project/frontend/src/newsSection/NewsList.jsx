import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ⬅️ added useNavigate
import "./NewsList.css"
export default function NewsList() {
    const navigate = useNavigate(); // ⬅️
    const [page, setPage] = useState(0);
    const [size] = useState(6);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // Simple check — tweak to your logic if needed
    const isAdmin =
        localStorage.getItem("userRole") === "ADMIN" ||
        !!localStorage.getItem("adminToken");

    async function handleDelete(id) {
        if (!window.confirm("Delete this news item?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8080/api/admin/news/${id}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error(`Delete failed (${res.status}): ${await res.text()}`);

            // remove from UI
            setData(prev => ({
                ...prev,
                content: prev.content.filter(n => n.id !== id),
                totalElements: (prev.totalElements ?? 0) - 1,
            }));
        } catch (e) {
            alert(e.message || String(e));
        }
    }


    useEffect(() => {
        (async () => {
            setLoading(true); setErr("");
            try {
                const res = await fetch(`http://localhost:8080/api/news/all?page=${page}&size=${size}`);
                if (!res.ok) throw new Error(await res.text());
                const json = await res.json();
                setData(json);
            } catch (e) {
                setErr(String(e.message || e));
            } finally {
                setLoading(false);
            }
        })();
    }, [page, size]);

    if (loading) return <div className="news-wrap">Loading...</div>;
    if (err) return <div className="news-wrap">Error: {err}</div>;
    if (!data) return null;

    return (
        <div className="news-wrap">
            <h2>Latest News</h2>

            <div className="news-list">
                {data.content.map(item => (
                    <article key={item.id} className="news-item">
                        <div className={`news-thumb ${item.imageUrl ? "" : "is-empty"}`}>
                            {item.imageUrl ? (
                                <img src={`http://localhost:8080${item.imageUrl}`} alt={item.title}/>
                            ) : null}
                        </div>

                        <div className="news-body">
                            <h3 className="news-title">
                                <Link to={`/news/${item.id}`}>{item.title}</Link>
                            </h3>

                            <div className="news-meta">
                                <span className="news-author">{item.authorName || "Admin"}</span>
                                <span className="news-date">
              {new Date(item.updatedAt ?? item.createdAt).toLocaleString()}
            </span>
                            </div>

                            <p className="news-excerpt">
                                {item.content.length > 220 ? item.content.slice(0, 220) + "…" : item.content}
                            </p>

                            <Link className="news-read" to={`/news/${item.id}`}>Read more →</Link>

                            {isAdmin && (
                                <div className="news-admin-actions">
                                    <button onClick={() => navigate(`/admin/news/${item.id}`)}>Edit</button>
                                    <button className="danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>



    {/* Pager */}
    <div className="news-pager">
        <button disabled={data.first} onClick={() => setPage(0)}>« First</button>
        <button disabled={data.first} onClick={() => setPage(p => Math.max(0, p - 1))}>‹ Prev</button>
        <span>Page {data.number + 1} / {data.totalPages || 1}</span>
        <button disabled={data.last} onClick={() => setPage(p => p + 1)}>Next ›</button>
        <button disabled={data.last} onClick={() => setPage(data.totalPages - 1)}>Last »</button>
    </div>

    {/* Floating Add Button for Admins */
    }
    {
        isAdmin && (
            <button
                className="fab-add"
                aria-label="Add news"
                onClick={() => navigate("/admin/news")} // adjust if route differs
            >
                +
            </button>
        )
    }
</div>


)
    ;
}

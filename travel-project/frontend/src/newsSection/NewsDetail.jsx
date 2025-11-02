import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./NewsDetail.css"
export default function NewsDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true); setErr("");
            try {
                const res = await fetch(`http://localhost:8080/api/news/${id}`);
                if (!res.ok) throw new Error(await res.text());
                const json = await res.json();
                setItem(json);
            } catch (e) {
                setErr(String(e.message || e));
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div className="news-wrap">Loading...</div>;
    if (err) return <div className="news-wrap">Error: {err}</div>;
    if (!item) return null;

    return (
        <div className="news-wrap">
            <Link to="/" className="back-link">← Back to all news</Link>

            <article className="news-detail">
                <h1 className="news-headline">{item.title}</h1>
                <div className="news-date">{new Date(item.createdAt).toLocaleString()}</div>

                <div className={`news-hero ${item.imageUrl ? "" : "is-empty"}`}>
                    {item.imageUrl ? (
                        <img src={`http://localhost:8080${item.imageUrl}`} alt={item.title}/>
                    ) : null}
                </div>

                <div className="news-content">{item.content}</div>
            </article>
        </div>

    );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NewsEdit.css";
export default function NewsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/news/${id}`);
                if (!res.ok) throw new Error(await res.text());
                const json = await res.json();
                setTitle(json.title || "");
                setContent(json.content || "");
            } catch (e) {
                setErr(String(e.message || e));
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    async function onSave() {
        const token = localStorage.getItem("token");
        const form = new FormData();
        if (title) form.append("title", title);
        if (content) form.append("content", content);
        if (imageFile) form.append("image", imageFile); // optional

        try {
            const res = await fetch(`http://localhost:8080/api/admin/news/${id}`, {
                method: "PATCH",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    // Don't set Content-Type for FormData
                },
                body: form,
            });
            if (!res.ok) throw new Error(await res.text());
            navigate("/news"); // go back to list
        } catch (e) {
            alert(`Update failed: ${e.message || e}`);
        }
    }

    if (loading) return <div>Loading…</div>;
    if (err) return <div>Error: {err}</div>;

    return (
        <div className="news-edit">
            <h2>Edit News #{id}</h2>
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <label>Content</label>
            <textarea rows={8} value={content} onChange={e => setContent(e.target.value)} />
            <label>Image (optional)</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
            <div style={{marginTop:12}}>
                <button onClick={onSave}>Save</button>
                <button onClick={() => navigate(-1)} style={{marginLeft:8}}>Cancel</button>
            </div>
        </div>
    );
}

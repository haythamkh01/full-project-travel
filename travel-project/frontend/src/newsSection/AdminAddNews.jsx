import React, { useState } from "react";
import "./AdminAddNews.css";

export default function AdminAddNews() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");

    const onImageChange = (e) => {
        const file = e.target.files?.[0];
        setImage(file || null);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMsg("");

        try {
            const fd = new FormData();
            fd.append("title", title);
            fd.append("content", content);
            if (image) fd.append("image", image);

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not logged in");

            const res = await fetch("http://localhost:8080/api/admin/news", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd, // don't set Content-Type with FormData
            });

            if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
            const data = await res.json();
            setMsg(`Created ✔ id: ${data.id}`);
            setTitle(""); setContent(""); setImage(null); setPreview(null);
        } catch (err) {
            setMsg(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="news-form">
            <h2>Add News</h2>
            <form onSubmit={handleSubmit}>
                <label>Title
                    <input value={title} onChange={e=>setTitle(e.target.value)} required minLength={3} maxLength={150}/>
                </label>
                <label>Content
                    <textarea value={content} onChange={e=>setContent(e.target.value)} required rows={8}/>
                </label>
                <label>Image
                    <input type="file" accept="image/*" onChange={onImageChange}/>
                </label>
                {preview && <img className="preview" src={preview} alt="preview" />}
                <button disabled={submitting}>{submitting ? "Saving..." : "Save"}</button>
            </form>
            {msg && <div className="msg">{msg}</div>}
        </div>
    );
}

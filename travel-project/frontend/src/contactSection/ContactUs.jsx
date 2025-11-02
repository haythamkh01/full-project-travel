import { useState } from "react";
import "./ContactUs.css";
import Header from "../componenets/custom/Header.jsx";


export default function ContactUs() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        content: "",
    });
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState(null);  // success/error text
    const [errorFields, setErrorFields] = useState({}); // backend validation map

    const token = localStorage.getItem("jwt"); // if you keep JWT here

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setErrorFields({});
        setSending(true);

        try {
            const res = await fetch('http://localhost:8080/api/contact-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, content: form.content })
            });


            const text = await res.text();
            let data;
            try { data = text ? JSON.parse(text) : null; } catch { data = null; }

            if (!res.ok) {
                // If you added the @RestControllerAdvice handler, it returns {message, errors:{field:msg}}
                setMessage(`Failed (${res.status})${data?.message ? `: ${data.message}` : ""}`);
                if (data?.errors) setErrorFields(data.errors);
                return;
            }

            setMessage("✅ Message sent. Thank you!");
            setForm({ name: "", email: "", subject: "", content: "" });

        } catch (err) {
            setMessage("Network error. Check server URL/CORS.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Header/>
            <div className="contact-header"><h1>Contact Us!</h1></div>

            <div className="from-container">
                <h2>Send Message To Us!</h2>

                {message && <div className="alert">{message}</div>}

                <form onSubmit={onSubmit} noValidate>
                    {/* If user is logged in, the backend will override name/email anyway;
              keep fields for guests. You can disable them if token exists. */}
                    <input
                        name="name"
                        type="text"
                        placeholder="Username"
                        value={form.name}
                        onChange={onChange}
                        disabled={!!token}
                        className={errorFields.name ? "invalid" : ""}
                    />
                    {errorFields.name && <small className="error">{errorFields.name}</small>}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={onChange}
                        disabled={!!token}
                        className={errorFields.email ? "invalid" : ""}
                    />
                    {errorFields.email && <small className="error">{errorFields.email}</small>}

                    <input
                        name="subject"
                        type="text"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={onChange}
                        className={errorFields.subject ? "invalid" : ""}
                    />
                    {errorFields.subject && <small className="error">{errorFields.subject}</small>}

                    <textarea
                        name="content"
                        placeholder="Message"
                        rows="4"
                        value={form.content}
                        onChange={onChange}
                        className={errorFields.content ? "invalid" : ""}
                    />
                    {errorFields.content && <small className="error">{errorFields.content}</small>}

                    <button type="submit" disabled={sending}>
                        {sending ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </>
    );
}

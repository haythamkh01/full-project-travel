// src/components/CreateTrip.jsx
import { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { buildPrompt } from "../service/prompt";
import { SelectBudgetOptions, SelectTravelsList } from "../constant/option";
import "./index.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ItineraryView from "../componenets/ItineraryView.jsx";
import Header from "../componenets/custom/Header.jsx";
import {
    mapsLinkFor,
    bookingLinkFor,
    // removed: mapsStaticFor, safeImageUrl, withFallback, smartImageUrl
} from "../service/linkHelpers";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function CreateTrip() {
    const [place, setPlace] = useState(null);
    const [coords, setCoords] = useState(null); // optional (unused but kept)
    const [formData, setFormData] = useState({
        location: null,
        noOfDays: "",
        budget: "",
        traveler: "",
    });
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState("");

    const handleInputChange = (name, value) =>
        setFormData((p) => ({ ...p, [name]: value }));

    useEffect(() => {
        // console.log("formData:", formData);
    }, [formData]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setError("");
        setItinerary(null);
        setLoading(true);
        try {
            const cityLabel = formData.location?.label ?? place?.label ?? "";
            const prompt = buildPrompt({
                cityLabel,
                noOfDays: formData.noOfDays || 1,
                budget: formData.budget || "Moderate",
                traveler: formData.traveler || "1 Person",
            });

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const text = await result.response.text();

            // Try to parse JSON (handles ```json fences too)
            const jsonText = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
            const parsed = JSON.parse(jsonText);

            setItinerary(parsed);
        } catch (err) {
            console.error(err);
            setError("Could not generate a plan. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <form className="create-trip" onSubmit={handleGenerate}>
                <h1 className="trip-title">Tell us your travel preferences ⛺🌴</h1>
                <p className="trip-subtitle">
                    Fill the fields and we’ll generate a simple day-by-day plan.
                </p>

                {/* Destination */}
                <div className="field">
                    <h2>What is destination of choice?</h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            value: place,
                            onChange: (v) => {
                                setPlace(v);
                                handleInputChange("location", v);
                            },
                            placeholder: "Type a city…",
                            isClearable: true,
                            menuPortalTarget: typeof document !== "undefined" ? document.body : null,
                            styles: { menuPortal: (b) => ({ ...b, zIndex: 9999 }) },
                        }}
                    />
                </div>

                {/* Days */}
                <div className="field">
                    <h2>How many days?</h2>
                    <input
                        type="number"
                        min={1}
                        placeholder="Ex. 3"
                        value={formData.noOfDays}
                        onChange={(e) =>
                            handleInputChange(
                                "noOfDays",
                                e.target.value ? Number(e.target.value) : ""
                            )
                        }
                    />
                </div>

                {/* Budget */}
                <div className="field">
                    <h2>What is your budget?</h2>
                    <div className="options-grid">
                        {SelectBudgetOptions.map((it) => (
                            <button
                                type="button"
                                key={it.id}
                                className={`option-card ${
                                    formData.budget === it.title ? "selected" : ""
                                }`}
                                onClick={() => handleInputChange("budget", it.title)}
                            >
                                <span className="icon">{it.icon}</span>
                                <span className="option-title">{it.title}</span>
                                <span className="option-desc">{it.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Travelers */}
                <div className="field">
                    <h2>Who do you plan to travel with?</h2>
                    <div className="options-grid">
                        {SelectTravelsList.map((it) => (
                            <button
                                type="button"
                                key={it.id}
                                className={`option-card ${
                                    formData.traveler === it.people ? "selected" : ""
                                }`}
                                onClick={() => handleInputChange("traveler", it.people)}
                            >
                                <span className="icon">{it.icon}</span>
                                <span className="option-title">{it.title}</span>
                                <span className="option-desc">{it.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="primary"
                    type="submit"
                    disabled={
                        !formData.location ||
                        !formData.noOfDays ||
                        !formData.budget ||
                        !formData.traveler
                    }
                >
                    Generate Trip
                </button>

                {/* Result / Loading / Error */}
                {loading && <p style={{ marginTop: 16 }}>Generating…</p>}
                {error && <p style={{ marginTop: 16, color: "crimson" }}>{error}</p>}
                {itinerary && (
                    <div style={{ marginTop: 24 }}>
                        <h2>{itinerary.city}</h2>

                        {/* Hotels section (text-only, no images) */}
                        {Array.isArray(itinerary.hotels) && itinerary.hotels.length > 0 && (
                            <section className="hotels-section">
                                <h3>Where to stay</h3>
                                <div className="hotels-grid">
                                    {itinerary.hotels.map((h, i) => (
                                        <div
                                            key={i}
                                            className="hotel-card"
                                            data-price={(h.priceBand || "")
                                                .toLowerCase()
                                                .replace(" ", "-")}
                                        >
                                            <div className="hotel-name">{h.name}</div>
                                            <div className="hotel-details">
                                                {h.area && <span>{h.area}</span>}
                                                {h.priceBand && <span>{h.priceBand}</span>}
                                            </div>

                                            {/* Actions (no thumbnails) */}
                                            <div className="hotel-actions">
                                                <a
                                                    className="hotel-btn maps"
                                                    href={h.mapsLink || mapsLinkFor(h.name, itinerary.city)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    🗺️ Maps
                                                </a>
                                                <a
                                                    className="hotel-btn booking"
                                                    href={
                                                        h.bookingLink || bookingLinkFor(h.name, itinerary.city)
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    🏨 Book
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <ItineraryView data={itinerary} />
                    </div>
                )}
            </form>
        </>
    );
}

export default CreateTrip;

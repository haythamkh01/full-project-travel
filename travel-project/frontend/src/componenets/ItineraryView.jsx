// src/components/ItineraryView.jsx
import { useState } from "react";
import { mapsLinkFor, ticketLinkFor } from "../service/linkHelpers";
import "./itineraryView.css";

export default function ItineraryView({ data }) {
    if (!data) return null;

    return (
        <div className="itin-wrap">
            {/* Seasonality */}
            {data.seasonality && (
                <section className="seasonality">
                    <h2>Seasonality</h2>
                    <p>{data.seasonality}</p>
                </section>
            )}

            {/* Days */}
            <section className="days">
                {data.days?.map((d) => (
                    <article key={d.day} className="day-card">
                        <header className="day-header">
                            <h3>Day {d.day}</h3>
                        </header>

                        <ul className="segments">
                            {d.segments?.map((s, i) => (
                                <li key={i} className="segment">
                                    {/* TEXT COLUMN ONLY (no photos/maps) */}
                                    <div className="seg-body">
                                        <div className="seg-head">
                      <span className={`chip ${s.suggestedTime || "other"}`}>
                        {s.suggestedTime || "any"}
                      </span>
                                            <h4 className="seg-title">{s.title}</h4>
                                        </div>

                                        {s.summary && <p className="seg-summary">{s.summary}</p>}

                                        <div className="seg-actions">
                                            <a
                                                className="btn"
                                                href={s.mapsLink || mapsLinkFor(s.title, data.city)}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="Open in Google Maps"
                                            >
                                                🗺️ Maps
                                            </a>
                                            <a
                                                className="btn"
                                                href={s.ticketLink || ticketLinkFor(s.title, data.city)}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="Find tickets/tours"
                                            >
                                                🎟️ Tickets
                                            </a>
                                            {s.openingHoursNote && (
                                                <HoursToggle note={s.openingHoursNote} />
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            {/* Notes */}
            {Array.isArray(data.notes) && data.notes.length > 0 && (
                <section className="notes">
                    <h3>Notes</h3>
                    <ul>
                        {data.notes.map((n, i) => (
                            <li key={i}>{n}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

function HoursToggle({ note }) {
    const [open, setOpen] = useState(false);
    return (
        <button
            type="button"
            className="btn ghost"
            onClick={() => setOpen((v) => !v)}
        >
            🕑 {open ? "Hide hours" : "Opening hours"}
            {open && <span className="hours-pop">{note}</span>}
        </button>
    );
}

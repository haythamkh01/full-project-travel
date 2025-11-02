// src/ai/linkHelpers.js

// Build a Google Maps search link
export const mapsLinkFor = (title, city) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${city}`)}`;

// Build a GetYourGuide search link for attractions/tickets
export const ticketLinkFor = (title, city) =>
    `https://www.getyourguide.com/s/?q=${encodeURIComponent(`${title} ${city}`)}`;

// Build a Booking.com search link for hotels
export const bookingLinkFor = (title, city, start, end) => {
    const params = new URLSearchParams({
        ss: `${title} ${city}`,
    });

    // If you have check-in/out dates, add them
    if (start) params.append("checkin", start);
    if (end) params.append("checkout", end);

    return `https://www.booking.com/searchresults.html?${params.toString()}`;
};

// Remove ```json fences if Gemini wraps the output
export const stripCodeFences = (text) =>
    text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");

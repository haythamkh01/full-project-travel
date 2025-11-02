
// src/ai/placePhotos.js
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

export const placesTextSearch = async (query) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results?.[0] || null; // first hit only (simple)
};

export const placeDetailsPhotos = async (placeId) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,name&key=${GOOGLE_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const p = data.result?.photos?.[0];
    return p ? { photoRef: p.photo_reference, attributions: p.html_attributions } : null;
};

export const placePhotoUrl = (photoRef, maxWidth = 800) =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${GOOGLE_KEY}`;

export function buildPrompt({ cityLabel, noOfDays, budget, traveler, month }) {
    return `
You are a travel assistant. Return ONLY valid JSON. No explanations outside JSON.

Inputs:
- City: ${cityLabel}
- Days: ${noOfDays}
- Budget: ${budget}
- Travelers: ${traveler}
- Travel month: ${month || "current month"}

Global rules:
- Output MUST be valid JSON (parseable without edits).
- Use real data when possible; if unsure, be conservative (never fabricate impossible coordinates).
- All URLs MUST be HTTPS and publicly accessible.
- Exactly ${noOfDays} days. Exactly 3 segments per day (morning, afternoon, evening).

Image URL policy (VERY IMPORTANT):
- For every "imageUrl" you return:
  - It must be a DIRECT image URL (responds with Content-Type image/*), not an HTML page.
  - Prefer these hosts: upload.wikimedia.org, images.unsplash.com, media.tacdn.com, staticflickr.com, i.imgur.com, or official tourism CDNs.
  - The URL should either:
      • end with .jpg / .jpeg / .png
      • OR be from images.unsplash.com with valid query parameters
  - MUST be ≥600px on the short edge (choose a large enough size).
  - Do NOT return links that require JavaScript to render, use redirect pages, or block hotlinking.
  - If no good image exists, return "imageUrl": null (do NOT invent or guess).

Day rules:
1. Create exactly 3 segments per day (morning, afternoon, evening).
2. Each segment must include:
   - title (attraction or activity)
   - summary (1–2 lines why it’s interesting)
   - suggestedTime (morning | afternoon | evening)
   - mapsLink (Google Maps URL)
   - ticketLink (GetYourGuide search URL with city & attraction name)
   - openingHoursNote (short, e.g. "Open 9–18, closed Tue")
   - imageUrl (HTTPS direct image link, see policy above)
   - geo { lat, lng } (numbers)

Top-level context:
3. Add a top-level "seasonality" field describing:
   - Typical weather this month (general, not forecast).
   - Crowds / tourist level.
   - Seasonal highlights (festivals, landscapes, foods).
4. Add a top-level "notes" array with 2–3 simple travel tips.

Hotels (3 items: Cheap, Moderate, Luxury):
5. Add a top-level "hotels" array with EXACTLY 3 items (one per price band). Each hotel must include:
   - name
   - area (short location note, e.g. "Near Old Town")
   - priceBand ("Cheap" | "Moderate" | "Luxury")
   - why (short reason: near transit, quiet, scenic, etc.)
   - mapsLink (Google Maps URL for the hotel)
   - bookingLink (Booking.com search or hotel page for the given city)
   - imageUrl (HTTPS direct image link, see policy above)
   - geo { lat, lng } (numbers)

Do not include any text outside the JSON.

JSON shape:
{
  "city": "string",
  "days": [
    {
      "day": 1,
      "segments": [
        {
          "title": "string",
          "summary": "string",
          "suggestedTime": "morning|afternoon|evening",
          "mapsLink": "string",
          "ticketLink": "string",
          "openingHoursNote": "string",
          "imageUrl": "string|null",
          "geo": { "lat": number, "lng": number }
        }
      ]
    }
  ],
  "seasonality": "string",
  "notes": ["string"],
  "hotels": [
    {
      "name": "string",
      "area": "string",
      "priceBand": "Cheap|Moderate|Luxury",
      "why": "string",
      "mapsLink": "string",
      "bookingLink": "string",
      "imageUrl": "string|null",
      "geo": { "lat": number, "lng": number }
    }
  ]
}
`.trim();
}

// src/components/PlaceImage.jsx
import { useEffect, useState } from "react";


export default function PlaceImage({ title, city, placeId: givenPlaceId, maxWidth = 800 }) {
    const [src, setSrc] = useState("");
    const [attr, setAttr] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                let pid = givenPlaceId;
                if (!pid) {
                    const hit = await placesTextSearch(`${title} ${city}`);
                    pid = hit?.place_id;
                }
                if (!pid) return;
                const photo = await placeDetailsPhotos(pid);
                if (!photo?.photoRef) return;
                if (mounted) {
                    setSrc(placePhotoUrl(photo.photoRef, maxWidth));
                    setAttr(photo.attributions || []);
                }
            } catch (e) {
                console.error("PlaceImage error:", e);
            }
        })();
        return () => { mounted = false; };
    }, [title, city, givenPlaceId, maxWidth]);

    if (!src) return null;

    return (
        <figure style={{ margin: 0 }}>
            <img src={src} alt={title} style={{ width: "100%", borderRadius: 12, display: "block" }} />
            {/* Google requires showing html_attributions if provided */}
            {attr?.length > 0 && (
                <figcaption style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                    {attr.map((a, i) => (
                        <span key={i} dangerouslySetInnerHTML={{ __html: a }} />
                    ))}
                </figcaption>
            )}
        </figure>
    );
}

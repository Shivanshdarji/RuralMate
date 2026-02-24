"use client";
import { useState, useEffect } from "react";

interface LocationData {
    lat: number | null;
    lon: number | null;
    city: string | null;
    error: string | null;
    loading: boolean;
}

export function useLocation() {
    const [location, setLocation] = useState<LocationData>({
        lat: null,
        lon: null,
        city: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: "Geolocation not supported", loading: false }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding using OpenStreetMap (No key required for small use)
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown Location";

                    setLocation({
                        lat: latitude,
                        lon: longitude,
                        city,
                        error: null,
                        loading: false,
                    });
                } catch (err) {
                    setLocation({
                        lat: latitude,
                        lon: longitude,
                        city: "Location Found",
                        error: null,
                        loading: false,
                    });
                }
            },
            (error) => {
                setLocation(prev => ({ ...prev, error: error.message, loading: false }));
            }
        );
    }, []);

    return location;
}

import { useCallback, useState } from "react";
import { GeoPoint } from "firebase/firestore";
import { geohashForLocation } from "geofire-common";
import type { GeoLocation } from "@/types/models";

interface UseGeolocationResult {
  /** True while a browser location request is in flight. */
  isLocating: boolean;
  /**
   * Requests the browser's current position and resolves to a Firestore-ready
   * GeoLocation (GeoPoint + geohash). Rejects with a readable Error on failure.
   */
  detect: () => Promise<GeoLocation>;
}

/**
 * Single implementation of "get the user's location", replacing the four
 * near-identical navigator.geolocation blocks that were copy-pasted across the
 * registration and create-post pages.
 */
export function useGeolocation(): UseGeolocationResult {
  const [isLocating, setIsLocating] = useState(false);

  const detect = useCallback(
    () =>
      new Promise<GeoLocation>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser."));
          return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setIsLocating(false);
            const { latitude, longitude } = position.coords;
            resolve({
              geoPoint: new GeoPoint(latitude, longitude),
              geohash: geohashForLocation([latitude, longitude]),
            });
          },
          (error) => {
            setIsLocating(false);
            reject(new Error(error.message));
          }
        );
      }),
    []
  );

  return { isLocating, detect };
}

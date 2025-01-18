import { updateInput } from "../utils/updateInput";

const ACCURACY_THRESHOLD = 20;

export function setupGPS({ speedInput, latInput, lngInput }) {
    const handleEvent = (event) => {
        if (event.coords.speed && event.coords.accuracy > ACCURACY_THRESHOLD) {
            updateInput(speedInput, event.coords.speed);
        }

        updateInput(latInput, event.coords.latitude);
        updateInput(lngInput, event.coords.longitude);
    };

    const watchPosition = () => {
        navigator.geolocation.watchPosition(
            handleEvent,
            (error) => {
                console.error(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                distanceFilter: 1,
            }
        );
    };

    watchPosition();
}

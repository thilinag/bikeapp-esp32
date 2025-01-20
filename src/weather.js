import { updateInput } from "../utils/updateInput";
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export function setupWeather({
    weatherInput,
    tempInput,
    iconInput,
    latInput,
    lngInput,
    requestsInput,
}) {
    let lat = latInput.value;
    let lng = lngInput.value;
    let previousLat = Infinity;
    let previousLng = Infinity;

    const getWeather = () => {
        if (!lat || !lng) return;

        if (
            Math.abs(lat - previousLat) > 0.01 ||
            Math.abs(lng - previousLng) > 0.01
        ) {
            previousLat = lat;
            previousLng = lng;

            requestsInput.value = requestsInput.valueAsNumber + 1;

            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&exclude=minutely,hourly,daily,alerts&units=metric`
            )
                .then((response) => response.json())
                .then((weatherData) => {
                    updateInput(tempInput, weatherData?.main.temp);
                    updateInput(weatherInput, weatherData?.weather?.[0]?.main);
                    updateInput(iconInput, weatherData?.weather?.[0]?.icon);
                });
        }
    };

    latInput.addEventListener("input", (e) => {
        lat = e.target.value;
        getWeather();
    });

    lngInput.addEventListener("input", (e) => {
        lng = e.target.value;
        getWeather();
    });
}

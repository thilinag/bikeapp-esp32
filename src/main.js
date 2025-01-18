import "./style.css";
import "./scss/styles.scss";

import { setupGarmin } from "./garmin.js";
import { setupESP32 } from "./esp32.js";
import { setupGPS } from "./gps.js";
import { setupWeather } from "./weather.js";

const speedInput = document.querySelector("#speed");
const latInput = document.querySelector("#lat");
const lngInput = document.querySelector("#lng");
const heartRateInput = document.querySelector("#heart-rate");
const weatherInput = document.querySelector("#weather");

setupWeather({
    latInput,
    lngInput,
    weatherInput,
});

setupGarmin({
    connectButton: document.querySelector("#connect-watch"),
    messagesContainer: document.querySelector("#watch-message"),
    heartRateInput,
});
setupESP32({
    connectButton: document.querySelector("#connect-esp32"),
    disconnectButton: document.querySelector("#disconnect-esp32"),
    messageContainer: document.querySelector("#messages"),
    speedInput,
    heartRateInput,
});
setupGPS({
    speedInput,
    latInput,
    lngInput,
});

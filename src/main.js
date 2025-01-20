import "./style.css";
import "./scss/styles.scss";

import { setupGarmin } from "./garmin.js";
import { setupESP32 } from "./esp32.js";
import { setupGPS } from "./gps.js";
import { setupWeather } from "./weather.js";
import { setupTime } from "./time.js";

const speedInput = document.querySelector("#speed");
const latInput = document.querySelector("#lat");
const lngInput = document.querySelector("#lng");
const heartRateInput = document.querySelector("#heart-rate");
const tempInput = document.querySelector("#temp");
const weatherInput = document.querySelector("#weather");
const iconInput = document.querySelector("#icon");
const timeInput = document.querySelector("#time");

setupWeather({
    latInput,
    lngInput,
    weatherInput,
    tempInput,
    iconInput,
    requestsInput: document.querySelector("#requests"),
});

setupGarmin({
    connectButton: document.querySelector("#connect-watch"),
    messagesContainer: document.querySelector("#watch-message"),
    heartRateInput,
});
setupESP32({
    connectButton: document.querySelector("#connect-esp32"),
    messageContainer: document.querySelector("#messages"),
    speedInput,
    heartRateInput,
    weatherInput,
    tempInput,
    iconInput,
    timeInput,
});
setupGPS({
    speedInput,
    latInput,
    lngInput,
});
setupTime({
    timeInput,
});

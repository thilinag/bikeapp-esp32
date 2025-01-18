import { msToKmh } from "../utils/msToKmh";
import { showMessage } from "../utils/showMessage";

export function setupESP32({
    connectButton,
    heartRateInput,
    speedInput,
    timeInput,
    weatherInput,
    tempInput,
    iconInput,
    messageContainer,
}) {
    //Define BLE Device Specs
    const deviceName = "ESP32";
    const bleService = "19b10000-e8f2-537e-4f6c-d104768a1214";
    const dataCharacteristic = "19b10002-e8f2-537e-4f6c-d104768a1214";

    //Global Variables to Handle Bluetooth
    let bleServer;
    let bleServiceFound;
    const queue = [];

    // Connect Button (search for BLE Devices only if BLE is available)
    connectButton.addEventListener("click", (event) => {
        if (isWebBluetoothEnabled()) {
            connectToDevice();
        }
    });

    // Check if BLE is available in your Browser
    function isWebBluetoothEnabled() {
        if (!navigator.bluetooth) {
            console.log("Web Bluetooth API is not available in this browser!");

            showMessage(
                messageContainer,
                "Web Bluetooth API is not available in this browser!",
                true
            );

            return false;
        }
        console.log("Web Bluetooth API supported in this browser.");
        return true;
    }

    // Connect to BLE Device and Enable Notifications
    function connectToDevice() {
        console.log("Initializing Bluetooth...");
        navigator.bluetooth
            .requestDevice({
                filters: [{ name: deviceName }],
                optionalServices: [bleService],
            })
            .then((device) => {
                console.log("Device Selected:", device.name);

                showMessage(
                    messageContainer,
                    "Connected to device " + device.name
                );

                device.addEventListener(
                    "gattservicedisconnected",
                    onDisconnected
                );
                return device.gatt.connect();
            })
            .then((gattServer) => {
                bleServer = gattServer;
                console.log("Connected to GATT Server");
                return bleServer.getPrimaryService(bleService);
            })
            .then((service) => {
                bleServiceFound = service;
                console.log("Service discovered:", service.uuid);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }

    function onDisconnected(event) {
        console.log("Device Disconnected:", event.target.device.name);

        showMessage(messageContainer, "Device disconnected", true);

        connectToDevice();
    }

    function writeOnCharacteristic(value) {
        if (bleServer && bleServer.connected) {
            bleServiceFound
                .getCharacteristic(dataCharacteristic)
                .then((characteristic) => {
                    console.log(
                        "Found the characteristic: ",
                        characteristic.uuid
                    );
                    return characteristic.writeValue(
                        new TextEncoder().encode(value)
                    );
                })
                .then(() => {
                    console.log("Value written to characteristic:", value);
                })
                .catch((error) => {
                    console.error(
                        "Error writing to the characteristic: ",
                        error
                    );
                });
        } else {
            console.error(
                "Bluetooth is not connected. Cannot write to characteristic."
            );
        }
    }

    function addToQueue(value) {
        queue.push(value);
    }

    // broadcast input changes

    heartRateInput.addEventListener("input", (e) => {
        const heartRate = e.target.value;
        if (heartRate.trim()) {
            addToQueue(`H${heartRate}`);
        }
    });

    speedInput.addEventListener("input", (e) => {
        const speed = e.target.value;
        if (speed.trim()) {
            addToQueue(`S${msToKmh(speed)}`);
        }
    });

    tempInput.addEventListener("input", (e) => {
        const temp = e.target.value;
        if (temp.trim()) {
            addToQueue(`T${Math.round(temp)}°C`);
        }
    });

    weatherInput.addEventListener("input", (e) => {
        const weather = e.target.value;
        if (weather.trim()) {
            addToQueue(`W${weather}`);
        }
    });

    iconInput.addEventListener("input", (e) => {
        const icon = e.target.value;
        if (icon.trim()) {
            addToQueue(`I${icon}`);
        }
    });

    timeInput.addEventListener("input", (e) => {
        const time = e.target.value;
        if (time.trim()) {
            addToQueue(`C${time}`);
        }
    });

    // send to BLE
    setInterval(() => {
        console.log({ queue });
        if (
            !bleServer ||
            !bleServer.connected ||
            !bleServiceFound ||
            queue.length === 0
        ) {
            console.log("not ready");
            return;
        }

        const message = queue.shift();
        writeOnCharacteristic(message);
    }, 250);
}

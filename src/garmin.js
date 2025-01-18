import { parseHeartRate } from "../utils/parseHeartRate";
import { updateInput } from "../utils/updateInput";
import { showMessage } from "../utils/showMessage";

export function setupGarmin({
    connectButton,
    heartRateInput,
    messagesContainer,
}) {
    const handleCharacteristicValueChanged = (event) => {
        const value = parseHeartRate(event.target.value);
        updateInput(heartRateInput, value);
    };

    const connectToDevice = () => {
        navigator.bluetooth
            .requestDevice({
                filters: [
                    {
                        services: [
                            0x0087, // garmin
                        ],
                    },
                    { services: ["heart_rate"] },
                ],
            })
            .then((device) => {
                console.log({ device });
                showMessage(messagesContainer, "Connected to " + device.name);
                connectButton.style.display = "none";

                device.addEventListener(
                    "gattservicedisconnected",
                    onDisconnected
                );

                return device.gatt.connect();
            })
            .then((server) => server.getPrimaryService("heart_rate"))
            .then((service) => {
                return service.getCharacteristic("heart_rate_measurement");
            })
            .then((characteristic) => {
                console.log({ characteristic });
                return characteristic.startNotifications();
            })
            .then((characteristic) => {
                characteristic.addEventListener(
                    "characteristicvaluechanged",
                    handleCharacteristicValueChanged
                );
                console.log("Notifications started");
            })
            .catch((error) => {
                console.error(error);
                connectButton.style.display = "block";
            });
    };

    const onDisconnected = (e) => {
        showMessage(
            messagesContainer,
            "Disconnected from " + e.target.device.name
        );
        connectButton.style.display = "block";
    };
    connectButton.addEventListener("click", () => connectToDevice());
}

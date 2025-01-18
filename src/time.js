import { updateInput } from "../utils/updateInput";

export function setupTime({ timeInput }) {
    const saveTime = () => {
        updateInput(
            timeInput,
            new Date().toLocaleTimeString("en-AU", {
                hour: "numeric",
                minute: "numeric",
                hour12: false,
            })
        );
    };

    const getTime = () => {
        const timer = setInterval(() => {
            saveTime();
        }, 60 * 1000);
    };

    getTime();
    saveTime();
}

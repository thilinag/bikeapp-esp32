export const showMessage = (messageElement, message, error = false) => {
    messageElement.innerHTML = message;
    if (error) {
        messageElement.classList.remove("alert-success");
        messageElement.classList.add("alert-danger");
    } else {
        messageElement.classList.remove("alert-danger");
        messageElement.classList.add("alert-success");
    }
};

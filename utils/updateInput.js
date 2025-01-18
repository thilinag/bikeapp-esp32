export const updateInput = (input, value) => {
    if (input.value != value) {
        input.value = value;
        input.dispatchEvent(new Event("input"));
    }
};

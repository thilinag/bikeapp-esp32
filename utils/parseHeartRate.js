export const parseHeartRate = (value) => {
    // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
    const readValue = value.buffer ? value : new DataView(value);
    return readValue.getUint8(1);
};

export const msToKmh = (speedInMetersPerSecond) => {
    return ((Number(speedInMetersPerSecond) / 1000) * 60 * 60).toFixed(1);
};

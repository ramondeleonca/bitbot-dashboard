export const parseBitDeviceName = (name: string) => {
    const [_deviceType, _deviceId] = name.split("-", 2);
    const deviceType = _deviceType.replace(/^(bit)/, "");
    const deviceId = parseInt(_deviceId);
    const deviceName = "Bit" + deviceType.charAt(0).toUpperCase() + deviceType.slice(1).toLowerCase();
    const prettyName = deviceName + " " + deviceId;
    return { deviceName, deviceId, deviceType, prettyName };
}

export const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
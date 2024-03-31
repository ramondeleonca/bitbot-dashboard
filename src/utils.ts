import { BitDevice } from "./types";

export const parseBitDeviceName = (name: string) => {
    const [_deviceType, _deviceId] = name.split("-", 2);
    const bitDevice = _deviceType as BitDevice;
    const deviceType = _deviceType.replace(/^(bit)/, "");
    const deviceId = parseInt(_deviceId);
    const deviceName = "Bit" + deviceType.charAt(0).toUpperCase() + deviceType.slice(1).toLowerCase();
    const prettyName = deviceName + " " + deviceId;
    return { deviceName, deviceId, deviceType, prettyName, bitDevice };
}

export const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
}

export class NumberDenoiser {
    private _value: number;
    private _threshold: number;
    private _timeThreshold: number;
    private _denoisedValue: number;
    private _lastUpdate: number = Date.now();

    constructor(threshold: number, timeThreshold: number = 500) {
        this._value = 0;
        this._threshold = threshold;
        this._timeThreshold = timeThreshold;
        this._denoisedValue = 0;
    }

    update(value: number) {
        const currentTime = Date.now();
        if (currentTime - this._lastUpdate < this._timeThreshold) return;
        if (Math.abs(value - this._value) > this._threshold) this._value = value;
        this._denoisedValue = this._value;
        this._lastUpdate = currentTime;
    }

    get value() {
        return this._denoisedValue;
    }
}
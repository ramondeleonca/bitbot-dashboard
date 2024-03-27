export const BitDeviceMaxId = 15;
export const BitDevices = <const>["bitphoton"];
export type BitDevice = typeof BitDevices[number];

export type BitDeviceStateBase = {
    memoryUsage: number;
    diskUsage: number;
    deltaTime: number;
    uptime: number;
}

export type BitPhotonState = BitDeviceStateBase & {
    light: number;
    lightEnum: "dark" | "dim" | "normal" | "bright";
}

export type BitButtonState = BitDeviceStateBase & {
    pressed: boolean;
}
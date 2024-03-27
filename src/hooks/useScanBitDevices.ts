import { useEffect, useState } from "react";
import { BitDeviceMaxId, BitDevices } from "../types";

export default function useScanBitDevices(initialState: Iterable<string> = []) {
    const [devices, setDevices] = useState(new Set(initialState));

    useEffect(() => {
        for (const deviceType of BitDevices) {
            for (let i = 0; i < BitDeviceMaxId; i++) {
                const abortController = new AbortController();
                const timeout = setTimeout(() => abortController.abort(), 10000);
                
                try {
                    fetch(`http://${deviceType}-${i}.local:80`, { signal: abortController.signal })
                        .then(res => res.ok ? setDevices(prev => new Set([...prev, `${deviceType}-${i}`])) : null)
                        .then(() => clearTimeout(timeout))
                        .catch(() => {});
                } catch { void 0 }
            }
        }
    }, []);

    return devices;
}
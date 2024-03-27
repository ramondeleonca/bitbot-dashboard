import { useMemo, useState } from "react";

export default function useRealtimeDeviceState<S>(address: string) {
    const [state, setState] = useState<S>();
    const [lastTime, setLastTime] = useState(performance.now());
    const [deltaTime, setDeltaTime] = useState(0);
    const ws = useMemo(() => new WebSocket(address), [address]);
    ws.addEventListener("message", message => {
        setState(JSON.parse(message.data));
        const now = performance.now();
        setDeltaTime(now - lastTime);
        setLastTime(now);
    });
    return { state, close: () => ws.close(), deltaTime };
}
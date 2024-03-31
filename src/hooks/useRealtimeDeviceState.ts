import { useEffect, useState } from "react";

export default function useRealtimeDeviceState<S>(address: string) {
    const [state, setState] = useState<S>();
    const [lastTime, setLastTime] = useState(performance.now());
    const [deltaTime, setDeltaTime] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [websocket, setWebsocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(address);
        setWebsocket(ws);
        ws.addEventListener("open", () => setIsConnected(true));
        ws.addEventListener("close", () => setIsConnected(false));
        ws.addEventListener("message", message => {
            setState(JSON.parse(message.data));
            const now = performance.now();
            setDeltaTime(now - lastTime);
            setLastTime(now);
        });
        return () => ws.close();
    }, [address]);

    return { state, close: () => websocket?.close(), deltaTime, isConnected };
}
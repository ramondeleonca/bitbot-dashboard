import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Led from "./Led";

// @eslint-ignore
export const ledIdToInt = (ledStates: boolean[]) => {
    return ledStates.reduce((acc, curr, i) => acc + (curr ? 2 ** i : 0), 0);
}

// @eslint-ignore
export const intToLedId = (ledId: number, numLeds: number) => {
    return Array.from({ length: numLeds }, (_, i) => (ledId & (1 << i)) > 0);
}

type Props = { ledId: number, setLedId: Dispatch<SetStateAction<number>>, numLeds?: number };
export default function LedID(props: Props) {
    const [ledStates, setLedStates] = useState(intToLedId(props.ledId ?? 0, props.numLeds ?? 4));
    useEffect(() => props.setLedId(ledIdToInt(ledStates)), [ledStates, props]);

    return (
        <div className="flex items-center justify-center">
            {ledStates.map((isOn, i) => <Led key={i} isOn={isOn} setIsOn={(val) => setLedStates(prev => prev.map((curr, currI) => currI == i ? val : curr))}></Led>)}
        </div>
    );
}
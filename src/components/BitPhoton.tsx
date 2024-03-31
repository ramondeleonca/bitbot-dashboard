import { CopyIcon, CubeIcon, GearIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import useRealtimeDeviceState from "@/hooks/useRealtimeDeviceState";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useCopyToClipboard } from "react-use";
import { toast } from "sonner";
import { NumberDenoiser, clamp, map } from "@/utils";
import { BitPhotonState } from "@/types";
import NumberFlip from "./numberflip";
import { useEffect, useMemo } from "react";

type Props = { bitDeviceId: number };
export default function BitPhoton(props: Props) {
    const { state, deltaTime, isConnected } = useRealtimeDeviceState<BitPhotonState>(`ws://bitphoton-${props.bitDeviceId}.local:81/`);
    const [, copyToClipboard] = useCopyToClipboard();
    const light = useMemo(() => new NumberDenoiser(1), []);
    useEffect(() => light.update(state?.light ?? 0), [state, light]);

    return (
        <div className="w-full h-full relative">
            <div className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-20 transition-opacity ${isConnected ? "opacity-0 pointer-events-none" : ""}`}>
                <p className="text-white text-4xl font-[Audiowide] ellipsis">Connecting</p>
            </div>

            <h1 className="text-5xl font-[Audiowide] p-4 text-center">BitPhoton {props.bitDeviceId.toString().padStart(2, "0")}</h1>

            {/* DATA DISPLAY */}
            <div className="w-full h-max flex items-center justify-center flex-col">
                <div className="device-display w-1/3 aspect-square relative pointer-events-none">
                    <img src="/BitPhoton/HighLight.png" className="high-light w-full h-full absolute top-0 left-0 object-contain z-[2] transition-opacity duration-500" style={{opacity: map(state?.light ?? 0, 0, 400, 0, 1)}}></img>
                    <img src="/BitPhoton/LowLight.png" className="low-light w-full h-full absolute top-0 left-0 object-contain z-[1]"></img>
                </div>

                <div className="info-small font-[Audiowide]">
                    <p>Light: <NumberFlip className="!inline-flex" number={light.value ?? 0} suffix="lux"></NumberFlip></p>
                    <p>Logarithmic light: <NumberFlip className="!inline-flex" number={clamp(Math.floor(Math.log(light.value ?? 0)) * 10, 0, 100)} suffix="%"></NumberFlip></p>
                </div>
            </div>

            {/* Settings dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="absolute top-2 right-2 aspect-square" variant={"outline"}><GearIcon></GearIcon></Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>BitPhoton {props.bitDeviceId}</DialogDescription>
                    </DialogHeader>

                    <p>Cannot set device settings yet.</p>
                </DialogContent>
            </Dialog>

            {/* Raw device status dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="absolute bottom-2 right-2 aspect-square" variant={"outline"}><CubeIcon></CubeIcon></Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Raw Device Status</DialogTitle>
                        <DialogDescription>BitPhoton {props.bitDeviceId}</DialogDescription>
                    </DialogHeader>

                    <p>Delta: {Math.floor(deltaTime) / 1000}</p>
                    <Textarea value={JSON.stringify(state)} className="overflow-auto max-h-28"></Textarea>

                    <Button variant={"secondary"} className="w-full" onClick={() => {copyToClipboard(JSON.stringify(state)); toast("Copied raw state to clipboard")}}><CopyIcon className="mr-2"></CopyIcon> Copy</Button>
                    <DialogClose asChild>
                        <Button className="w-full">Close</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    )
}
import { CopyIcon, CubeIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import useRealtimeDeviceState from "@/hooks/useRealtimeDeviceState";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useCopyToClipboard } from "react-use";
import { toast } from "sonner";

type Props = { bitDeviceId: number };
export default function BitPhoton(props: Props) {
    const { state, deltaTime } = useRealtimeDeviceState(`ws://bitphoton-${props.bitDeviceId}.local:81/`);
    const [, copyToClipboard] = useCopyToClipboard();

    return (
        <div className="w-full h-full relative">
            <h1 className="text-5xl font-[Audiowide] p-4 text-center">BitPhoton {props.bitDeviceId.toString().padStart(2, "0")}</h1>

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
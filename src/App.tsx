import { PlusCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import useScanBitDevices from './hooks/useScanBitDevices';
import { parseBitDeviceName } from "./utils";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { BitDevices } from "./types";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import BitPhoton from "./components/BitPhoton";

export default function App() {
    const availableDevices = useScanBitDevices();

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="max-w-96 min-w-60 w-72">
                <div className="sidebar h-full px-2 pt-0 flex flex-col items-start overflow-auto">
                    <Button variant="link" className="my-1">
                        <ReloadIcon fontSize={24} className="mr-2"></ReloadIcon>
                        Refresh
                    </Button>
                    <div className="w-full h-full flex flex-col justify-between items-center">
                        <div className="w-full flex justify-center flex-col">
                            {[...availableDevices].map((device, i) => {
                                const name = parseBitDeviceName(device);
                                return (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant={"outline"} size={"lg"} key={i} className="font-[Audiowide] text-lg py-8 mb-2">
                                                    <img src="/logo-white.svg" className="mr-2 h-8 w-8"></img>
                                                    {name.deviceName} {name.deviceId.toString().padStart(2, "0")}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{name.deviceName} {name.deviceId.toString().padStart(2, "0")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            })}
                        </div>
                        
                        <Dialog>
                            <div className="w-full">
                                <p className="opacity-50">Didn&apos;t find your device?</p>
                                <DialogTrigger asChild>
                                    <Button variant={"secondary"} size={"lg"} className="w-full mb-2">
                                        <PlusCircledIcon fontSize={24} className="mr-2"></PlusCircledIcon>
                                        Add a new device
                                    </Button>
                                </DialogTrigger>
                            </div>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add a new device</DialogTitle>
                                    <DialogDescription>If your device was not found, enter the device type and ID</DialogDescription>
                                </DialogHeader>
                                    
                                <div>
                                    <Label>Device Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Device Type"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BitDevices.map((device, i) => <SelectItem key={i} value={device}>{parseBitDeviceName(device).deviceName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Device ID</Label>
                                    <div className="flex">
                                        <Input type="number" placeholder="Device ID" className="mr-2" defaultValue={0} min={0} max={15}></Input>
                                        <DialogClose asChild>
                                            <Button type="submit">Add Device</Button>
                                        </DialogClose>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle></ResizableHandle>

            <ResizablePanel>
                <BitPhoton bitDeviceId={4}></BitPhoton>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
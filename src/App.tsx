import { PlusCircledIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
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
import { useLocalStorage } from "react-use";
import { FormEvent, useEffect, useMemo, useState } from "react";
import LedID from "./components/LedID";

export default function App() {
    const [manuallyAddedDevices, setManuallyAddedDevices, removeManuallyAddedDevices] = useLocalStorage<string[]>("manuallyAddedDevices", []);
    const [devices, setDevices, removeDevices] = useLocalStorage<string[]>("devices", []);
    const scannedDevices = useScanBitDevices(devices);
    useEffect(() => setDevices([...scannedDevices]), [scannedDevices, setDevices]);
    const availableDevices = useMemo(() => new Set([...(devices ?? []), ...manuallyAddedDevices ?? []]), [devices, manuallyAddedDevices]);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [ledId, setLedId] = useState(0);

    const manuallyAddDevice = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setManuallyAddedDevices(prev => [...new Set([...(prev ?? []), `${data.get("deviceType")}-${data.get("deviceId")}`])]);
    }

    const clearDevices = () => {
        setSelectedDevice(null);
        removeDevices();
        removeManuallyAddedDevices();
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={12.5} maxSize={25} defaultSize={15} className="min-w-60">
                <div className="sidebar h-full px-2 pt-0 flex flex-col items-start overflow-auto">
                    <div className="w-full flex items-center justify-between">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={"outline"}>
                                    <TrashIcon fontSize={24}></TrashIcon>
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Clear all BitBot devices?</DialogTitle>
                                    <DialogDescription>This will remove all devices from the list, you can rescan or readd them later</DialogDescription>
                                </DialogHeader>

                                <div className="flex justify-between">
                                    <DialogClose asChild>
                                        <Button>Cancel</Button>
                                    </DialogClose>

                                    <DialogClose asChild>
                                        <Button variant={"destructive"} onClick={clearDevices}>Clear All Devices</Button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button variant="link" className="my-1" onClick={() => window.location.reload()}>
                            <ReloadIcon fontSize={24} className="mr-2"></ReloadIcon>
                            Refresh
                        </Button>
                    </div>
                    <div className="w-full h-full flex flex-col justify-between items-center">
                        <div className="w-full flex justify-center flex-col">
                            {[...availableDevices].map((device, i) => {
                                const name = parseBitDeviceName(device);
                                return (
                                    <TooltipProvider key={i}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant={"outline"} size={"lg"} className="font-[Audiowide] text-lg py-8 mb-2" onClick={() => setSelectedDevice(device)}>
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
                                    <Button variant={"secondary"} size={"lg"} className="w-full mb-2" onClick={() => setLedId(0)}>
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
                                
                                <form onSubmit={manuallyAddDevice}>
                                    <div>
                                        <Label>Device Type</Label>
                                        <Select name="deviceType" required>
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
                                        <div className="my-2 w-full flex items-center justify-center">
                                            <LedID ledId={ledId} setLedId={setLedId}></LedID>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex">
                                            <Input name="deviceId" type="number" placeholder="Device ID" className="mr-2" min={0} max={15} value={ledId} onChange={ev => setLedId(parseInt(ev.target.value))}></Input>
                                            {/* TODO: Disable if form not valid */}
                                            <DialogClose asChild>
                                                <Button type="submit">Add Device</Button>
                                            </DialogClose>
                                        </div>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle></ResizableHandle>

            <ResizablePanel>
                {(() => {
                    if (selectedDevice !== null) {
                        const deviceName = parseBitDeviceName(selectedDevice);
    
                        switch (deviceName.bitDevice) {
                            case "bitphoton":
                                return <BitPhoton bitDeviceId={deviceName.deviceId}></BitPhoton>
                            default:
                                return <h1 className="text-center text-4xl font-[Audiowide] py-8">Device not supported</h1>
                        }
                    } else {
                        return <h1 className="text-center text-4xl font-[Audiowide] py-8">Select a device to view</h1>
                    }
                })()}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
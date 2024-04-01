import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, useEdgesState, useNodesState, addEdge, Connection } from "reactflow";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "./ui/context-menu";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import GetLightLevelNode from "./nodes/BitPhoton/GetLightLevelNode";

export default function Program() {
    const nodeTypes = useMemo(() => ({"BitPhoton.GetLightLevel": GetLightLevelNode}), [])
    const [active, setActive] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState([
        {id: "1", position: {x: 0, y: 0}, data: {label: "1"}},
        {id: "2", position: {x: 0, y: 0}, data: {label: "1"}},
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    useEffect(() => {setEdges(curr => curr.map(edge => ({...edge, animated: active})))}, [active, setEdges, edges]);

    return (
        <>
            <Button className="absolute top-2 right-2 aspect-square z-20" variant={"default"} onClick={() => setActive(curr => !curr)}>{active ? <PauseIcon fontSize={58}></PauseIcon> : <PlayIcon fontSize={58}></PlayIcon>}</Button>
            <div className={`w-full h-full transition-all duration-500 relative ${active ? "pointer-events-none opacity-75 scale-90 -z-10" : ""}`}>
                <ContextMenu>
                    <ContextMenuTrigger asChild>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                        >
                            <Controls></Controls>
                            <MiniMap></MiniMap>
                            <Background></Background>
                        </ReactFlow>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                        <ContextMenuLabel>Add a node</ContextMenuLabel>

                        {/* BitPhoton */}
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>BitPhoton</ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <ContextMenuLabel>Light level</ContextMenuLabel>
                                <ContextMenuItem onClick={() => setNodes(prev => [...prev, {id: "BitPhoton.GetLightLevel", position: {x: 0, y: 0}, type: "BitPhoton.GetLightLevel", data: {label: "Get Light Level"}}])}>Get light level</ContextMenuItem>
                                <ContextMenuItem>Get logarithmic light percentage</ContextMenuItem>

                                <ContextMenuLabel>WiFi</ContextMenuLabel>
                                <ContextMenuItem>Connect to WiFi</ContextMenuItem>
                                <ContextMenuItem>Disconnect from WiFi</ContextMenuItem>

                                <ContextMenuLabel>Settings</ContextMenuLabel>
                                <ContextMenuItem>Set WiFi SSID</ContextMenuItem>
                                <ContextMenuItem>Set WiFi password</ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>

                        {/* Math */}
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>Math</ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <ContextMenuItem>Add</ContextMenuItem>
                                <ContextMenuItem>Subtract</ContextMenuItem>
                                <ContextMenuItem>Multiply</ContextMenuItem>
                                <ContextMenuItem>Divide</ContextMenuItem>
                                <ContextMenuItem>Modulo</ContextMenuItem>
                                <ContextMenuItem>Power</ContextMenuItem>
                                <ContextMenuItem>Root</ContextMenuItem>
                                <ContextMenuItem>Logarithm</ContextMenuItem>
                                <ContextMenuItem>Exponential</ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
        </>
    );
}
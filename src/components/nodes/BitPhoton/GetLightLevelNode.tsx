import { Handle, Position } from "reactflow"

export default function GetLightLevelNode() {
    return (
        <div>
            <p>Get light level</p>
            <Handle type="target" position={Position.Right}></Handle>
        </div>
    )
}
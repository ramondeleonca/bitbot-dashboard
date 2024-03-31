type Props = { isOn: boolean, setIsOn: (state: boolean) => void };
export default function Led(props: Props) {
    return (
        <div className="container w-7 h-7 mr-1 aspect-square flex items-center justify-center outline-none relative">
            <input type="checkbox" className="absolute top-0 left-0 w-full h-full z-[3] opacity-0 cursor-pointer p-0 m-0" onChange={ev => props.setIsOn(ev.target.checked)}></input>
            <img className={`absolute top-0 left-0 w-full h-full z-[2] object-contain transition-opacity duration-200 ${props.isOn ? "opacity-100" : "opacity-0"}`} src="/led-on.svg" alt="LED On"></img>
            <img className="absolute top-0 left-0 w-full h-full z-[1] object-contain" src="/led-off.svg" alt="LED Off"></img>
        </div>
    );
}
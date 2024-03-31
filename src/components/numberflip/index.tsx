import cn from "classnames";
import styles from "./styles.module.scss";
import { useCopyToClipboard } from "react-use";

export type NumberFlipSegmentProps = { itemArray: string[], number: number }
export function NumberFlipSegment(props: NumberFlipSegmentProps) {
    return (
        <div className={styles.number_container}>
            <p className={styles.number_sizer}>{props.itemArray[0]}</p>
            <div className={styles.number_slider} style={{ transform: `translateY(-${props.number / props.itemArray.length * 100}%)` }}>
                {props.itemArray.map((item, index) => <div className={styles.number} key={index}>{item}</div>)}
            </div>
        </div>
    )
}

export type NumberFlipProps = { itemArray?: string[], number: number, suffix?: string, prefix?: string } & React.HTMLAttributes<HTMLDivElement>;
export default function NumberFlip(props: NumberFlipProps) {
    const numbers = props.number.toString().split("").map(Number);
    const itemArray = props.itemArray ?? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const [, copyToClipboard] = useCopyToClipboard();

    return (
        <div {...props} className={cn(styles.number_flip, props.className)} onCopy={ev => {ev.preventDefault(); copyToClipboard(`${props.prefix ?? ""}${props.number ?? 0}${props.suffix ?? ""}`)}}>
            {[
                <NumberFlipSegment key={props.prefix ?? "prefix"} itemArray={[props.prefix ?? ""]} number={0}></NumberFlipSegment>,
                ...numbers.map((number, index) => <NumberFlipSegment key={index} itemArray={itemArray} number={number}></NumberFlipSegment>),
                <NumberFlipSegment key={props.suffix ?? "suffix"} itemArray={[props.suffix ?? ""]} number={0}></NumberFlipSegment>
            ]}
        </div>
    )
}
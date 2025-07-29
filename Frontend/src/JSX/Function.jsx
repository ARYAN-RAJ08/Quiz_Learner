import { Cla } from "./Cla";
import Exam from '../Component/Exam';

export function Classes(val) {
    return (
        <Cla src={val.src} SubName={val.SubName} Class={val.Class} Level={val.Level} />
    )
}

export function EExxaamm(val) {
    return (
        <Exam queNo={val.queNo} question={val.question} optionOne={val.optionOne} optionTwo={val.optionTwo} optionThree={val.optionThree} optionFour={val.optionFour} />
    );
}
import { DatePicker } from "./date-picker";
import { Matcher } from "react-day-picker";
import ErrorMessage from "./error-message";
import { normalizeTime } from "~/masks";
import moment from "moment";
import { TimePicker } from "./time-picker";
type Props = {
  date?: Date,
  setDate?: (date?: Date) => void;
  error?: string;
  disabled?: boolean;
  disabledCalendarMatches?: Matcher | Matcher[] | undefined
}
const DateTimePicker = ({ date, disabled, disabledCalendarMatches, error, setDate }: Props) => {
  console.log(date);
  
  return ( 
    <>
      <div className="flex gap-2">
        <DatePicker
          label="Data: *" 
          disabled={disabled} 
          date={date}
          disabledCalendarMatches={disabledCalendarMatches}
          setDate={setDate}
        />
        <TimePicker 
          buttonText="Hora"
          className="w-full"
          // onChange={(e) => {
          //   e.target.value = normalizeTime(e.target.value); // retorna em format 00:00
          //   if(e.target.value.length === 5) {
          //     const hour = e.target.value.slice(0, 2);
          //     const minutes = e.target.value.slice(3, 5);
          //     const dateTime = moment(date).set('hour', +hour).set('minute', +minutes).set('second', 0).toDate();
          //     setDate?.(dateTime);
          //     return;
          //   }
          //   const dateTime = moment(date).set('hour', 0).set('minute', 0).set('second', 0).toDate();
          //   setDate?.(dateTime);
          // }}
          // value={date !== undefined ? normalizeTime(date.toString()) : ''}
        />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </>
  );
}
 
export default DateTimePicker;
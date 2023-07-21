import TextField from '@mui/material/TextField';
import TimePickers from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import th from 'date-fns/locale/th';
import dayjs, { Dayjs } from "dayjs";

function TimePicker({ label, value, onChange, disabled, style, defaulValue }) {
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                <TimePickers
                    ampm={false}
                    disabled={disabled}
                    label={false}
                    value={defaulValue ? defaulValue :value}
                    onChange={onChange}
                    inputFormat="hh:mm:ss"
                    renderInput={(params) => <TextField size="small" {...params}
                        style={style}
                      
                    />}
                    />
            </LocalizationProvider>
        </>
    );
}

export default TimePicker;
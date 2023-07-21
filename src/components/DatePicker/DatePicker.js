
import DatePicker from '@mui/lab/DatePicker';
import TextField from "@mui/material/TextField";
import th from 'date-fns/locale/th';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import Stack from "@mui/material/Stack";
import InputLabel from '@mui/material/InputLabel';

function SelectDate({ value, onChange, label, width, style, className, disabled, minDate }) {
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                <DatePicker
                        label={false}
                        minDate={minDate}
                        disabled={disabled}
                        cancelText="ปิด"
                        okText="ตกลง"
                        inputFormat="dd/MM/yyyy"
                        value={value}
                        onChange={onChange}
                       renderInput={(params) =>
                        <TextField size="small"
                            {...params} style={style} />}
                    />
            </LocalizationProvider>
        </>
    );
}

export default SelectDate;
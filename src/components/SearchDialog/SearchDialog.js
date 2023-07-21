import { React, useState, useEffect, useContext, useMemo } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchDialog(props) {
    const [opens, setOpens] = useState(false)
    const [searchText, setSearchText] = useState(props.searchText)
    const [title, setTitle] = useState(props.title)
    const [subTitle, setSubTitle] = useState(props.subTitle)

    const onClickOpenDialog = () => {
        setOpens(true)
    }

    const OnchangeSubmit = () => {
        props.onChangeSearchText(searchText);
        setOpens(false)
    }

    useEffect(() => {
        setOpens(props.open);
    }, [props.open])

    const getDialog = () => {
        return (<Dialog open={opens} maxWidth={'sm'} fullWidth={true}>
            <DialogTitle style={{ fontFamily: "Kanit", fontSize: "1vw", marginTop: "1%" }}>
                <h3>{title}</h3>
                <div><span>{subTitle}</span></div>
            </DialogTitle>
            <DialogContent dividers="paper">
                <div className="row">
                    <TextField
                        value={searchText}
                        id="outlined-basic"
                        label="ค้นหา"
                        variant="outlined"
                        onChange={(e) => { setSearchText(e.target.value); }}
                        onKeyUp={(e) => {
                            if (e.keyCode === 13) {
                                OnchangeSubmit()
                            }
                        }}
                        autoFocus
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button style={{
                    backgroundColor: "#239B56", color: "white", height: "40px",
                    borderRadius: "8px", fontFamily: "Kanit", fontSize: "0.9vw"
                }} onClick={() => { OnchangeSubmit() }}>
                    ตกลง
                </Button>
                <Button style={{
                    backgroundColor: "#CB4335", color: "white", height: "40px",
                    borderRadius: "8px", fontFamily: "Kanit", fontSize: "0.9vw"
                }}
                    onClick={() => { setOpens(false) }}>
                    ยกเลิก
                </Button>
            </DialogActions>
        </Dialog>)
    }

    return (
        <div>
            <Button style={{ backgroundColor: "#F1C40F", color: "white", height: "40px", width: "100%", borderRadius: "8px", fontFamily: "Kanit", fontSize: "0.9vw" }}
                onClick={() => { onClickOpenDialog() }}
                startIcon={<SearchIcon />}
            >
                <strong>เงื่อนไขการค้นหา</strong>
            </Button>
            {getDialog()}
        </div>
    )
}

export default SearchDialog
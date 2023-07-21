import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogConfirm({title, dialogContent, open, onAccept, onClose}) {
  
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>onClose()}
      >
        <DialogTitle style={{fontFamily: 'Kanit'}}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{fontFamily: 'Kanit'}}>
                {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{fontFamily: 'Kanit'}} onClick={()=>onClose()}>ยกเลิก</Button>
          <Button style={{fontFamily: 'Kanit'}} onClick={()=>onAccept()}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogConfirm;

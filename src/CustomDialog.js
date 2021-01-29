import React from 'react'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
function CustomDialog({openDialog, handleCloseOpenDialog, dialogTitle, dialogContentText, textFieldLabel,
                             textFieldType,setData, handleSubmitButton, cancelButtonText, submitButtonText}){
  return (
          <Dialog open={openDialog} onClose={handleCloseOpenDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {dialogContentText}
                </DialogContentText>
                <TextField
                  onChange = {e => setData(e.target.value)}
                  autoFocus
                  margin="dense"
                  id="name"
                  label={textFieldLabel}
                  type={textFieldType}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseOpenDialog} color="primary">
                  {cancelButtonText}
                </Button>
                <Button onClick={handleSubmitButton} color="primary">
                  {submitButtonText}
                </Button>
              </DialogActions>
          </Dialog>
  )
}
export default CustomDialog
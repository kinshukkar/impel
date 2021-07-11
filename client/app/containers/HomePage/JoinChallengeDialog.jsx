import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';

const JoinChallengeDialog = (props) => {
  const {
    onClose,
    value: valueProp,
    open,
  } = props;
  const [value, setValue] = React.useState(valueProp);

  React.useEffect(() => {
    if (!open) {
      setValue(value);
    }
  }, [value, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      // maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
    >
      <DialogTitle id="confirmation-dialog-title">Join Challenge</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To join this challenge, please commit some GAS amount. If you win the challenge, you would receive
          20% more than the amount you commit.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="gasAmount"
          label="GAS Amount"
          type="text"
          fullWidth
          value={value}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

JoinChallengeDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default JoinChallengeDialog;

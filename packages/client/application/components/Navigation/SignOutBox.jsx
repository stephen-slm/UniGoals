import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const SignOutBox = props => (
  <Dialog
    open={props.open && !props.disabled}
    TransitionComponent={Transition}
    onClose={props.onClose}
    aria-labelledby={`signout dialog for ${props.name}`}
    aria-describedby={`A signout box used for signing out ${props.name}`}
  >
    <DialogTitle>Sign out</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {`Are you sure you want to sign out ${props.name.split(' ')[0]}?`}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose} color="primary">
        Close
      </Button>
      <Button onClick={props.onSignOut} color="primary">
        Sign out
      </Button>
    </DialogActions>
  </Dialog>
);

SignOutBox.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSignOut: PropTypes.func,
};

SignOutBox.defaultProps = {
  onClose: () => undefined,
  onSignOut: () => undefined,
  disabled: false,
  open: false,
};

export default SignOutBox;

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const SignOutBox = (props) => (
  <Dialog
    open={props.open && !props.disabled}
    transition={Transition}
    onClose={props.onClose}
    aria-labelledby={`signout dialog for ${props.name}`}
    aria-describedby={`A signout box used for signing out ${props.name}`}
  >
    <DialogTitle>Sign out</DialogTitle>
    <DialogContent>
      <DialogContentText>{`Are you sure you want to sign out ${props.name}?`}</DialogContentText>
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

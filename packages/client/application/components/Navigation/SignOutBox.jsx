import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import React from 'react';

import { withSnackbar } from '../Utilities/SnackbarWrapper';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SignOutBox extends React.Component {
  state = {
    showLoading: false,
  };

  onSignOut = () => {
    this.setState({
      showLoading: !this.state.showLoading,
    });

    this.props.snackbar.showMessage('Signing out');
    this.props.onSignOut();
  };

  renderContent() {
    if (this.state.showLoading) {
      return (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress color="secondary" />
        </div>
      );
    }

    return <DialogContentText>{`Are you sure you want to sign out ${this.props.name.split(' ')[0]}?`}</DialogContentText>;
  }

  render() {
    return (
      <Dialog
        open={this.props.open && !this.props.disabled}
        TransitionComponent={Transition}
        onClose={this.props.onClose}
        aria-labelledby={`signout dialog for ${this.props.name}`}
        aria-describedby={`A signout box used for signing out ${this.props.name}`}
      >
        <DialogTitle>{this.state.showLoading ? 'Signing out' : 'Sign out'}</DialogTitle>
        <DialogContent>{this.renderContent()}</DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="secondary">
            Close
          </Button>
          {this.state.showLoading ? (
            <div />
          ) : (
            <Button onClick={this.onSignOut} color="primary">
              Sign out
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

SignOutBox.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSignOut: PropTypes.func,
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }).isRequired,
};

SignOutBox.defaultProps = {
  onClose: () => undefined,
  onSignOut: () => undefined,
  disabled: false,
  open: false,
};

export default withSnackbar()(SignOutBox);

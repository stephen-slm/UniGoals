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

class ModuleWrapper extends React.Component {
  onComplete = () => {
    this.props.onClose();
    this.props.onComplete();
  };

  render() {
    return (
      <Dialog
        open={this.props.open && !this.props.disabled}
        TransitionComponent={Transition}
        onClose={this.props.onClose}
        aria-labelledby={this.props.title}
        aria-describedby={this.props.title}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="secondary">
            {this.props.closeText}
          </Button>
          <Button onClick={this.onComplete} color="primary">
            {this.props.completeText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ModuleWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onComplete: PropTypes.func,
  closeText: PropTypes.string,
  completeText: PropTypes.string,
};

ModuleWrapper.defaultProps = {
  onClose: () => undefined,
  onComplete: () => undefined,
  disabled: false,
  open: false,
  closeText: 'Close',
  completeText: 'Complete',
};

export default ModuleWrapper;

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

class DeleteModule extends React.Component {
  onDelete = () => {
    this.props.onClose();
    this.props.onDelete();
  };

  render() {
    return (
      <Dialog
        style={{ visibility: this.props.open ? 'visible' : 'hidden' }}
        open={this.props.open && !this.props.disabled}
        TransitionComponent={Transition}
        onClose={this.props.onClose}
        aria-labelledby={`delete dialog for ${this.props.title}`}
        aria-describedby={`A delete box used for deleting ${this.props.title}`}
      >
        <DialogTitle>{`Deleting ${this.props.title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Are you sure you want to delete ${this.props.title}?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Close
          </Button>
          <Button onClick={this.onDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DeleteModule.propTypes = {
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

DeleteModule.defaultProps = {
  onClose: () => undefined,
  onDelete: () => undefined,
  disabled: false,
  open: false,
};

export default DeleteModule;

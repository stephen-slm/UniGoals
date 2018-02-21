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

const DeleteModule = (props) => (
  <Dialog
    open={props.open && !props.disabled}
    transition={Transition}
    onClose={props.onClose}
    aria-labelledby={`delete dialog for ${props.title}`}
    aria-describedby={`A delete box used for deleting ${props.title}`}
  >
    <DialogTitle>{`Deleting ${props.title}`}</DialogTitle>
    <DialogContent>
      <DialogContentText>{`Are you sure you want to delete ${props.title}?`}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose} color="primary">
        Close
      </Button>
      <Button onClick={props.onDelete} color="primary">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

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

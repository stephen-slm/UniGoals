import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';

const styles = (theme) => ({
  root: {},
  paper: {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  buttonDelete: {},
  buttonLeave: {},
});

const DeleteModule = (props) => {
  const { classes } = props;

  return (
    <Modal
      className={classes.root}
      aria-labelledby={`Deleting ${props.title}`}
      aria-describedby={`Deleting unit ${props.title} box`}
      open={props.open && !props.disabled}
      onClose={props.handleClose}
    >
      <div className={classes.paper}>
        <Typography variant="title" id="modal-title">
          Delete
        </Typography>
        <Typography component="p">
          Are you sure you want to delete unit <b>{props.title}</b>
        </Typography>
        <Button className={classes.buttonDelete} onClick={props.handleDelete}>
          Delete {props.title}
        </Button>
        <Button className={classes.buttonLeave} onClick={props.handleClose}>
          Exit
        </Button>
      </div>
    </Modal>
  );
};

DeleteModule.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func.isRequired,
};

DeleteModule.defaultProps = {
  handleClose: () => undefined,
  disabled: false,
  open: false,
};

export default withStyles(styles)(DeleteModule);

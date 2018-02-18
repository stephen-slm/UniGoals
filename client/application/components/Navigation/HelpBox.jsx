import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import TextField from 'material-ui/TextField';
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
    padding: theme.spacing.unit * 4,
    maxWidth: '70%',
    width: '60%',
    [theme.breakpoints.up('lg')]: {
      width: '40%',
    },
  },
  textBlob: {},
});

class HelpBox extends React.Component {
  constructor(props) {
    super();

    this.submitContent = this.submitContent.bind(this);
  }

  submitContent() {
    this.props.handleSubmit(this.helpText.value);
  }

  render() {
    const { classes } = this.props;

    return (
      <Modal
        className={classes.root}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        onClose={this.props.handleClose}
      >
        <div className={classes.paper}>
          <Typography variant="title" id="modal-title">
            Send Question / Feedback
          </Typography>
          <TextField
            inputRef={(ref) => {
              this.helpText = ref;
            }}
            label="Feedback"
            rows={4}
            multiline
            fullWidth={this.props.fullWidth}
            minLength={this.props.minLength}
            maxLength={this.props.maxLength}
            className={classes.textBlob}
            error={this.props.error}
            placeholder="If you have any problems or help please ask below and I will email you back!"
            margin="normal"
          />
          <Button onClick={this.submitContent}>Send Question</Button>
        </div>
      </Modal>
    );
  }
}

HelpBox.propTypes = {
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  handleSubmit: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
};

HelpBox.defaultProps = {
  error: false,
  fullWidth: true,
  handleSubmit: () => undefined,
  handleClose: () => undefined,
  open: false,
  minLength: 0,
  maxLength: Infinity,
};

export default withStyles(styles)(HelpBox);

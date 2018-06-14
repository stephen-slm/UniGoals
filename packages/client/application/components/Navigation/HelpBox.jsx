import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class HelpBox extends React.Component {
  constructor(props) {
    super(props);

    this.submitContent = this.submitContent.bind(this);
  }

  submitContent() {
    this.props.handleSubmit(this.helpText.value);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        TransitionComponent={Transition}
        onClose={this.props.handleClose}
        aria-labelledby="Submitting feedback"
      >
        <DialogTitle>Send Question/Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>If you have any problems or help please ask below and I will email you back!</DialogContentText>
          <TextField
            inputRef={(ref) => {
              this.helpText = ref;
            }}
            label="Feedback"
            multiline
            autoFocus
            fullWidth={this.props.fullWidth}
            minLength={this.props.minLength}
            maxLength={this.props.maxLength}
            error={this.props.error}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.submitContent} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

HelpBox.propTypes = {
  fullWidth: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  error: PropTypes.bool,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
};

HelpBox.defaultProps = {
  error: false,
  fullWidth: true,
  minLength: null,
  maxLength: null,
  handleClose: () => undefined,
  open: false,
};

export default HelpBox;

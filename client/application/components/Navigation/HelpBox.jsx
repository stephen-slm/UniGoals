import React from 'react';
import PropTypes from 'prop-types';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class HelpBox extends React.Component {
  constructor() {
    super();

    this.submitContent = this.submitContent.bind(this);
  }

  submitContent() {
    this.props.handleSubmit(this.helpText.value);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="Submitting feedback"
      >
        <DialogTitle>Send Question/Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you have any problems or help please ask below and I will email you back!
          </DialogContentText>
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
          <Button onClick={this.props.handleClose} color="primary">
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
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
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

export default HelpBox;

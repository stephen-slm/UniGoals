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
import Slide from 'material-ui/transitions/Slide';

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
        transition={Transition}
        onClose={this.props.handleClose}
        aria-labelledby="Submitting feedback"
      >
        <DialogTitle>Send Question/Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you have any problems or help please ask below and I will email you back!
          </DialogContentText>
          <TextField
            inputRef={ref => {
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

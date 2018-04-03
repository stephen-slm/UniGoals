import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import uuid from 'uuid/v4';

const styles = () => ({
  root: {
    position: 'relative',
  },
  span: {
    display: 'none',
    ':hover::before': {
      boxShadow: '',
    },
  },
});

class EditableText extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value == null ? props.defaultValue : props.value;

    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.maybeRenderInput = this.maybeRenderInput.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleFocus = this.handleFocus.bind(this);

    this.state = {
      isEditing: props.isEditing === true && props.disabled === false,
      lastValue: value,
      value,
      inputId: uuid(),
    };
  }

  componentWillReceiveProps(nextProps) {
    const state = {};
    if (nextProps.value != null) {
      state.value = nextProps.value;
    }
    if (nextProps.isEditing != null) {
      state.isEditing = nextProps.isEditing;
    }
    if (nextProps.disabled || (nextProps.disabled == null && this.props.disabled)) {
      state.isEditing = false;
    }
    this.setState(state);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isEditing && !prevState.isEditing) {
      this.props.onEdit();
    }
  }
  cancelEditing() {
    const { lastValue, value } = this.state;
    this.setState({ isEditing: false, value: lastValue });
    if (value !== lastValue) {
      this.props.onChange(lastValue);
    }
    this.props.onCancel(lastValue);
  }

  toggleEditing() {
    if (this.state.isEditing) {
      const { value } = this.state;
      this.setState({ isEditing: false, lastValue: value });
      this.props.onConfirm(value);
    } else if (!this.props.disabled) {
      this.setState({ isEditing: true });
    }
  }

  handleFocus() {
    if (!this.props.disabled) {
      this.setState({ isEditing: true });
    }
  }

  handleTextChange(event) {
    const { value } = event.target;

    // state value should be updated only when uncontrolled
    if (this.props.value == null) {
      this.setState({ value });
    }
    this.props.onChange(value);
  }

  handleKeyEvent(event) {
    const { altKey, shiftKey, which } = event;
    if (which === 27) {
      this.cancelEditing();
      return;
    }

    if (which === 13) {
      // prevent IE11 from full screening with alt + enter
      // shift + enter adds a newline by default
      if (altKey || shiftKey) {
        event.preventDefault();
      }

      this.toggleEditing();
    }
  }

  /**
   * Puts the Cursor at the end of the eletement, we use getElement
   * because the ref is not set fast enough
   */
  handleInputFocus() {
    const inputElement = document.getElementById(`editableEdit-${this.state.inputId}`);
    const { value } = inputElement.value;
    inputElement.value = null;
    inputElement.value = value;
  }

  maybeRenderInput(value, rootStyle) {
    const { maxLength } = this.props;
    if (!this.state.isEditing) {
      return undefined;
    }
    const props = {
      maxLength,
      onBlur: this.toggleEditing,
      onChange: this.handleTextChange,
      onKeyDown: this.handleKeyEvent,
      style: {
        lineHeight: this.state.inputHeight != null ? `${this.state.inputHeight}px` : null,
        width: this.state.inputWidth,
      },
      value,
    };
    return (
      <input
        // Auto focuus on clicking the input
        autoFocus // eslint-disable-line
        onFocus={this.handleInputFocus}
        className={`${this.props.className} ${rootStyle}`}
        size={Number(this.state.value.length)}
        type="text"
        id={`editableEdit-${this.state.inputId}`}
        {...props}
      />
    );
  }

  render() {
    const { disabled } = this.props;
    const value = this.props.value == null ? this.state.value : this.props.value;
    const hasValue = value != null && value !== '';

    const tabIndex = this.state.isEditing || disabled ? null : 0;

    const { classes } = this.props;

    const contentStyle = {
      display: this.state.isEditing ? 'none' : 'inherit',
      height: this.state.inputHeight,
      lineHeight: this.state.inputHeight != null ? `${this.state.inputHeight}px` : null,
      minWidth: this.props.minWidth,
    };

    return (
      <Typography
        component="div"
        className={`${this.props.className} ${classes.root}`}
        onFocus={this.handleFocus}
        tabIndex={tabIndex}
      >
        {this.maybeRenderInput(value, classes.root)}
        <Typography
          variant={this.props.variant}
          style={contentStyle}
          className={classes.span}
          component={this.props.type}
        >
          {hasValue ? value : this.props.placeholder}
        </Typography>
      </Typography>
    );
  }
}

EditableText.propTypes = {
  onChange: PropTypes.func,
  onConfirm: PropTypes.func,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  confirmOnEnterKey: PropTypes.bool,
  selectAllOnFocus: PropTypes.bool,
  isEditing: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  minWidth: PropTypes.number,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  variant: PropTypes.string,
  classes: PropTypes.shape({}).isRequired,
};

EditableText.defaultProps = {
  className: '',
  onChange: () => null,
  onConfirm: () => null,
  onEdit: () => null,
  onCancel: () => null,
  isEditing: null,
  confirmOnEnterKey: false,
  selectAllOnFocus: false,
  value: null,
  defaultValue: null,
  disabled: false,
  minWidth: 80,
  maxLength: Infinity,
  placeholder: 'Click to Edit',
  type: 'div',
  variant: 'body1',
};

export default withStyles(styles)(EditableText);

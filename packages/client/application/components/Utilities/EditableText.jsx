import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import uuid from 'uuid/v4';

import classNames from 'classnames';

const styles = () => ({
  root: {
    overflow: ' hidden',
    display: ' inline-block',
  },
  span: {
    border: '1px transparent solid',
    borderRadius: '3px',
    paddingLeft: '6px',
    paddingRight: '6px',
    '&:hover': {
      borderColor: '#a8adb3',
    },
  },
  spanConstant: {
    border: '1px transparent solid',
    borderColor: '#a8adb3',
    borderRadius: '3px',
    paddingLeft: '6px',
    paddingRight: '6px',
  },
});

class EditableText extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value == null ? props.defaultValue : props.value;

    this.state = {
      isEditing: props.isEditing === true && props.disabled === false,
      lastValue: value,
      value,
      inputId: uuid(),
      centerText: this.props.centerText,
    };
  }

  componentWillReceiveProps = (nextProps) => {
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
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isEditing && !prevState.isEditing) {
      this.props.onEdit();
    }
  }
  cancelEditing = () => {
    const { lastValue, value } = this.state;
    this.setState({ isEditing: false, value: lastValue });
    this.props.onChangeState(false);
    if (value !== lastValue) {
      this.props.onChange(lastValue);
    }
    this.props.onCancel(lastValue);
  };

  toggleEditing = () => {
    if (this.state.isEditing) {
      const { value } = this.state;
      this.setState({ isEditing: false, lastValue: value });
      this.props.onChangeState(false);
      this.props.onConfirm(value);
    } else if (!this.props.disabled) {
      this.setState({ isEditing: true });
      this.props.onChangeState(true);
    }
  };

  handleFocus = () => {
    if (!this.props.disabled) {
      this.setState({ isEditing: true });
      this.props.onChangeState(true);
    }
  };

  handleTextChange = (event) => {
    const { value } = event.target;

    // state value should be updated only when uncontrolled
    if (this.props.value == null) {
      this.setState({ value });
    }
    this.props.onChange(value);
  };

  handleKeyEvent = (event) => {
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
  };

  /**
   * Puts the Cursor at the end of the eletement, we use getElement
   * because the ref is not set fast enough
   */
  handleInputFocus = () => {
    const inputElement = document.getElementById(`editableEdit-${this.state.inputId}`);
    const { value } = inputElement.value;
    inputElement.value = null;
    inputElement.value = value;
  };

  maybeRenderInput = (value) => {
    const { maxLength, classes } = this.props;
    if (!this.state.isEditing) {
      const hasValue = value != null && value !== '';

      const contentStyle = {
        display: this.state.isEditing ? 'none' : 'inherit',
      };

      return (
        <Typography variant={this.props.variant} style={contentStyle} className={classes.span} component={this.props.type}>
          {hasValue ? value : this.props.placeholder}
        </Typography>
      );
    }
    const props = {
      maxLength,
      onBlur: this.toggleEditing,
      onChange: this.handleTextChange,
      onKeyDown: this.handleKeyEvent,
      value,
    };
    return (
      <input
        autoFocus // eslint-disable-line
        onFocus={this.handleInputFocus}
        className={classNames(classes.spanConstant, this.props.className)}
        size={Number(this.state.value.length)}
        type="text"
        style={{
          wordWrap: 'break-word',
          textAlign: this.state.centerText ? 'center' : 'inherit',
        }}
        id={`editableEdit-${this.state.inputId}`}
        {...props}
      />
    );
  };

  render() {
    const { disabled, classes } = this.props;
    const value = this.props.value == null ? this.state.value : this.props.value;
    const tabIndex = this.state.isEditing || disabled ? null : 0;

    return (
      <Typography component="span" className={classes.root} onFocus={this.handleFocus} tabIndex={tabIndex}>
        {this.maybeRenderInput(value)}
      </Typography>
    );
  }
}

EditableText.propTypes = {
  onChangeState: PropTypes.func,
  onChange: PropTypes.func,
  onConfirm: PropTypes.func,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  confirmOnEnterKey: PropTypes.bool,
  selectAllOnFocus: PropTypes.bool,
  isEditing: PropTypes.bool,
  centerText: PropTypes.bool,
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
  onChangeState: () => null,
  onChange: () => null,
  onConfirm: () => null,
  onEdit: () => null,
  onCancel: () => null,
  isEditing: null,
  centerText: false,
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

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class SnackbarProvider extends PureComponent {
  state = {
    message: null,
    open: false,
  };

  getChildContext() {
    return {
      snackbar: {
        showMessage: this.showMessage,
      },
    };
  }

  /**
   * Display a message with this snackbar.
   * @param {string} message message to display
   * @param {string} [action] label for the action button
   * @param {function} [handleAction] click handler for the action button
   * @public
   */
  showMessage = (message, action, handleAction) => {
    this.setState({
      open: true,
      message,
      action,
      handleAction,
    });
  };

  handleActionClick = () => {
    this.handleClose();
    this.state.handleAction();
  };

  handleClose = () => {
    this.setState({ open: false, handleAction: null });
  };

  render() {
    const {
      action, message, open, handleAction,
    } = this.state;

    const { children, snackbarProps = {}, style = {} } = this.props;

    return (
      <div style={{ width: 'inherit', height: 'inherit', ...style }}>
        {children}
        <Snackbar
          {...snackbarProps}
          open={open}
          message={message || ''}
          action={
            <div>
              {action != null &&
                handleAction != null && (
                  <Button color="primary" onClick={this.handleActionClick}>
                    {action.toUpperCase()}
                  </Button>
                )}
              <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          }
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

SnackbarProvider.childContextTypes = {
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }),
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
  snackbarProps: PropTypes.shape({}),
  style: PropTypes.shape({}),
};

SnackbarProvider.defaultProps = {
  children: <div />,
  snackbarProps: {},
  style: {},
};

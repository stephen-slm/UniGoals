import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import Menu, { MenuItem } from 'material-ui/Menu';
import Fade from 'material-ui/transitions/Fade';
import Avatar from 'material-ui/Avatar';
import { withRouter } from 'react-router-dom';

const styles = (theme) => ({
  root: {},
  avatar: {
    marginLeft: 10,
  },
  menu: {
    top: theme.spacing.unit * 3,
    left: -(theme.spacing.unit * 4),
  },
});

class DropDownAvatar extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleHome = () => {
    this.handleClose();
    this.props.history.push('/home');
  };

  handleProfile = () => {
    this.handleClose();
    this.props.history.push('/profile');
  };

  handleSignOut = () => {
    this.handleClose();
    this.props.signOutClick();
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? 'fade-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Avatar alt={this.props.profile.name} src={this.props.url} className={classes.avatar} />
        </IconButton>
        <Menu
          className={classes.menu}
          id="fade-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={this.handleHome}>Home</MenuItem>
          <MenuItem onClick={this.handleProfile}>My Profile</MenuItem>
          <MenuItem onClick={this.handleSignOut}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}

DropDownAvatar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.string,
  }).isRequired,
  url: PropTypes.string.isRequired,
  signOutClick: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(DropDownAvatar));

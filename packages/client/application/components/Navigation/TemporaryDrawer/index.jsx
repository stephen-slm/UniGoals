import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import { withRouter } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';

import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Icon from '@material-ui/core/Icon';

const styles = (theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  iconWrapper: {
    paddingTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    minWidth: '0px',
    display: 'inline-grid',
    gridGap: `${theme.spacing.unit}px`,
    gridTemplateColumns: 'auto auto',
    gridTemplateRows: 'auto',
  },
  iconGrid: {
    gridColumn: '1',
    gridRow: '1',
  },
  iconGridTwo: {
    marginTop: theme.spacing.unit + 2,
    gridColumn: '2',
    gridRow: '1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: theme.spacing.unit * 25,
  },
  logo: {
    width: 50,
    height: 50,
  },
  toolbar: theme.mixins.toolbar,
});

class TemporaryDrawer extends React.Component {
  getNotificationBadge = () => {
    const moreThanZero = this.props.notificationCount > 0;

    if (moreThanZero) {
      return (
        <Badge badgeContent={this.props.notificationCount}>
          <Icon>notifications</Icon>
        </Badge>
      );
    }

    return <Icon>notifications</Icon>;
  };

  handleHome = () => {
    this.props.onClose();
    this.props.history.push('/home');
  };
  handleProfile = () => {
    this.props.onClose();
    this.props.history.push('/profile');
  };

  handleNotifications = () => {
    this.props.onClose();
    this.props.history.push('/notifications');
  };

  handleSettings = () => {
    this.props.onClose();
    this.props.history.push('/settings');
  };

  render() {
    const { classes } = this.props;
    return (
      <Drawer open={this.props.open} onClose={this.props.onClose} style={{ visibility: this.props.open ? 'visible' : 'hidden' }}>
        <div tabIndex={0} role="button" onClick={this.props.onClose} onKeyDown={this.props.onClose}>
          <div className={classes.list}>
            <div className={classes.toolbar}>
              <div className={classes.iconWrapper}>
                <div className={classes.iconGrid}>
                  <Avatar alt={this.props.profile.name} src={this.props.url} className={classes.avatar} />
                </div>
                <div className={classes.iconGridTwo}>{this.props.profile.email}</div>
              </div>
            </div>
            <Divider />
            <List component="nav">
              <ListItem button onClick={this.handleHome}>
                <ListItemIcon>
                  <Icon>home</Icon>
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button onClick={this.handleNotifications}>
                <ListItemIcon>{this.getNotificationBadge()}</ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>
              <ListItem button onClick={this.handleProfile}>
                <ListItemIcon>
                  <Icon>person</Icon>
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem button onClick={this.handleSettings}>
                <ListItemIcon>
                  <Icon>settings</Icon>
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem button onClick={this.props.signOutClick}>
                <ListItemIcon>
                  <Icon>exit_to_app</Icon>
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItem>
            </List>
            <Divider />
            <List component="nav">
              <ListItem button onClick={this.props.showHelpBox}>
                <ListItemText primary="Send Feedback" />
              </ListItem>
            </List>
          </div>
        </div>
      </Drawer>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  signOutClick: PropTypes.func.isRequired,
  showHelpBox: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  notificationCount: PropTypes.number.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default withRouter(withStyles(styles)(TemporaryDrawer));

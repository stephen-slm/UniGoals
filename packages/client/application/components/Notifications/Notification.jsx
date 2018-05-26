import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

import firebase from '../../utils/FirebaseWrapper';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.dismissNotification = this.dismissNotification.bind(this);
    this.parseNotification = this.parseNotification.bind(this);

    this.state = {
      title: props.notification.title,
      message: this.parseNotification(),
      keyIndex: props.keyIndex,
    };
  }

  dismissNotification() {
    this.props.removeNotification(this.state.keyIndex);
    firebase.dismissNotification(this.state.keyIndex);
  }

  parseNotification() {
    return this.props.notification.message;
  }

  render() {
    const { classes } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{this.state.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ display: 'block' }}>
          <Typography component="div" dangerouslySetInnerHTML={{ __html: this.state.message }} />
          <Button onClick={this.dismissNotification}>Dismiss</Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

Notification.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  notification: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  removeNotification: PropTypes.func.isRequired,
  keyIndex: PropTypes.string.isRequired,
};

Notification.defaultProps = {};

export default withStyles(styles)(Notification);

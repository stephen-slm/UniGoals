import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import { withSnackbar } from '../Utilities/SnackbarWrapper';
import firebase from '../../utils/FirebaseWrapper';

const styles = (theme) => ({
  heading: {
    marginTop: theme.spacing.unit / 2,
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },
});

class Notification extends React.Component {
  dismissNotification = () => {
    this.props.snackbar.showMessage(`Dismissed notification ${this.props.notification.title}`);
    this.props.removeNotification(this.props.keyIndex);
    firebase.dismissNotification(this.props.keyIndex);
  };

  render() {
    const { classes } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="caption" className={classes.heading}>
            {new Date(this.props.notification.timestamp).toDateString()}
          </Typography>
          <Typography className={classes.secondaryHeading}>{this.props.notification.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography dangerouslySetInnerHTML={{ __html: this.props.notification.message }} />
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button size="small" onClick={this.dismissNotification}>
            Dismiss
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

Notification.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  notification: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    timestamp: PropTypes.number,
  }).isRequired,
  removeNotification: PropTypes.func.isRequired,
  keyIndex: PropTypes.string.isRequired,
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }).isRequired,
};

export default withStyles(styles)(withSnackbar()(Notification));

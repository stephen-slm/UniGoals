import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import UnitTable from '../Unit/index';
import { getAchievedFromUnit } from '../../utils/utils';

const styles = (theme) => ({
  root: {
    margin: '0 auto',
    maxWidth: '90%',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    float: 'right',
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  column: {
    flexBasis: '40%',
  },
  details: {
    display: 'block',
    padding: '0',
    flexGrow: '0',
  },
});

const Expandable = (props) => {
  const { classes } = props;

  const passableProps = Object.assign({}, props);
  const total = getAchievedFromUnit(props.unit, props.unit.double);

  delete passableProps.classes;

  return (
    <div className={classes.root}>
      <ExpansionPanel square>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading} variant="body2">
              {props.unit.title} {props.unit.double ? '(double)' : ''}{' '}
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography variant="body2" className={classes.secondaryHeading}>
              {props.unit.dropped ? '(dropped)' : `Total: ${total.toFixed(2)}%`}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.details }}>
          <UnitTable {...passableProps} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

Expandable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  unit: PropTypes.shape({
    title: PropTypes.string,
    dropped: PropTypes.bool,
    double: PropTypes.bool,
    content: PropTypes.shape({}),
  }).isRequired,
};

export default withStyles(styles)(Expandable);

import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';

import UnitTable from '../Unit/index';
import { getAchievedFromUnit } from '../../utils/utils';

const styles = (theme) => ({
  root: {
    margin: '0px auto',
    maxWidth: '80%',
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
    flexBasis: '33.33%',
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
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>
              {props.unit.title} {props.unit.double ? '(double)' : ''}{' '}
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>{props.unit.dropped ? '(dropped)' : `Total: ${total.toFixed(2)}%`}</Typography>
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

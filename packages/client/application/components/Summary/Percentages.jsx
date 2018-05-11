import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import {
  getAchievedFromUnits,
  getAchievedFromUnit,
  getMaxAchievedFromUnit,
  getMaxAchievedFromUnits,
  getAverageFromUnit,
  getAverageFromUnits,
} from '../../utils/utils';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    maxWidth: theme.spacing.unit * 24,
    minHeight: '100px',
  },
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit,
  },
  grid: {
    marginTop: theme.spacing.unit,
    flexGrow: 1,
  },
});

class Perentages extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { classes } = this.props;
    let percentages;
    let total = 0;

    if (this.props.isSummary) {
      percentages = {
        max: getMaxAchievedFromUnits(this.props.units).toFixed(2),
        average: getAverageFromUnits(this.props.units).toFixed(2),
      };
      total = getAchievedFromUnits(this.props.units).toFixed(2);
    } else {
      percentages = {
        max: getMaxAchievedFromUnit(this.props.unit).toFixed(2),
        average: getAverageFromUnit(this.props.unit).toFixed(2),
      };
      total = getAchievedFromUnit(this.props.unit).toFixed(2);
      if (this.props.unit.double) {
        total /= 2;
        percentages.max /= 2;
      }
    }

    return (
      <Paper
        style={{
          height: this.props.height * 40,
          maxWidth: !this.props.isSummary ? 'none' : undefined,
        }}
        className={classes.root}
        elevation={this.props.backdrop ? 1 : 0}
      >
        <Typography className={classes.title} component="p">
          Percentages
        </Typography>
        <Typography component="div">
          <Grid container className={classes.grid}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={Number(8)}>
                <Grid item>Average: {Number(_.defaultTo(percentages.average, 0))}%</Grid>
                <Grid item>Max: {Number(_.defaultTo(percentages.max, 100))}%</Grid>
                <Grid item>Total: {Number(total).toFixed(2)}%</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Typography>
      </Paper>
    );
  }
}

Perentages.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}),
  unit: PropTypes.shape({
    content: PropTypes.shape({}),
    title: PropTypes.string,
    double: PropTypes.bool,
    dropped: PropTypes.bool,
  }),
  height: PropTypes.number.isRequired,
  isSummary: PropTypes.bool,
  backdrop: PropTypes.bool,
};

Perentages.defaultProps = {
  isSummary: false,
  unit: {},
  units: {},
  backdrop: true,
};

export default withStyles(styles)(Perentages);

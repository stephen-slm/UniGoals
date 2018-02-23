import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import _ from 'lodash';

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
  /**
   * Gets the average grade from the unit content, e.g the section of the unit
   * @param data [["name", "weighting", "grade"]]
   * @returns {number} The average grade
   */
  static calculateAverageGradePercent(data) {
    if (_.size(data) === 0) {
      return {
        average: 0,
        max: 0,
      };
    } else if (_.size(data[Object.keys(data)[0]]) === 0) {
      return {
        average: 0,
        max: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (content) => {
      if (parseFloat(content.achieved) > 0) {
        total += parseFloat(content.achieved);
        maxTotalPossible += parseFloat(content.weighting) * parseFloat(content.achieved);
      } else {
        maxTotalPossible += 100 * parseFloat(content.weighting);
      }
    });

    // Using _size to get the size of the object, this is because we are using objects not arrays
    let average = parseFloat(total / _.size(data)).toFixed(2);
    let max = parseFloat(maxTotalPossible / 100).toFixed(2);

    if (_.isNaN(Number(average))) average = '0.00';
    if (_.isNaN(Number(max))) max = '0.00';

    return {
      average: average < 0 ? 0 : average,
      max: max < 0 ? 0 : max,
    };
  }

  /**
   * Gets the average of all the active units for the user
   * @param {object} data All the units for the user
   */
  static calculateAverageGradePercentSummary(data) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return {
        average: 0,
        max: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (unit) => {
      let tableTotal = 0;
      let tableMax = 0;

      if (_.size(unit.content) > 0) {
        _.forEach(unit.content, (content) => {
          if (parseFloat(content.achieved) > 0) {
            tableTotal += parseFloat(content.achieved);
            tableMax += parseFloat(content.achieved);
          } else {
            tableMax += 100;
          }
        });

        total += tableTotal / _.size(unit.content);
        maxTotalPossible += tableMax / _.size(unit.content);
      }
    });

    let average = parseFloat(total / _.size(data)).toFixed(2);
    let max = parseFloat(maxTotalPossible / _.size(data)).toFixed(2);

    if (_.isNaN(Number(average))) average = '0.00';
    if (_.isNaN(Number(max))) max = '0.00';

    return {
      average: average < 0 ? 0 : average,
      max: max < 0 ? 0 : max,
    };
  }

  /**
   * Calulates the users unit overal grade.
   * @param {object} data user units
   */
  static calulateTotalGradeSummary(data) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return 0;
    }

    let totalAchieved = 0;

    _.forEach(data, (unit) => {
      _.forEach(unit.content, (unitContent) => {
        if (
          !_.isNil(unitContent.weighting) &&
          !_.isNil(unitContent.achieved) &&
          (unitContent.weighting !== '' && unitContent.achieved !== '')
        ) {
          if (parseFloat(unitContent.achieved) > 0) {
            totalAchieved += parseFloat(unitContent.weighting) * parseFloat(unitContent.achieved);
          }
        }
      });
    });

    return parseFloat(totalAchieved / 100 / _.size(data)).toFixed(2);
  }

  static calculateTotalGradeStandard(unit) {
    let achieved = 0;

    _.forEach(unit, (row) => {
      if (parseFloat(row.achieved) > 0 && parseFloat(row.weighting) > 0) {
        achieved += parseFloat(row.weighting) * parseFloat(row.achieved);
      }
    });

    return parseFloat(achieved / 100).toFixed(2);
  }

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { classes } = this.props;
    let percentages;
    let total = 0;

    if (this.props.isSummary) {
      percentages = Perentages.calculateAverageGradePercentSummary(this.props.units);
      total = Perentages.calulateTotalGradeSummary(this.props.units);
    } else {
      percentages = Perentages.calculateAverageGradePercent(this.props.unit.content);
      total = Perentages.calculateTotalGradeStandard(this.props.unit.content);
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
                <Grid item>Average: {_.defaultTo(percentages.average, 0)}%</Grid>
                <Grid item>Max: {_.defaultTo(percentages.max, 100)}%</Grid>
                <Grid item>Total: {total}%</Grid>
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

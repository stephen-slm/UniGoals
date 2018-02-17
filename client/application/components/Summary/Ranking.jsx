import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import _ from 'lodash';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit,
  },
  entry: {
    marginTop: theme.spacing.unit,
  },
  link: {
    textDecoration: 'none',
  },
  wrapper: {
    paddingRight: theme.spacing.unit * 5,
    textAlign: 'left',
  },
});

class Ranking extends React.Component {
  /**
   * Applying the weighiting to all the units, getting the overal unit total and ordering
   * the content based on this information with title, total and a link based on the
   * current active address, this link being a hash link to the table contntes.
   *
   * Finally at the end this is reveresed as the lodash sortBy orders them based on
   * lowest to highest and we need the vice vera.
   * @param {object} data the unit data
   * @param {object} history react-router history object
   */
  static calulateTopFive(data, history) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return 0;
    }

    const listOfTotalGrades = [];

    _.forEach(data, (unit, index) => {
      let totalAchieved = 0;

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

      listOfTotalGrades.push({
        title: unit.title,
        total: parseFloat(totalAchieved / 100).toFixed(2),
        link: `${history.location.search}#${index}`,
      });
    });

    return _.reverse(_.sortBy(listOfTotalGrades, (o) => o.total));
  }

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const ranking = Ranking.calulateTopFive(this.props.units, this.props.history);

    return (
      <Paper style={{ height: this.props.height * 40 }} className={classes.root} elevation={1}>
        <Typography className={classes.title} component="p">
          Unit Ranking
        </Typography>
        <Typography className={classes.wrapper} component="div">
          {ranking.map((rank, index) => (
            <Typography key={rank.title} className={classes.entry} component="span">
              <Typography className={classes.link} href={String(rank.link)} component="a">
                {index + 1}. {rank.title}
              </Typography>
            </Typography>
          ))}
        </Typography>
      </Paper>
    );
  }
}

Ranking.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}).isRequired,
  height: PropTypes.number.isRequired,
};

export default withStyles(styles)(Ranking);

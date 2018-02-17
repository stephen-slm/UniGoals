import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import _ from 'lodash';
import Ranking from './Ranking';
import Percentages from './Percentages';

const styles = (theme) => ({
  root: {
    margin: '25px auto',
    maxWidth: '80%',
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  addButton: {
    float: 'left',
    cursor: 'pointer',
    marginLeft: theme.spacing.unit,
  },
  removeButton: {
    float: 'right',
    cursor: 'pointer',
    marginRight: theme.spacing.unit,
  },
  grid: {
    flexGrow: 1,
  },
  paper: {
    // height: 140,
    // width: 100,
  },
});

class Summary extends React.Component {
  constructor() {
    super();

    this.state = {
      currentWeek: 0,
      isSummary: true,
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Icon
          style={{ display: this.props.isExample ? 'none' : undefined }}
          onClick={() => console.log('clicked add')}
          className={classes.addButton}
          color="primary"
        >
          add_circle
        </Icon>
        <Icon
          style={{ display: this.props.isExample ? 'none' : undefined }}
          onClick={() => console.log('clicked remove')}
          className={classes.removeButton}
          color="secondary"
        >
          delete
        </Icon>
        <Typography variant="headline" component="h5">
          Summary
        </Typography>
        <Typography component="p">
          {this.props.profile.course_name} - {this.props.profile.name} - Year:{' '}
          {this.props.profile.course_year}, week: {this.state.currentWeek}
        </Typography>
        <Typography component="p">{this.props.yearTitle}</Typography>

        {/* The heights here need to be calculated based on the num of units up to 5 */}
        <Grid container className={classes.grid}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={Number(8)}>
              <Grid item>
                <Ranking
                  height={_.size(this.props.units)}
                  history={this.props.history}
                  units={this.props.units}
                />
              </Grid>
              <Grid item>
                <Percentages
                  height={_.size(this.props.units)}
                  units={this.props.units}
                  isSummary={this.state.isSummary}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

Summary.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  yearTitle: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    course_year: PropTypes.string,
    course_name: PropTypes.string,
  }).isRequired,
  isExample: PropTypes.bool,
};

Summary.defaultProps = {
  isExample: false,
};

export default withStyles(styles)(Summary);

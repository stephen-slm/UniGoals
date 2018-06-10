import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import Settings from './Settings';
import Percentages from './Percentages';
import Ranking from './Ranking';

import firebase from '../../utils/FirebaseWrapper';

const styles = (theme) => ({
  root: {
    margin: '25px auto',
    maxWidth: '60%',
    minWidth: '324px',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      maxWidth: '70%',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
  },
  leftText: {
    paddingLeft: theme.spacing.unit,
  },
  addButton: {
    float: 'left',
    cursor: 'pointer',
    marginLeft: theme.spacing.unit,
  },
  removeButton: {
    // float: 'right',
    cursor: 'pointer',
    marginRight: theme.spacing.unit,
  },
  grid: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '95%',
    },
  },
  summarySubtext: {
    textAlign: 'center',
  },
  verticalDivider: {
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    height: '100%',
    display: 'flex',
  },
  dividerSides: {
    margin: '0 auto',
  },
  dividerSidesContainer: {
    height: '100%',
  },
});

class Summary extends React.Component {
  /**
   * Gets the current year week for University, based on the starting week of week 38 of
   * the university.
   */
  static getCurrentYearWeek() {
    const startingWeek = 40; // September
    const endWeek = 22;

    const currentDate = new Date();
    let week = currentDate - new Date(currentDate.getFullYear(), 0, 1);
    week /= 86400000;
    week += new Date(currentDate.getFullYear(), 0, 1).getDay() + 1;
    week = Math.ceil(week / 7);

    if (week < startingWeek && week > endWeek) {
      return 'Summer Time!';
    } else if (week <= 54 && week >= startingWeek) {
      return `${week - startingWeek}/34`;
    } else if (week >= 1) {
      const returnTime = 52 - startingWeek;
      return `${returnTime + week}/34`;
    }

    return `${week}/34`;
  }

  constructor(props) {
    super();

    this.state = {
      currentWeek: Summary.getCurrentYearWeek(),
      isSummary: true,
      yearTitle: props.yearTitle,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.yearTitle !== nextProps.yearTitle) {
      this.setState({ yearTitle: nextProps.yearTitle });
    }
  }

  updateYearTitleDatabase = (newTitle) => {
    let title = newTitle;

    // If the user exists whiel the text is empty, fill with replacement text
    if (title === '') title = 'Uni 👨‍🎓 👩‍🎓';

    firebase.updateYearTitle(this.props.yearIndex, title);
    this.props.updateYearTitle(this.props.yearIndex, title);
    this.setState({ yearTitle: title });
  };

  // Deletes the current active year from firebae and redux
  deleteSelectedYear = () => {
    firebase
      .deleteYear(this.props.yearIndex)
      .then(() => this.props.removeYear(this.props.yearIndex))
      .catch((error) => console.log(error.message));

    this.props.history.push('/');
  };

  /**
   * updates the title for the selected/active year in the state
   * @param {string} title the new title for the year in the state
   */
  updateYearTitle = (title) => {
    this.setState({
      yearTitle: title,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={3}>
        <SnackbarWrapper message={this.state.message} />
        <Grid container className={classes.flexGrow}>
          <Grid container alignItems="center" direction="row" justify="space-between">
            <Grid item>
              <Grid container>
                <Grid container alignItems="flex-start" direction="column" justify="flex-start" className={classes.leftText}>
                  <Grid item>
                    <Typography component="span" variant="subheading" style={{ color: 'rgba(0,0,0,0.87)', display: 'inline-block' }}>
                      Summary -
                    </Typography>{' '}
                    <Typography component="span" variant="caption" style={{ color: 'rgba(0,0,0,0.87)', display: 'inline-block' }}>
                      {this.state.yearTitle}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption">
                      {this.props.profile.course_name} - Year: {this.props.profile.course_year}, week: {this.state.currentWeek}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Settings
                year={{
                  title: this.props.yearTitle,
                  units: this.props.units,
                }}
                deleteYear={this.props.isExample ? () => undefined : this.deleteSelectedYear}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid container justify="center" spacing={Number(16)}>
          <Grid item>
            <Ranking height={_.size(this.props.units)} history={this.props.history} units={this.props.units} />
          </Grid>
          <Grid item>
            <Percentages height={_.size(this.props.units)} units={this.props.units} isSummary={this.state.isSummary} />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

Summary.propTypes = {
  yearIndex: PropTypes.string.isRequired,
  updateYearTitle: PropTypes.func.isRequired,
  removeYear: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
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
  units: {},
};

export default withStyles(styles)(Summary);

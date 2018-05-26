import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import Settings from './Settings';
import EditableText from '../Utilities/EditableText';
import Percentages from './Percentages';
import Ranking from './Ranking';

import * as constants from '../../utils/constants';
import firebase from '../../utils/FirebaseWrapper';

const styles = (theme) => ({
  root: {
    margin: '25px auto',
    maxWidth: '80%',
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
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
      return week - startingWeek;
    } else if (week >= 1) {
      const returnTime = 52 - startingWeek;
      return returnTime + week;
    }

    return week;
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
        <div>
          <Grid container justify="center" alignItems="center" className={classes.grid}>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant="headline" component="h5">
                Summary
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Settings
                year={{
                  title: this.props.yearTitle,
                  units: this.props.units,
                }}
                deleteYear={this.props.isExample ? () => undefined : this.deleteSelectedYear}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.grid}>
            <Grid item xs={12}>
              <div className={classes.summarySubtext}>
                <Typography component="p">
                  {this.props.profile.course_name} - Year: {this.props.profile.course_year}, week: {this.state.currentWeek}/34
                </Typography>
                <EditableText
                  placeholder="Year"
                  maxLength={constants.YEAR.TITLE.MAX}
                  onChange={this.updateYearTitle}
                  onConfirm={this.updateYearTitleDatabase}
                  value={this.state.yearTitle}
                />
              </div>
            </Grid>
            <Grid container justify="center" spacing={Number(16)}>
              <Grid item>
                <Ranking height={_.size(this.props.units)} history={this.props.history} units={this.props.units} />
              </Grid>
              <Grid item>
                <Percentages height={_.size(this.props.units)} units={this.props.units} isSummary={this.state.isSummary} />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

Summary.propTypes = {
  yearIndex: PropTypes.string.isRequired,
  updateYearTitle: PropTypes.func.isRequired,
  removeYear: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}).isRequired,
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
};

export default withStyles(styles)(Summary);

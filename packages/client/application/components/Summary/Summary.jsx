import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import EditableText from '../Utilities/EditableText';
import DeleteModule from '../Utilities/DeleteModule';
import Percentages from './Percentages';
import Ranking from './Ranking';

import * as constants from '../../utils/constants';

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
    float: 'right',
    cursor: 'pointer',
    marginRight: theme.spacing.unit,
  },
  grid: {
    flexGrow: 1,
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
    const currentYear = new Date(new Date().getFullYear(), 0, 1);

    let week = (currentDate - currentYear) / 84600000;
    week += currentYear.getDay() + 1;
    week = Math.ceil(week / 7);

    if (week < startingWeek && week > endWeek) {
      return 'Summer Time!';
    } else if (week <= 54 && week >= startingWeek) {
      return week - startingWeek;
    } else if (week >= 1) {
      return 52 - (startingWeek + week);
    }

    return week;
  }

  constructor(props) {
    super();

    this.updateYearTitleDatabase = this.updateYearTitleDatabase.bind(this);
    this.deleteSelectedYear = this.deleteSelectedYear.bind(this);
    this.updateYearTitle = this.updateYearTitle.bind(this);
    this.showDeleteYear = this.showDeleteYear.bind(this);

    this.state = {
      isDeletingYear: false,
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

  updateYearTitleDatabase(newTitle) {
    let title = newTitle;

    // If the user exists whiel the text is empty, fill with replacement text
    if (title === '') title = 'Uni 👨‍🎓 👩‍🎓';

    this.props.firebase.updateYearTitle(this.props.yearIndex, title);
    this.props.updateYearTitle(this.props.yearIndex, title);
    this.setState({ yearTitle: title });
  }

  // Deletes the current active year from firebae and redux
  deleteSelectedYear() {
    this.props.firebase
      .deleteYear(this.props.yearIndex)
      .then(() => this.props.removeYear(this.props.yearIndex))
      .catch((error) => console.log(error.message));

    this.showDeleteYear();

    this.props.history.push('/');
  }

  /**
   * updates the title for the selected/active year in the state
   * @param {string} title the new title for the year in the state
   */
  updateYearTitle(title) {
    this.setState({
      yearTitle: title,
    });
  }

  // Shows the delete year dialog
  showDeleteYear() {
    this.setState({ isDeletingYear: !this.state.isDeletingYear });
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={3}>
        <DeleteModule
          open={this.state.isDeletingYear}
          title={this.props.yearTitle}
          onDelete={this.deleteSelectedYear}
          onClose={this.showDeleteYear}
        />
        <Tooltip title="Delete Year" placement="left">
          <Icon onClick={this.showDeleteYear} className={classes.removeButton} color="secondary">
            delete
          </Icon>
        </Tooltip>
        <Typography variant="headline" component="h5">
          Summary
        </Typography>

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

        {/* The heights here need to be calculated based on the num of units up to 5 */}
        <Grid container className={classes.grid}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={Number(8)}>
              <Grid item>
                <Ranking height={_.size(this.props.units)} history={this.props.history} units={this.props.units} />
              </Grid>
              <Grid item>
                <Percentages height={_.size(this.props.units)} units={this.props.units} isSummary={this.state.isSummary} />
              </Grid>
            </Grid>
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
  units: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  yearTitle: PropTypes.string.isRequired,
  firebase: PropTypes.shape({
    deleteYear: PropTypes.func,
    insertNewYear: PropTypes.func,
    updateYearTitle: PropTypes.func,
  }).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    course_year: PropTypes.string,
    course_name: PropTypes.string,
  }).isRequired,
};

Summary.defaultProps = {};

export default withStyles(styles)(Summary);

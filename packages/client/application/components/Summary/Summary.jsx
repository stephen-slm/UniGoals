import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';

import _ from 'lodash';
import Ranking from './Ranking';
import Percentages from './Percentages';
import EditableText from '../Utilities/EditableText';
import DeleteModule from '../Utilities/DeleteModule';

import * as constants from '../../utils/constants';

const styles = theme => ({
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
});

class Summary extends React.Component {
  /**
   * Gets the current year week for University, based on the starting week of week 38 of
   * the university.
   */
  static getCurrentYearWeek() {
    return new Date().getDay();
  }

  constructor(props) {
    super();

    this.updateYearTitle = this.updateYearTitle.bind(this);
    this.updateYearTitleDatabase = this.updateYearTitleDatabase.bind(this);
    this.showDeleteYear = this.showDeleteYear.bind(this);
    this.deleteSelectedYear = this.deleteSelectedYear.bind(this);
    this.insertNewYear = this.insertNewYear.bind(this);

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
    if (this.props.isExample) return;
    let title = newTitle;

    // If the user exists whiel the text is empty, fill with replacement text
    if (title === '') title = 'Uni 👨‍🎓 👩‍🎓';

    this.props.firebase.updateYearTitle(this.props.yearIndex, title);
    this.props.updateYearTitle(this.props.yearIndex, title);
    this.setState({ yearTitle: title });
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
    if (this.props.isExample) return;

    this.setState({ isDeletingYear: !this.state.isDeletingYear });
  }

  insertNewYear() {
    if (this.props.isExample) return;

    this.props.firebase
      .insertNewYear()
      .then(year => this.props.insertNewYear(year.yearKey, year.title, year.unitKey))
      .catch(error => console.log(error.message));
  }

  // Deletes the current active year from firebae and redux
  deleteSelectedYear() {
    if (this.props.isExample) return;

    this.props.firebase
      .deleteYear(this.props.yearIndex)
      .then(() => this.props.removeYear(this.props.yearIndex))
      .catch(error => console.log(error.message));

    this.showDeleteYear();
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={3}>
        <DeleteModule
          disabled={this.props.isExample}
          open={this.state.isDeletingYear}
          title={this.props.yearTitle}
          onDelete={this.deleteSelectedYear}
          onClose={this.showDeleteYear}
        />
        <Tooltip title="Create Year" placement="right">
          <IconButton
            style={{ display: this.props.isExample ? 'none' : undefined }}
            onClick={this.insertNewYear}
            className={classes.addButton}
          >
            <Icon color="primary">add</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Year" placement="left">
          <Icon
            style={{ display: this.props.isExample ? 'none' : undefined }}
            onClick={this.showDeleteYear}
            className={classes.removeButton}
            color="secondary"
          >
            delete
          </Icon>
        </Tooltip>
        <Typography variant="headline" component="h5">
          Summary
        </Typography>
        <Typography component="p">
          {this.props.profile.course_name} - {this.props.profile.name} - Year:{' '}
          {this.props.profile.course_year}, week: {this.state.currentWeek}
        </Typography>
        <EditableText
          placeholder="Year"
          maxLength={constants.YEAR.TITLE.MAX}
          onChange={this.updateYearTitle}
          onConfirm={this.updateYearTitleDatabase}
          value={this.state.yearTitle}
        />
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
  yearIndex: PropTypes.string,
  removeYear: PropTypes.func,
  insertNewYear: PropTypes.func,
  updateYearTitle: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired,
  yearTitle: PropTypes.string,
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
  isExample: PropTypes.bool,
};

Summary.defaultProps = {
  yearIndex: 0,
  isExample: false,
  yearTitle: 'Year',
  units: null,
  removeYear: () => null,
  insertNewYear: () => null,
};

export default withStyles(styles)(Summary);

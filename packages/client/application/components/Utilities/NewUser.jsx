import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const styles = (theme) => ({
  root: {},
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

class NewUser extends React.Component {
  constructor(props) {
    super(props);

    this.addUniversityDetails = this.addUniversityDetails.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleValueChangeYear = this.handleValueChangeYear.bind(this);
    this.handleValueChangeUni = this.handleValueChangeUni.bind(this);

    this.state = {
      year: this.props.profile.course_year || '',
      course: this.props.profile.course_name || '',
      university: this.props.profile.course_university || '',

      universityContent: {
        courses: [],
        years: [],
        uk: [],
      },

      invalidCourseName: false,
      invalidCourseYear: false,
      invalidCourseUni: false,
    };
  }

  componentDidMount() {
    this.getUniversityContent();
  }

  /**
   * Gets all the university content if the content is already empty in the state.
   */
  getUniversityContent() {
    if (_.isNil(this.state.universityContent.courses[0])) {
      this.props.firebase
        .getUniversityContents()
        .then((content) => this.setState({ universityContent: content }));
    }
  }

  handleValueChange(course) {
    this.setState({
      course: course.target.value,
    });
  }

  handleValueChangeYear(year) {
    this.setState({
      year: year.target.value,
    });
  }

  handleValueChangeUni(university) {
    this.setState({
      university: university.target.value,
    });
  }

  /**
   * When a user is first created, they are asked for there courseName and there courseYear
   * this will be asked every time until a valid courseName is passed, this will validate
   * if the course name is valid or not. (the database will also validate it) so if it
   * some how turns out to be invalid the user will have to reenter it when they login
   * again.
   */
  addUniversityDetails() {
    const courseName = this.state.course;
    const courseYear = this.state.year;
    const courseUniversity = this.state.university;
    const courseYearNum = parseInt(this.universityYear, 10);

    let invalidCourseName = false;
    let invalidCourseYear = false;
    let invalidCourseUni = false;

    if (
      _.isNil(courseYear) ||
      _.isNaN(courseYear) ||
      !_.isNumber(courseYearNum) ||
      courseYear.length > 2 ||
      courseYear === ''
    ) {
      invalidCourseYear = true;
    }

    if (
      _.isNil(courseName) ||
      _.isNaN(courseName) ||
      courseName.length < 5 ||
      courseName.length > 50 ||
      courseName === ''
    ) {
      invalidCourseName = true;
    }

    if (
      _.isNil(courseUniversity) ||
      _.isNaN(courseUniversity) ||
      courseUniversity.length < 5 ||
      courseUniversity.length > 50 ||
      courseUniversity === ''
    ) {
      invalidCourseUni = true;
    }

    if (invalidCourseUni || invalidCourseName || invalidCourseYear) {
      return this.setState({
        invalidCourseName,
        invalidCourseYear,
        invalidCourseUni,
      });
    }

    return this.props.firebase
      .addUniversityDetails(courseName, courseYear, courseUniversity)
      .then(() => {
        const profile = Object.assign(this.props.profile, {
          course_name: courseName,
          course_year: courseYear,
          course_university: courseUniversity,
          new: false,
        });

        this.props.updateProfile(profile);
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { classes, profile } = this.props;
    let isOpen = false;

    if (!profile.course_name || !profile.course_year || profile.new || !profile.course_university) {
      isOpen = true;
    }

    return (
      <Dialog
        open={isOpen}
        transition={Transition}
        onClose={this.addUniversityDetails}
        aria-labelledby="Creation Box"
        aria-describedby="Box for creating new users"
      >
        <DialogTitle>{`Welcome ${profile.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you for using UniGoals-alpha! If you have any problems please email:
            UP840877@myport.ac.uk or click the little help box in the top right hand corner!
            <strong> This box will only ever show once!</strong>
            <br />
            <br />
            For the time being please may you update the content below.
            <br />
            <br />
            Thanks,
            <br />
            <br />
            UniGoals
            <br />
            <br />
            Below is some basic information needed to form your profile. Please fill this in and
            select continue.
            <br />
            <br />
          </DialogContentText>
          <FormControl className={classes.formControl} error={this.state.invalidCourseYear}>
            <Select
              value={this.state.year}
              onChange={this.handleValueChangeYear}
              name="Year"
              className={classes.selectEmpty}
            >
              {_.map(this.state.universityContent.years, (year, index) => (
                <MenuItem key={index} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Current Year</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl} error={this.state.invalidCourseName}>
            <Select
              value={this.state.course}
              onChange={this.handleValueChange}
              name="Course"
              className={classes.selectEmpty}
            >
              {_.map(_.sortBy(this.state.universityContent.courses, (o) => o), (course, index) => (
                <MenuItem key={index} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Current Course</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl} error={this.state.invalidCourseUni}>
            <Select
              value={this.state.university}
              onChange={this.handleValueChangeUni}
              name="University"
              className={classes.selectEmpty}
            >
              {_.map(_.sortBy(this.state.universityContent.uk, (o) => o), (university, index) => (
                <MenuItem key={index} value={university}>
                  {university}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Current University</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.addUniversityDetails} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

NewUser.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    getUniversityContents: PropTypes.func,
    addUniversityDetails: PropTypes.func,
  }).isRequired,
  updateProfile: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    course_name: PropTypes.string,
    course_year: PropTypes.string,
    course_university: PropTypes.string,
    new: PropTypes.bool,
  }).isRequired,
};

NewUser.defaultProps = {};

export default withStyles(styles)(NewUser);

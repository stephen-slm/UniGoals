import FormHelperText from '@material-ui/core/FormHelperText';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import StepContent from '@material-ui/core/StepContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import StepLabel from '@material-ui/core/StepLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Stepper from '@material-ui/core/Stepper';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import { withSnackbar } from '../Utilities/SnackbarWrapper';
import firebase from '../../utils/FirebaseWrapper';

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
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['Welcome to UniGoals', 'Year selection', 'Course selection', 'University Selection'];
}

class NewUser extends React.Component {
  constructor(props) {
    super();

    this.state = {
      activeStep: 0,
      year: props.profile.course_year || '',
      course: props.profile.course_name || '',
      university: props.profile.course_university || '',

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

  componentDidMount = () => {
    this.getUniversityContent();
  };

  getStepContent = (step, classes) => {
    switch (step) {
      case 0:
        return (
          <Typography>
            Thank you for using UniGoals-alpha! If you have any problems please email: UP840877@myport.ac.uk or click the Send Feedback
            button from the menu.
          </Typography>
        );
      case 1:
        return (
          <div>
            <FormControl className={classes.formControl} error={this.state.invalidCourseYear}>
              <Typography>Please select your current year</Typography>
              <Select value={this.state.year} onChange={this.handleValueChangeYear} name="Year" className={classes.selectEmpty}>
                {_.map(this.state.universityContent.years, (year, index) => (
                  <MenuItem key={index} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Current Year</FormHelperText>
            </FormControl>
          </div>
        );
      case 2:
        return (
          <FormControl className={classes.formControl} error={this.state.invalidCourseName}>
            <Typography>Please select your current course</Typography>
            <Select value={this.state.course} onChange={this.handleValueChange} name="Course" className={classes.selectEmpty}>
              {_.map(_.sortBy(this.state.universityContent.courses, (o) => o), (course, index) => (
                <MenuItem key={index} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Current Course</FormHelperText>
          </FormControl>
        );
      case 3:
        return (
          <FormControl className={classes.formControl} error={this.state.invalidCourseUni}>
            <Typography>Please select your current university</Typography>
            <Select value={this.state.university} onChange={this.handleValueChangeUni} name="University" className={classes.selectEmpty}>
              {_.map(_.sortBy(this.state.universityContent.uk, (o) => o), (university, index) => (
                <MenuItem key={index} value={university}>
                  {university}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Current University</FormHelperText>
          </FormControl>
        );
      default:
        return 'Unknown step';
    }
  };

  getUniversityContent = () => {
    if (_.isNil(this.state.universityContent.courses[0])) {
      firebase.getUniversityContents().then((content) => this.setState({ universityContent: content }));
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleValueChange = (course) => {
    this.setState({
      course: course.target.value,
    });
  };

  handleValueChangeYear = (year) => {
    this.setState({
      year: year.target.value,
    });
  };

  handleValueChangeUni = (university) => {
    this.setState({
      university: university.target.value,
    });
  };

  completeSetup = () => {
    const courseName = this.state.course;
    const courseYear = this.state.year;
    const courseUniversity = this.state.university;

    return firebase
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
      .catch((error) => this.props.snackbar.showMessage(error.message));
  };

  handleNext = () => {
    const courseName = this.state.course;
    const courseYear = this.state.year;
    const courseUniversity = this.state.university;
    const courseYearNum = parseInt(this.universityYear, 10);

    let invalidCourseName = false;
    let invalidCourseYear = false;
    let invalidCourseUni = false;
    let shouldContinue = true;

    if (this.state.activeStep === 1) {
      if (_.isNil(courseYear) || _.isNaN(courseYear) || !_.isNumber(courseYearNum) || courseYear.length > 2 || courseYear === '') {
        invalidCourseYear = true;
        shouldContinue = false;
      }
    }

    if (this.state.activeStep === 2) {
      if (_.isNil(courseName) || _.isNaN(courseName) || courseName.length < 5 || courseName.length > 50 || courseName === '') {
        invalidCourseName = true;
        shouldContinue = false;
      }
    }

    if (this.state.activeStep === 3) {
      if (
        _.isNil(courseUniversity) ||
        _.isNaN(courseUniversity) ||
        courseUniversity.length < 5 ||
        courseUniversity.length > 50 ||
        courseUniversity === ''
      ) {
        invalidCourseUni = true;
        shouldContinue = false;
      }
    }

    if (invalidCourseUni || invalidCourseName || invalidCourseYear || !shouldContinue) {
      return this.setState({
        invalidCourseName,
        invalidCourseYear,
        invalidCourseUni,
      });
    }

    return this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };
  render() {
    const { classes, profile } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    let isOpen = false;

    if (!profile.course_name || !profile.course_year || profile.new || !profile.course_university) {
      isOpen = true;
    }

    return (
      <Dialog open={isOpen} TransitionComponent={Transition} onClose={this.addUniversityDetails}>
        <DialogTitle>{`Welcome ${profile.name}`}</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <div>{this.getStepContent(index, classes)}</div>
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                          Back
                        </Button>
                        <Button variant="raised" color="primary" onClick={this.handleNext} className={classes.button}>
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>All steps completed - you&quot;re now ready to use UniGoals</Typography>
                <Button onClick={this.handleReset} className={classes.button}>
                  Reset
                </Button>
                <Button onClick={this.completeSetup} className={classes.button}>
                  Continue
                </Button>
              </Paper>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

NewUser.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  updateProfile: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    course_name: PropTypes.string,
    course_year: PropTypes.string,
    course_university: PropTypes.string,
    new: PropTypes.bool,
  }).isRequired,
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }).isRequired,
};

NewUser.defaultProps = {};

export default withStyles(styles)(withSnackbar()(NewUser));

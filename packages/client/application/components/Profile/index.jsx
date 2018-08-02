import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Delete from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Save from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import React from 'react';

import { withSnackbar } from '../Utilities/SnackbarWrapper';
import ModuleWrapper from '../Utilities/ModuleWrapper';
import EditableText from '../Utilities/EditableText';
import firebase from '../../utils/FirebaseWrapper';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: '75%',
    margin: '0 auto',
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
  profileGrid: {
    maxWidth: '300px',
    margin: `${theme.spacing.unit * 2}px auto`,
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
  loadingBar: {
    margin: `-${theme.spacing.unit * 2}px -${theme.spacing.unit * 2}px ${theme.spacing.unit * 2.5}px -${theme.spacing.unit * 2}px`,
    padding: 0,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: `${theme.spacing.unit * 2}px auto`,
    maxWidth: '600px',
    minWidth: '200px',
  },
  formContainer: {},
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  titleText: {
    fontWeight: 'bold',
  },
  phoneText: {
    textDecoration: 'none',
    color: 'black',
  },
  avatar: {
    margin: '0 auto',
    textAlign: 'center',
    width: theme.spacing.unit * 10,
    height: theme.spacing.unit * 10,
  },

  button: {
    margin: theme.spacing.unit,
  },
  iconSmall: {
    marginRight: theme.spacing.unit,
    fontSize: 20,
  },
});

class Profile extends React.Component {
  state = {
    profile: this.props.profile,
    showDeletingAccount: false,
    isDeleting: false,
  };

  updateUniversityNameFirebase = (name) => {
    const { profile } = this.state;
    profile.course_university = name;

    this.props.updateProfile(profile);
    this.updateFirebaseProfile(profile);
  };

  updateFirebaseProfile(profile) {
    firebase
      .updateProfile(profile)
      .then(() => this.props.snackbar.showMessage('Saved profile changes'))
      .catch((error) => this.props.snackbar.showMessage(error.message));
  }

  updateUniversityName = (name) => {
    const { profile } = this.state;
    profile.course_university = name;

    this.setState({
      profile,
    });
  };

  updateUniversityCourseFirebase = (course) => {
    const { profile } = this.state;
    profile.course_name = course;

    this.props.updateProfile(profile);
    this.updateFirebaseProfile(profile);
  };

  updateUniversityCourse = (course) => {
    const { profile } = this.state;
    profile.course_name = course;

    this.setState({
      profile,
    });
  };

  handleFormChange = (type, change) => {
    const { profile } = this.state;
    profile[type] = change.target.value;

    this.setState({
      profile,
    });
  };

  handleFormSave = () => {
    // we get the props profile (untouched) so we can keep the email the same
    const { profile } = this.props;

    const updatedProfile = Object.assign(profile, {
      name: this.state.profile.name,
      course_university: this.state.profile.course_university,
      course_name: this.state.profile.course_name,
    });

    this.updateFirebaseProfile(updatedProfile);
  };

  showDeleteAccountBox = () => {
    this.setState({
      showDeletingAccount: !this.state.showDeletingAccount,
    });
  };

  deleteAccount = () => {
    this.setState({
      isDeleting: true,
    });

    firebase
      .authenticate()
      .then((login) => firebase.getCurrentUser().reauthenticateAndRetrieveDataWithCredential(login.credential))
      .then(() => firebase.deleteAccount())
      .then(() => {
        this.props.snackbar.showMessage('Deleted account');
        this.props.removeProfile();
        this.props.history.push('/');
        this.props.history.go('/');
        window.location.reload();
      })
      .catch((error) => {
        this.setState({ isDeleting: false });
        this.props.snackbar.showMessage(error.message);
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div>Profile</div>
        <ModuleWrapper
          description={`Are you sure you wish to delete your account ${
            this.props.profile.given_name
          }? This will require you to quickly reauthentcate (desktop only) and cannot be undone  😥`}
          title={`Deleting your UniGoals account ${this.props.profile.given_name}`}
          open={this.state.showDeletingAccount}
          onClose={this.showDeleteAccountBox}
          onComplete={this.deleteAccount}
          completeText="Delete"
        />
        <Paper square elevation={1} className={classes.profileGrid}>
          {this.state.isDeleting && <LinearProgress className={classes.loadingBar} color="secondary" />}
          <div>
            <Avatar alt={this.state.profile.name} src={firebase.getProfileImageUrl()} className={classes.avatar} />
            <Typography variant="headline">{this.state.profile.name}</Typography>
            <div>
              <EditableText
                placeholder="University Name"
                className={classes.phoneText}
                onChange={this.updateUniversityName}
                onConfirm={this.updateUniversityNameFirebase}
                value={this.state.profile.course_university}
              />
            </div>
            <div>
              <EditableText
                placeholder="University Name"
                className={classes.phoneText}
                onChange={this.updateUniversityCourse}
                onConfirm={this.updateUniversityCourseFirebase}
                value={this.state.profile.course_name}
              />
            </div>
            <Typography variant="caption">Login Count: {this.state.profile.login_count}</Typography>
            <Typography variant="caption">Year: {this.state.profile.course_year}</Typography>
          </div>
        </Paper>

        <Paper square elevation={1} className={classes.paper}>
          <form className={classes.formContainer} noValidate autoComplete="off">
            <TextField
              id="name"
              label="Name"
              className={classes.textField}
              value={this.state.profile.name}
              margin="normal"
              onChange={(change) => this.handleFormChange('name', change)}
            />
            <TextField
              id="email"
              disabled
              label="Email"
              className={classes.textField}
              value={this.state.profile.email}
              margin="normal"
              onChange={(change) => this.handleFormChange('email', change)}
            />
            <TextField
              id="course_university"
              label="Course University"
              className={classes.textField}
              value={this.state.profile.course_university}
              margin="normal"
              onChange={(change) => this.handleFormChange('course_university', change)}
            />
            <TextField
              id="course_name"
              label="Course Name"
              className={classes.textField}
              value={this.state.profile.course_name}
              margin="normal"
              onChange={(change) => this.handleFormChange('course_name', change)}
            />
          </form>
          <Button className={classes.button} color="primary" variant="flat" size="small" onClick={this.handleFormSave}>
            <Save className={classes.iconSmall} />
            Save
          </Button>
          <Button className={classes.button} color="secondary" variant="flat" size="small" onClick={this.showDeleteAccountBox}>
            <Delete className={classes.iconSmall} />
            Delete Account
          </Button>
        </Paper>
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.shape().isRequired,
  updateProfile: PropTypes.func.isRequired,
  removeProfile: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    go: PropTypes.func,
  }).isRequired,
  profile: PropTypes.shape({
    course_name: PropTypes.string,
    course_university: PropTypes.string,
    course_year: PropTypes.string,
    email: PropTypes.string,
    family_name: PropTypes.string,
    given_name: PropTypes.string,
    hd: PropTypes.string,
    last_login: PropTypes.number,
    login_count: PropTypes.number,
    name: PropTypes.string,
    picture: PropTypes.string,
  }).isRequired,
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }).isRequired,
};

export default withRouter(withStyles(styles)(withSnackbar()(Profile)));

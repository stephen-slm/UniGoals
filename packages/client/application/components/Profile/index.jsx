/*
 * @File application\components\Profile\index.jsx
 * @Version 0.0.1
 */
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Save from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import React from 'react';

import EditableText from '../Utilities/EditableText';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: '75%',
    margin: '0 auto',
    textAlign: 'center',
  },
  profileGrid: {
    maxWidth: '300px',
    margin: `${theme.spacing.unit * 2}px auto`,
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
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
  };

  updateUniversityNameFirebase = (name) => {
    const { profile } = this.state;
    profile.course_university = name;

    this.props.updateProfile(profile);
    this.updateFirebaseProfile(profile);
  };

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

  updateFirebaseProfile(profile) {
    this.props.firebase
      .updateProfile(profile)
      .then(() => console.log('saved changes'))
      .catch((error) => console.log(error));
  }

  render() {
    const { classes, firebase } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.profileGrid}>
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
        <Paper className={classes.paper}>
          <form className={classes.formContainer} noValidate autoComplete="off">
            <TextField
              id="name"
              label="name"
              className={classes.textField}
              value={this.state.profile.name}
              margin="normal"
              onChange={(change) => this.handleFormChange('name', change)}
            />
            <TextField
              id="email"
              disabled
              label="email"
              className={classes.textField}
              value={this.state.profile.email}
              margin="normal"
              onChange={(change) => this.handleFormChange('email', change)}
            />
            <TextField
              id="course_university"
              label="course_university"
              className={classes.textField}
              value={this.state.profile.course_university}
              margin="normal"
              onChange={(change) => this.handleFormChange('course_university', change)}
            />
            <TextField
              id="course_name"
              label="course_name"
              className={classes.textField}
              value={this.state.profile.course_name}
              margin="normal"
              onChange={(change) => this.handleFormChange('course_name', change)}
            />
          </form>
          <Button className={classes.button} color="primary" variant="raised" size="small" onClick={this.handleFormSave}>
            <Save className={classes.iconSmall} />
            Save
          </Button>
        </Paper>
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.shape().isRequired,
  updateProfile: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    getProfileImageUrl: PropTypes.func,
    updateProfile: PropTypes.func,
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
};

export default withStyles(styles)(Profile);

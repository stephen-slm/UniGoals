import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import EditableText from '../Utilities/EditableText';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: '75%',
    margin: '0 auto',
  },
  displayName: {},
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  titleText: {
    fontWeight: 'bold',
  },
  phoneText: {
    textDecoration: 'none',
    color: 'black',
  },
  profileCentre: {
    margin: ' auto',
    textAlign: 'center',
  },
  avatar: {
    margin: '0 auto',
    marginTop: theme.spacing.unit * 5,
    textAlign: 'center',
    width: theme.spacing.unit * 15,
    height: theme.spacing.unit * 15,
  },
});

class Settings extends React.Component {
  state = {};

  render() {
    const { classes, profile, firebase } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.root}>
          <div className={classes.profileCentre}>
            <Avatar alt={profile.name} src={firebase.getProfileImageUrl()} className={classes.avatar} />
            <Typography variant="headline">{profile.name}</Typography>
            <EditableText
              placeholder="University Name"
              className={classes.phoneText}
              onChange={() => {}}
              onConfirm={() => {}}
              value={profile.course_university}
            />
            <Grid container spacing={24}>
              <Grid item xs>
                <Paper className={classes.paper}>Years Related</Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}>General Information</Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}>Unit Related</Paper>
              </Grid>
            </Grid>
          </div>
        </div>
        <div>course_name: {profile.course_name}</div>
        <div>course_year: {profile.course_year}</div>
        <div>email: {profile.email}</div>
        <div>family_name: {profile.family_name}</div>
        <div>given_name: {profile.given_name}</div>
        <div>hd: {profile.hd}</div>
        <div>last_login: {profile.last_login}</div>
        <div>last_login: {new Date(profile.last_login).toUTCString()}</div>
        <div>login_count: {profile.login_count}</div>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.shape().isRequired,
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

export default withStyles(styles)(Settings);

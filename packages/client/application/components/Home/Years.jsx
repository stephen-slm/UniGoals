import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import YearsPreview from '../YearsPreview';
import NewUser from '../NewUser';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    maxWidth: '80%',
    margin: '0 auto',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%',
      '@media screen and (orientation:landscape)': {
        marginBottom: '90px',
      },
    },
  },

  topText: {
    textAlign: 'center',
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit,
  },
});

const Years = (props) => {
  const { classes } = props;

  return (
    <div>
      <div className={classes.topText}>Home</div>
      <NewUser profile={props.profile} updateProfile={props.updateProfile} />
      <div>
        <Grid className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
              <YearsPreview years={props.years} insertNewYear={props.insertNewYear} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Years.propTypes = {
  years: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({}).isRequired,
  updateProfile: PropTypes.func.isRequired,
  insertNewYear: PropTypes.func.isRequired,
};

Years.defaultProps = {};

export default withStyles(styles)(Years);

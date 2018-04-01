import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import _ from 'lodash';

import Grid from 'material-ui/Grid';
import YearPreview from './YearPreview';
import YearPrviewAdd from './YearPreviewAdd';
import NewUser from '../Utilities/NewUser';

import * as constants from '../../utils/constants';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    maxWidth: '80%',
    margin: '0 auto',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%',
    },
  },
});

const Home = props => {
  const { classes } = props;

  return (
    <div>
      <NewUser
        profile={props.profile}
        firebase={props.firebase}
        updateProfile={props.updateProfile}
      />
      <div>
        <Grid className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
              {_.map(props.years, (year, index) => (
                <Grid key={index} item>
                  <YearPreview year={year} index={index} />
                </Grid>
              ))}
              {_.size(props.years) < constants.YEAR.MAX && (
                <Grid key={_.size(props.years) + 1} item>
                  <YearPrviewAdd insertNewYear={props.insertNewYear} firebase={props.firebase} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Home.propTypes = {
  years: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({}).isRequired,
  updateProfile: PropTypes.func.isRequired,
  insertNewYear: PropTypes.func.isRequired,
};

Home.defaultProps = {};

export default withStyles(styles)(Home);

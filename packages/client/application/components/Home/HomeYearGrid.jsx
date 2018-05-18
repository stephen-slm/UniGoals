import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {},
});

const HomeYearGrid = props => {
  const { classes } = props;

  return <div className={classes.root} />;
};

HomeYearGrid.propTypes = { classes: PropTypes.shape({}).isRequired };

export default withStyles(styles)(HomeYearGrid);

import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
});

class Table extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="headline" component="h5">
          Table
        </Typography>
      </Paper>
    );
  }
}

Table.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Table);

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import uuid from 'uuid/v4';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    minHeight: '100px',
  },
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit,
  },
  entry: {
    marginTop: theme.spacing.unit,
  },
  link: {
    textDecoration: 'none',
  },
  wrapper: {
    paddingRight: theme.spacing.unit * 5,
    textAlign: 'left',
  },
});

const Ranking = props => {
  const { classes } = props;
  const ranking = ['']; // calculateTopFiveRankings(props.units, props.history);

  return (
    <Paper style={{ height: props.height * 40 }} className={classes.root} elevation={1}>
      <Typography className={classes.title} component="p">
        Unit Ranking
      </Typography>
      <Typography className={classes.wrapper} component="div">
        {!_.isNil(ranking) &&
          ranking.map((rank, index) => (
            <Typography key={uuid()} className={classes.entry} component="span">
              <Typography className={classes.link} href={String(rank.link)} component="a">
                {index + 1}. {rank.title}
              </Typography>
            </Typography>
          ))}
      </Typography>
    </Paper>
  );
};

Ranking.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}),
  height: PropTypes.number.isRequired,
};

Ranking.defaultProps = {
  units: null,
};

export default withStyles(styles)(Ranking);

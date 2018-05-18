import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import { getAchievedFromUnits } from '../../utils/utils';

const styles = (theme) => ({
  root: {
    height: theme.spacing.unit * 15,
    width: theme.spacing.unit * 18,
  },
  title: {
    fontSize: theme.spacing.unit * 1.8,
  },
});

const YearPreview = (props) => {
  const { classes } = props;

  return (
    <Card className={classes.root}>
      <Link
        href={`/year/${props.index}`}
        to={`/year/${props.index}`}
        style={{ textDecoration: 'none' }}
      >
        <CardHeader
          classes={{
            title: classes.title,
          }}
          title={props.year.title}
          subheader={`units: ${_.size(props.year.units)}`}
        />
        <CardContent>
          <Typography variant="caption">
            Achieved {getAchievedFromUnits(props.year.units).toFixed(2)}%
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

YearPreview.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  year: PropTypes.shape({ title: PropTypes.string, units: PropTypes.shape({}) }).isRequired,
  index: PropTypes.number.isRequired,
};

export default withStyles(styles)(YearPreview);

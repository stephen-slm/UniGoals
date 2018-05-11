import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import _ from 'lodash';

// Navigation
import { Link } from 'react-router-dom';

// Years paper
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

// Total
import { calulateTotalGradeUnits } from '../../utils/utils';

const styles = theme => ({
  root: {
    height: theme.spacing.unit * 15,
    width: theme.spacing.unit * 18,
  },
  title: {
    fontSize: theme.spacing.unit * 1.8,
  },
});

const YearPreview = props => {
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
            Achieved {Number(calulateTotalGradeUnits(props.year.units))}%
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

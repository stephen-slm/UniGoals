import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { getAchievedFromUnits } from '../../utils/utils';

const styles = (theme) => ({
  root: {
    height: theme.spacing.unit * 15,
    width: theme.spacing.unit * 18,
  },
  primary: {
    '&:hover': {
      background: '',
      boxShadow: '0px 0px 10px rgb(246,81,29, 0.85)',
      transition: '.5s',
    },
  },
  secondary: {
    '&:hover': {
      background: '',
      boxShadow: '0px 0px 10px rgb(0,166,237, 0.85)',
      transition: '.5s',
    },
  },
  title: {
    fontSize: theme.spacing.unit * 1.8,
  },
});

const YearPreview = (props) => {
  const { classes } = props;
  const hoverClass = props.index % 2 ? classes.secondary : classes.primary;

  return (
    <Card square className={classNames(classes.root, hoverClass)} color="primary">
      <Link href={`/year/${props.index}`} to={`/year/${props.index}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardHeader
          classes={{
            title: classes.title,
          }}
          title={props.year.title}
          subheader={`units: ${_.size(props.year.units)}`}
          subheaderTypographyProps={{ variant: 'body2' }}
        />
        <CardContent>
          <Typography variant="caption">Achieved {getAchievedFromUnits(props.year.units).toFixed(2)}%</Typography>
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

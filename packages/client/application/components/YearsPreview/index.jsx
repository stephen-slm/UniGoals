import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';

import YearPreview from './YearPreview';
import YearPrviewAdd from './YearPreviewAdd';
import * as constants from '../../utils/constants';

const generatedYears = (years) => {
  const readyYears = [];

  Object.keys(years).forEach((key, index) => {
    readyYears[index] = (
      <Grid key={key} item>
        <YearPreview year={years[key]} index={index + 1} />
      </Grid>
    );
  });

  return readyYears;
};

const YearsPreview = (props) => (
  <Fragment>
    {generatedYears(props.years)}
    {_.size(props.years) < constants.YEAR.MAX && (
      <Grid key={_.size(props.years) + 1} item>
        <YearPrviewAdd insertNewYear={props.insertNewYear} firebase={props.firebase} />
      </Grid>
    )}
  </Fragment>
);

YearsPreview.propTypes = {
  years: PropTypes.shape().isRequired,
  insertNewYear: PropTypes.func.isRequired,
  firebase: PropTypes.shape().isRequired,
};

export default YearsPreview;

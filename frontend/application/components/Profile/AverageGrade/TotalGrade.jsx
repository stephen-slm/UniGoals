import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Tooltip, Position } from '@blueprintjs/core';

export default class AverageGrade extends React.Component {
  static calulateTotalGrade(data) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return 0;
    }

    let totalArchived = 0;

    _.forEach(data, (unit) => {
      _.forEach(unit.content, (unitContent) => {
        if (!_.isNil(unitContent.weighting) && !_.isNil(unitContent.archived) && (unitContent.weighting !== '' && unitContent.archived !== '')) {
          if (parseFloat(unitContent.archived) > 0) {
            totalArchived += parseFloat(unitContent.weighting) * parseFloat(unitContent.archived);
          }
        }
      });
    });

    return parseFloat(totalArchived / 100 / _.size(data)).toFixed(2);
  }

  constructor(props) {
    super(props);
  }

  render() {
    const totalGrade = AverageGrade.calulateTotalGrade(this.props.data);

    return (
      <div className={`pt-card pt-elevation-1 ${this.props.className}`} style={{ width: 120, height: this.props.height }}>
        <div style={{ margin: '60% 23%' }}>
          <Tooltip content="Total Grade" position={Position.TOP}>{`${totalGrade}%`}</Tooltip>
        </div>
      </div>
    );
  }
}

AverageGrade.propTypes = {
  data: PropTypes.shape({}),
  className: PropTypes.string,
  height: PropTypes.number,
};


AverageGrade.defaultProps = {
  data: null,
  height: null,
  className: '',
  isSummary: false,
};

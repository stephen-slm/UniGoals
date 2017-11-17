import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Tooltip, Position } from '@blueprintjs/core';

export default class AverageGrade extends React.Component {
  /**
   * Gets the average grade from the unit content, e.g the section of the unit
   * @param data [["name", "weighting", "grade"]]
   * @returns {number} The average grade
   */
  static calculateAverageGradePercent(data) {
    if (_.isNil(data) || _.isNil(data[0])) {
      return {
        averageGrade: 0,
        maxTotalPossible: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (content) => {
      if (parseFloat(content[2]) > 0) {
        total += parseFloat(content[2]);
        maxTotalPossible += parseFloat(content[2]);
      } else {
        maxTotalPossible += 100;
      }
    });

    const average = parseFloat(total / data.length).toFixed(2);
    const max = parseFloat(maxTotalPossible / data.length).toFixed(2);

    return {
      averageGrade: (average < 0) ? 0 : average,
      maxTotalPossible: (max < 0) ? 0 : max,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { data } = this.props;
    const { averageGrade, maxTotalPossible } = AverageGrade.calculateAverageGradePercent(data);

    return (
      <div className={`pt-card pt-elevation-1 ${this.props.className}`} style={{ width: 120, height: this.props.height }}>
        <div style={{ margin: '60% 23%' }}><Tooltip content="Average Grade" position={Position.TOP}>{`${averageGrade}%`}</Tooltip></div>
        <div style={{ margin: '85% 23%' }}><Tooltip content="Max Grade" position={Position.BOTTOM}>{`${maxTotalPossible}%`}</Tooltip></div>
      </div>
    );
  }
}

AverageGrade.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  className: PropTypes.string,
  height: PropTypes.number,
};


AverageGrade.defaultProps = {
  width: undefined,
  height: 'auto',
  className: '',
};

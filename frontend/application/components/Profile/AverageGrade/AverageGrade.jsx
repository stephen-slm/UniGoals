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
    if (_.isNil(data)) {
      return {
        averageGrade: 0,
        maxTotalPossible: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (content) => {
      if (parseFloat(content.archived) > 0) {
        total += parseFloat(content.archived);
        maxTotalPossible += parseFloat(content.archived);
      } else {
        maxTotalPossible += 100;
      }
    });

    const average = parseFloat(total / _.size(data)).toFixed(2);
    const max = parseFloat(maxTotalPossible / _.size(data)).toFixed(2);

    return {
      averageGrade: (average < 0) ? 0 : average,
      maxTotalPossible: (max < 0) ? 0 : max,
    };
  }

  static calculateAverageGradePercentSummary(data) {
    if (_.isNil(data)) {
      return {
        averageGrade: 0,
        maxTotalPossible: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (unit) => {
      let tableTotal = 0;
      let tableMax = 0;

      _.forEach(unit.content, (content) => {
        if (parseFloat(content.archived) > 0) {
          tableTotal += parseFloat(content.archived);
          tableMax += parseFloat(content.archived);
        } else {
          tableMax += 100;
        }
      });

      if (!_.isNil(unit.content)) {
        total += tableTotal / _.size(unit.content);
        maxTotalPossible += tableMax / _.size(unit.content);
      }
    });


    const average = parseFloat(total / _.size(data)).toFixed(2);
    const max = parseFloat(maxTotalPossible / _.size(data)).toFixed(2);

    return {
      averageGrade: (average < 0) ? 0 : average,
      maxTotalPossible: (max < 0) ? 0 : max,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isSummary: this.props.isSummary,
    };
  }

  render() {
    let averageGrade;
    let maxTotalPossible;

    if (this.state.isSummary) {
      const calculationFunction = AverageGrade.calculateAverageGradePercentSummary;
      ({ averageGrade, maxTotalPossible } = calculationFunction(this.props.summaryData));
    } else {
      const calculationFunction = AverageGrade.calculateAverageGradePercent;
      ({ averageGrade, maxTotalPossible } = calculationFunction(this.props.data));
    }

    return (
      <div className={`pt-card pt-elevation-1 ${this.props.className}`} style={{ width: 120, height: this.props.height }}>
        <div style={{ margin: '60% 23%' }}><Tooltip content="Average Grade" position={Position.TOP}>{`${averageGrade}%`}</Tooltip></div>
        <div style={{ margin: '85% 23%' }}><Tooltip content="Max Grade" position={Position.BOTTOM}>{`${maxTotalPossible}%`}</Tooltip></div>
      </div>
    );
  }
}

AverageGrade.propTypes = {
  data: PropTypes.shape(),
  summaryData: PropTypes.shape(),
  className: PropTypes.string,
  height: PropTypes.number,
  isSummary: PropTypes.bool,
};


AverageGrade.defaultProps = {
  height: null,
  data: {},
  summaryData: {},
  className: '',
  isSummary: false,
};

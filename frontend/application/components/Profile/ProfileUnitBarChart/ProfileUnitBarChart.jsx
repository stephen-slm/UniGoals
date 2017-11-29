import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Bar, Line } from 'recharts';

export default class ProfileUnitBarChart extends React.Component {
  /**
   * Calulates the width for the bar chart, based on the number of data length
   * @param {string} width prop string
   * @param {string} dataLen length of data
   */
  static calculateWidth(width, dataLen) {
    if (!_.isNil(width)) {
      return width;
    } else if (_.isNil(dataLen)) {
      return 200;
    }

    if (20 * dataLen < 200) {
      return 200;
    }
    return 20 * dataLen;
  }

  /**
   * The data expected is an array of a object with three elements
   *
   * 0: Section Name, Defaulted to 'Section'
   * 1: Weighting: Defaulted to 0
   * 2: Archived: Defaulted to 0
   */
  constructor(props) {
    super(props);

    this.generateBarData = this.generateBarData.bind(this);

    this.state = {
      data: this.props.data,
      className: this.props.className,
      color: this.props.color,
      height: this.props.height,
      lineOnly: this.props.lineOnly,
      isSummary: this.props.isSummary,
      displayText: this.props.displayText,
    };

    this.content = this.generateBarData();
  }

  /**
   * generates bar chart data that is needed for the chart, the data
   * is shortnamed and used a float format for numbering
   */
  generateBarData() {
    return _.map(this.state.data, (unit) => {
      const name = _.defaultTo(unit.name, 'Section');
      const { shortName: unitShortName } = unit;
      let shortName = 'Section';

      if (!_.isNil(unitShortName)) {
        shortName = unitShortName;
      } else if (!_.isNil(name) && name !== '') {
        shortName = name.match(/\b(\w)/g).join('').toUpperCase();
      }

      return { name: shortName, value: parseFloat(unit.achieved) };
    });
  }

  /**
   * generates bar chart data that is needed for the chart, the data and the data
   * is shortnamed but we also need to calulate the total for all units, as this
   * would be for the summary.
   */
  generateSummaryBarData() {
    return _.map(this.props.data, (unit) => {
      const name = _.defaultTo(unit.title, 'Unit');
      const { shortName: unitShortName } = unit;
      let shortName = 'Section';

      if (!_.isNil(unitShortName)) {
        shortName = unitShortName;
      } else if (!_.isNil(name) && name !== '') {
        shortName = name.match(/\b(\w)/g).join('').toUpperCase();
      }

      let total = 0;

      _.forEach(unit.content, (content) => {
        if (!_.isNil(content.weighting) && !_.isNil(content.achieved)) {
          if (parseFloat(content.achieved) > 0) {
            total += parseFloat(content.weighting) * parseFloat(content.achieved);
          }
        }
      });
      return { name: shortName, value: total / 100, target: 100 };
    });
  }

  render() {
    let data;

    if (this.state.isSummary) {
      data = this.generateSummaryBarData();
    } else {
      data = this.generateBarData();
    }

    const width = ProfileUnitBarChart.calculateWidth(this.props.width, _.size(this.props.data));

    return (
      <div
        className={`pt-card pt-elevation-1 ${this.state.className}`}
        style={{ maxWidth: width, height: this.state.height }}
      >
        <ComposedChart margin={{ bottom: 15 }} style={{ marginLeft: '-50px' }} width={width} height={200} data={data}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name">
            <Label value={this.state.displayText} offset={0} position="bottom" />
          </XAxis>
          <YAxis />
          <Tooltip />
          {(!this.state.lineOnly) ? (<Bar dataKey="value" fill={this.state.color} />) : null}
          <Line type="monotone" dataKey="value" stroke="#ff7300" />
        </ComposedChart>
      </div>
    );
  }
}

ProfileUnitBarChart.propTypes = {
  width: PropTypes.number,
  data: PropTypes.shape({}),
  height: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  displayText: PropTypes.string,
  lineOnly: PropTypes.bool,
  isSummary: PropTypes.bool,
};

ProfileUnitBarChart.defaultProps = {
  width: null,
  height: 'auto',
  className: '',
  color: '#009FE3',
  lineOnly: false,
  isSummary: false,
  data: {},
  displayText: 'Unit Process',
};

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Bar, Line } from 'recharts';

export default class ProfileSummaryBarChart extends React.Component {
  static calculateWidth(width, dataLen) {
    if (!_.isNil(width)) {
      return width;
    }

    if (_.isNil(dataLen)) {
      return 200;
    }

    if (75 * dataLen < 200) {
      return 200;
    }
    return 75 * dataLen;
  }
  /**
   * The data expected is an array of a object with three elements
   *
   * 0: Section Name, Defaulted to 'Section'
   * 1: Weighting: Defaulted to 0
   * 2: Achieved: Defaulted to 0
   */
  constructor(props) {
    super(props);

    this.generateBarData = this.generateBarData.bind(this);

    this.state = {
      className: this.props.className,
      height: this.props.height,
      lineOnly: this.props.lineOnly,
    };
  }

  generateBarData() {
    if (_.isNil(this.props.data[0])) {
      return [];
    }


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
        if (!_.isNil(content[1]) && !_.isNil(content[2])) {
          if (parseFloat(content[2]) > 0) {
            total += parseFloat(content[1]) * parseFloat(content[2]);
          }
        }
      });
      return { name: shortName, value: total / 100, target: 100 };
    });
  }

  render() {
    this.content = this.generateBarData();
    const width = ProfileSummaryBarChart.calculateWidth(this.props.width, this.props.data.length);

    return (
      <div className={`pt-card pt-elevation-1 ${this.state.className}`} style={{ maxWidth: width, height: this.state.height }}>
        <div>
          <ComposedChart margin={{ bottom: 15 }} style={{ marginLeft: '-50px' }} width={width} height={200} data={this.content}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name">
              <Label value="Unit Progress" offset={0} position="bottom" />
            </XAxis>
            <YAxis dataKey="value" />
            <Tooltip />
            {(!this.state.lineOnly) ? (<Bar dataKey="value" fill="#009FE3" />) : null }
            {(!this.state.lineOnly) ? (<Bar dataKey="target" fill="#621362" />) : null }
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </div>
      </div>
    );
  }
}

ProfileSummaryBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  width: PropTypes.number,
  height: PropTypes.string,
  className: PropTypes.string,
  lineOnly: PropTypes.bool,
};

ProfileSummaryBarChart.defaultProps = {
  width: undefined,
  height: 'auto',
  className: '',
  lineOnly: false,
};

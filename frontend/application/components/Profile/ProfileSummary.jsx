import React from 'react';
import PropTypes from 'prop-types';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Bar, Line } from 'recharts';
import _ from 'lodash';


import style from './profile.less';

export default class ProfileSummary extends React.Component {
  constructor(props) {
    super(props);

    this.profileSummaryBarChart = this.profileSummaryBarChart.bind(this);
    this.generateSummaryBarChartData = this.generateSummaryBarChartData.bind(this);

    this.state = {
      currentWeek: ProfileSummary.getCurrentYearWeek(),
    };
  }

  static getCurrentYearWeek() {
    const uniStartWeek = 38;
    let date = new Date();

    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));


    date.setUTCDate((date.getUTCDate() + 4) - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    const uniWeek = weekNo - uniStartWeek;

    return Math.abs(uniWeek);
  }


  generateSummaryBarChartData() {
    const barChartData = _.map(this.props.units, (unit) => {
      const name = _.defaultTo(unit.title, 'Section');
      const shortaName = (!_.isNil(unit.shortName) ? unit.shortName : name.match(/\b(\w)/g).join('').toUpperCase());

      let total = 0;

      _.forEach(unit.content, (content) => {
        if (!_.isNil(content[1]) && !_.isNil(content[2])) {
          if (parseFloat(content[2]) > 0) {
            total += parseFloat(content[1]) * parseFloat(content[2]);
          }
        }
      });
      return { name: shortaName, value: total / 100, target: 100 };
    });

    return barChartData;
  }

  profileSummaryBarChart() {
    return (
      <div className="pt-card pt-elevation-1" style={{ maxWidth: 75 * this.props.units.length, height: 'auto' }}>
        <div>
          <ComposedChart margin={{ bottom: 15 }} style={{ marginLeft: '-50px' }} maxSize="100" width={75 * this.props.units.length} height={200} data={this.generateSummaryBarChartData()}>
            <CartesianGrid strokeDasharray="3 3" style={{ paddingBottom: '10px' }} />
            <XAxis dataKey="name">
              <Label value="Unit Progress" offset={0} position="bottom" />
            </XAxis>
            <YAxis dataKey="value" />
            <Tooltip />
            <Bar dataKey="value" fill="#009FE3" />
            <Bar dataKey="target" fill="#621362" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={{ minWidth: 75 * this.props.units.length }} className={`pt-card pt-elevation-3 ${style.profileSummaryWrapper}`}>
        <div className={style.profileSummaryHeader}>Summary</div>
        <div className={style.profileSummaryHeader}>
          Bsc Computer Science - {this.props.profile.name}, week: {this.state.currentWeek}
        </div>
        <div className={style.ProfileSummaryBarChart}>
          {this.profileSummaryBarChart()}
        </div>
      </div>
    );
  }
}

ProfileSummary.propTypes = {
  units: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    familyName: PropTypes.string,
    GivenName: PropTypes.string,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import  { Button, EditableText } from '@blueprintjs/core';

import * as constants from '../../../utils/constants';
import HomeUnitPieChart from '../HomeUnitBarChart/HomeUnitPieChart';
import AverageGrade from '../AverageGrade/AverageGrade';
import TotalGrade from '../AverageGrade/TotalGrade';
import TopFiveSection from '../AverageGrade/TopFiveSection';


import style from '../home.less';

export default class HomeSummary extends React.Component {
  /**
   * Gets the current year week for University, based on the starting week of week 38 of
   * the university.
   */
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

  constructor(props) {
    super(props);

    this.state = {
      isSummary: true,
      yearTitle: this.props.yearTitle,
      currentWeek: HomeSummary.getCurrentYearWeek(),
    };

    this.insertNewYear = this.insertNewYear.bind(this);
    this.updateYearTitle = this.updateYearTitle.bind(this);
    this.updateYearTitleDatabase = this.updateYearTitleDatabase.bind(this);
  }

  insertNewYear() {
    if(!this.props.exampleUser) {
      this.props.firebase.insertNewYear()
        .then(year => this.props.insertNewYear(year.yearKey, year.title, year.unitKey));
    }
  }

  updateYearTitleDatabase(title) {
    if (!this.props.exampleUser) {
      this.props.firebase.updateYearTitle(this.props.yearIndex, title);
    }
  
    this.props.updateYearTitle(this.props.yearIndex, title);
  }

  updateYearTitle(title) {
    this.setState({
      yearTitle: title,
    });
  }


  render() {
    return (
      <div style={{ minWidth: 625 }} className={`pt-card pt-elevation-3 ${style.profileSummaryWrapper}`}>
        <Button onClick={this.insertNewYear} className="pt-button pt-minimal pt-icon-plus" text="Create Year" />
        <div className={style.profileSummaryHeader}>Summary</div>
        <div className={style.profileSummaryHeader}>
          {_.defaultTo(this.props.profile.course_name, 'University Course')} - {this.props.profile.name} - Year: {_.defaultTo(this.props.profile.course_year, '1')}, week: {this.state.currentWeek}
        </div>
        <div className={style.profileSummaryHeader}>
          <EditableText
            placeholder="Year"
            maxLength="12"
            onChange={change => this.updateYearTitle(change)}
            onConfirm={change => this.updateYearTitleDatabase(change)}
            value={_.defaultTo(this.state.yearTitle, 'Year')}
          />
        </div>
        <div className={style.profileSummaryAverageWrapper}>
          <TopFiveSection
            data={this.props.units}
            className={style.topFiveSectionWrapper}
            history={this.props.history}
          />
          <HomeUnitPieChart
            data={this.props.units}
            color={constants.TABLE.COMPLETE_COLORS}
            className={style.ProfileSummaryChart}
            isSummary={this.state.isSummary}
            displayText="Overall Process"
          />
          <AverageGrade
            summaryData={this.props.units}
            isSummary={this.state.isSummary}
            className={style.SummaryAverageGrade}
          />
          <TotalGrade
            data={this.props.units}
            className={style.SummaryAverageGrade}
          />
        </div>
      </div>
    );
  }
}

HomeSummary.propTypes = {
  yearIndex: PropTypes.string,
  yearTitle: PropTypes.string,
  exampleUser: PropTypes.bool,
  insertNewYear: PropTypes.func,
  firebase: PropTypes.shape({
    insertNewYear: PropTypes.func,
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({
    course_name: PropTypes.string,
    course_year: PropTypes.string,
    email: PropTypes.string,
    familyName: PropTypes.string,
    GivenName: PropTypes.string,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    new: PropTypes.bool,
    courseName: PropTypes.string,
  }).isRequired,
};

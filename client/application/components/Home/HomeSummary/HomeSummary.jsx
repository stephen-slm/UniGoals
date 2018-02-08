import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Button, EditableText, Alert, Intent, Tooltip, Position } from '@blueprintjs/core';

import * as constants from '../../../utils/constants';
import HomeUnitPieChart from '../HomeUnitBarChart/HomeUnitPieChart';
import AverageGrade from '../AverageGrade/AverageGrade';
import TotalGrade from '../AverageGrade/TotalGrade';
import TopFiveSection from '../AverageGrade/TopFiveSection';


import style from '../home.less';
import toaster from '../../../utils/toaster';

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
      isDeletingYear: false,
      isSummary: true,
      yearTitle: this.props.yearTitle,
      currentWeek: HomeSummary.getCurrentYearWeek(),
    };

    this.insertNewYear = this.insertNewYear.bind(this);
    this.updateYearTitle = this.updateYearTitle.bind(this);
    this.updateYearTitleDatabase = this.updateYearTitleDatabase.bind(this);
    this.showDeleteYear = this.showDeleteYear.bind(this);
    this.deleteSelectedYear = this.deleteSelectedYear.bind(this);
  }

  insertNewYear() {
    if (this.props.exampleUser) return;

    this.props.firebase.insertNewYear()
      .then(year => this.props.insertNewYear(year.yearKey, year.title, year.unitKey))
      .catch(error => toaster.danger(error.message));
  }

  updateYearTitleDatabase(newTitle) {
    if (this.props.exampleUser) return;
    let title = newTitle;

    // If the user exists whiel the text is empty, fill with replacement text
    if (title === '') title = 'Uni 👨‍🎓 👩‍🎓';

    this.props.firebase.updateYearTitle(this.props.yearIndex, title);
    this.props.updateYearTitle(this.props.yearIndex, title);
    this.setState({ yearTitle: title });
  }

  /**
   * updates the title for the selected/active year in the state
   * @param {string} title the new title for the year in the state
   */
  updateYearTitle(title) {
    this.setState({
      yearTitle: title,
    });
  }

  // Shows the delete year dialog
  showDeleteYear() {
    if (this.props.exampleUser) return;

    this.setState({ isDeletingYear: !this.state.isDeletingYear });
  }


  // Deletes the current active year from firebae and redux
  deleteSelectedYear() {
    if (this.props.exampleUser) return;

    this.props.firebase.deleteYear(this.props.yearIndex)
      .then(() => this.props.removeYear(this.props.yearIndex))
      .catch(error => toaster.danger(error.message));

    this.showDeleteYear();
  }


  render() {
    return (
      <div style={{ minWidth: 625 }} className={`pt-card pt-elevation-3 ${style.profileSummaryWrapper}`}>
        <Tooltip content="Create Year" position={Position.RIGHT}>
          <Button onClick={this.insertNewYear} className="pt-button pt-minimal pt-icon-plus" />
        </Tooltip>
        <Tooltip content="Delete Year" position={Position.LEFT} className={style.deleteYearButton}>
          <Button onClick={this.showDeleteYear} className="pt-button pt-icon-trash pt-minimal" />
        </Tooltip>


        <Alert
          intent={Intent.DANGER}
          isOpen={this.state.isDeletingYear}
          confirmButtonText={`Delete ${this.state.yearTitle}`}
          cancelButtonText="Cancel"
          onConfirm={this.deleteSelectedYear}
          onCancel={this.showDeleteYear}
        >
          <p>
            Are you sure you want to delete year <b>{this.state.yearTitle}</b>?<br />
            This will remove <b>all</b> units and their corresponding data.
          </p>
        </Alert>


        <div className={style.profileSummaryHeader}>Summary</div>
        <div className={style.profileSummaryHeader}>
          {_.defaultTo(this.props.profile.course_name, 'University Course')} - {this.props.profile.name} - Year: {_.defaultTo(this.props.profile.course_year, '1')}, week: {this.state.currentWeek}
        </div>
        <div className={style.profileSummaryHeader}>
          <EditableText
            placeholder="Year"
            maxLength={`${constants.YEAR.TITLE.MAX}`}
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
  exampleUser: PropTypes.bool.isRequired,
  insertNewYear: PropTypes.func,
  removeYear: PropTypes.func,
  updateYearTitle: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    updateYearTitle: PropTypes.func,
    deleteYear: PropTypes.func,
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

HomeSummary.defaultProps = {
  yearTitle: '',
  yearIndex: 0,
  insertNewYear: () => null,
  removeYear: () => null,
};

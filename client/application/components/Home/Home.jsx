import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import HomeSummary from './HomeSummary/HomeSummary';
import HomeNewUser from './HomeNewUser/HomeNewUser';
import Tables from './HomeTables/Tables';

import { Tab2, Tabs2 } from '@blueprintjs/core';

export default class Home extends React.Component {
  constructor() {
    super()

    this.generateTabs = this.generateTabs.bind(this);
    this.getTabContent = this.getTabContent.bind(this);
  }

  getTabContent(index, year) {
    const { profile } = this.props;

    return (
    <div>
      <HomeNewUser
        index={index}
        profile={profile}
        firebase={this.props.firebase}
        updateProfile={this.props.updateProfile}
        exampleUser={this.props.exampleUser}
      />
      <HomeSummary
        index={index}
        units={year.units}
        profile={profile}
        history={this.props.history}
      />
      <Tables
        index={index}
        insertUnitRow={this.props.insertUnitRow}
        updateUnits={this.props.updateUnits}
        updateRowContent={this.props.updateRowContent}
        removeUnitRow={this.props.removeUnitRow}
        updateUnitTitle={this.props.updateUnitTitle}
        addUnitTable={this.props.addUnitTable}
        removeUnitTable={this.props.removeUnitTable}
        firebase={this.props.firebase}
        exampleUser={this.props.exampleUser}
        units={year.units}
      />
    </div>
  );
  }

  generateTabs() {
    if (_.size(this.props.years[Object.keys(this.props.years)[0]]) === 0) {
      return (<div>none</div>);
    }

    return _.map(this.props.years, (year, index) => (<Tab2
        id={index}
        title={year.title}
        panel={this.getTabContent(index, year)}
      />))
  }

  render() {
    const tabContent = this.generateTabs();
    return (
      <div>
        <Tabs2 selectedTabId={Object.keys(this.props.years)[0]} id="YearTabs">
          {tabContent}
        </Tabs2>
      </div>
    )
  }
}

Home.propTypes = {
  firebase: PropTypes.shape().isRequired,
  updateYears: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  years: PropTypes.shape().isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  exampleUser: PropTypes.bool,
  profile: PropTypes.shape({
    email: PropTypes.string,
    course_name: PropTypes.string,
    new: PropTypes.bool,
    exampleUser: PropTypes.bool,
  }).isRequired,
};

Home.defaultProps = {
  exampleUser: false,
};

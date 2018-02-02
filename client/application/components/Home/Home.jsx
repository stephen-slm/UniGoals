import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Tab2, Tabs2, Button } from '@blueprintjs/core';

import HomeSummary from './HomeSummary/HomeSummary';
import HomeNewUser from './HomeNewUser/HomeNewUser';
import Tables from './HomeTables/Tables';


export default class Home extends React.Component {
  constructor() {
    super();

    this.generateTabs = this.generateTabs.bind(this);
    this.getTabContent = this.getTabContent.bind(this);
    this.insertNewYear = this.insertNewYear.bind(this);
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
          updateYears={this.props.updateYears}
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
      key={index}
      title={year.title}
      panel={this.getTabContent(index, year)}
    />));
  }

  insertNewYear() {
    this.props.firebase.insertNewYear()
      .then(year => this.props.insertNewYear(year.yearKey, year.title, year.unitKey));
  }

  render() {
    const tabContent = this.generateTabs();
    return (
      <div>
        <Tabs2 defaultSelectedTabId={Object.keys(this.props.years)[0]} id="YearTabs">
          <Button onClick={this.insertNewYear} className="pt-button pt-minimal pt-icon-plus" />
          {tabContent}
        </Tabs2>
      </div>
    );
  }
}

Home.propTypes = {
  firebase: PropTypes.shape().isRequired,
  updateYears: PropTypes.func.isRequired,
  insertNewYear: PropTypes.func.isRequired,
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

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

    this.state = {
      selectedId: '',
    };

    this.generateTabs = this.generateTabs.bind(this);
    this.getTabContent = this.getTabContent.bind(this);
    this.updateId = this.updateId.bind(this);
  }

  getTabContent(index, year) {
    const { profile } = this.props;

    _.isNil(year.units) ? year.units = {} : null;

    return (
      <div>
        <HomeNewUser
          yearIndex={index}
          profile={profile}
          firebase={this.props.firebase}
          updateProfile={this.props.updateProfile}
          exampleUser={this.props.exampleUser}
        />
        <HomeSummary
          yearIndex={index}
          units={year.units}
          yearTitle={year.title}
          profile={profile}
          history={this.props.history}
          firebase={this.props.firebase}
          exampleUser={this.props.exampleUser}
          insertNewYear={this.props.insertNewYear}
          removeYear={this.props.removeYear}
          updateYearTitle={this.props.updateYearTitle}
        />
        <Tables
          yearIndex={index}
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


  updateId(newTabId, prevTabId, event) {
    this.setState({ selectedId: newTabId });
  }

  componentWillReceiveProps(props) {
    if (Object.keys(props.years).indexOf(this.state.selectedId) == -1) {
      this.setState({
        selectedId: Object.keys(props.years)[Object.keys(props.years).length - 1],
      });
    }
  }

  render() {
    const tabContent = this.generateTabs();
    return (
      <div>
        <Tabs2
          renderActiveTabPanelOnly
          selectedTabId={this.state.selectedId}
          onChange={this.updateId}
          id="YearTabs"
        >
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
  removeYear: PropTypes.func.isRequired,
  updateYearTitle: PropTypes.func.isRequired,
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

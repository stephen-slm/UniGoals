import createBrowserHistory from 'history/createBrowserHistory';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import * as _ from 'lodash';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import * as routePaths from './routePaths';

import Home from '../Home/HomeN';
import Navigation from '../Navigation/Navigation';
import Login from '../Login/Login';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#F6511D' }, // This is just green.A700 as hex.
    secondary: { main: '#00A6ED' }, // Purple and green play nicely together.
  },
});

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.routePaths = routePaths;
    this.history = createBrowserHistory();

    this.history.replace('/');
  }

  render() {
    const {
      removeProfile,
      profile,
      notifications,
      years,
      updateYears,
      removeUnitRow,
      removeYear,
      insertUnitRow,
      insertNewYear,
      updateRowContent,
      updateUnitTitle,
      addUnitTable,
      removeUnitTable,
      updateNotifications,
      removeNotification,
      updateCourseName,
      updateYearTitle,
      updateProfile,
      version,
      firebase,
    } = this.props;

    if (!_.isNil(profile.name)) {
      return (
        <Router>
          <MuiThemeProvider theme={theme}>
            <Navigation
              history={this.history}
              routePaths={this.routePaths}
              profile={profile}
              removeProfile={removeProfile}
              notifications={notifications}
              updateNotifications={updateNotifications}
              removeNotification={removeNotification}
              exampleUser={profile.exampleUser}
              firebase={firebase}
              version={version}
            >
              <Route
                exact
                path="/"
                render={() => (
                  <Home
                    years={years}
                    firebase={firebase}
                    exampleUser={profile.exampleUser}
                    updateNotifications={updateNotifications}
                    notifications={notifications}
                  />
                )}
              />
              <Route
                exact
                path="/year/:yearIndex"
                render={() => (
                  <Home
                    history={this.history}
                    profile={profile}
                    updateProfile={updateProfile}
                    updateCourseName={updateCourseName}
                    years={years}
                    updateYears={updateYears}
                    removeYear={removeYear}
                    updateYearTitle={updateYearTitle}
                    removeUnitRow={removeUnitRow}
                    insertNewYear={insertNewYear}
                    insertUnitRow={insertUnitRow}
                    updateRowContent={updateRowContent}
                    updateUnitTitle={updateUnitTitle}
                    addUnitTable={addUnitTable}
                    removeUnitTable={removeUnitTable}
                    firebase={firebase}
                    exampleUser={profile.exampleUser}
                  />
                )}
              />
            </Navigation>
          </MuiThemeProvider>
        </Router>
      );
    }

    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <div>
            <Route
              exact
              path="*"
              render={() => (
                <Login
                  updateProfile={this.props.updateProfile}
                  updateNotifications={this.props.updateNotifications}
                  updateYearTitle={this.props.updateYearTitle}
                  firebase={this.props.firebase}
                  updateYears={this.props.updateYears}
                  history={this.history}
                  version={version}
                />
              )}
            />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

Application.propTypes = {
  version: PropTypes.string.isRequired,
  firebase: PropTypes.shape().isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateYearTitle: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  removeProfile: PropTypes.func.isRequired,
  updateYears: PropTypes.func.isRequired,
  profile: PropTypes.shape().isRequired,
  updateCourseName: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  removeYear: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  insertNewYear: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  notifications: PropTypes.shape().isRequired,
  years: PropTypes.shape({}),
};

Application.defaultProps = {
  years: {},
};

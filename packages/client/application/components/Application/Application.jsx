import createBrowserHistory from 'history/createBrowserHistory';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import * as _ from 'lodash';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import * as routePaths from './routePaths';

import Home from '../Home/Home';
import Navigation from '../Navigation/Navigation';
import Login from '../Login/Login';
import Notifications from '../Notifications/Notifications';

// Year
import Year from '../Home/Year';

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
      setUnitDoubleWeightStatus,
      updateYearTitle,
      updateProfile,
      version,
      firebase,
      displayHelp,
      showHelpBox,
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
              firebase={firebase}
              version={version}
              displayHelp={displayHelp}
              showHelpBox={showHelpBox}
            >
              <Route
                exact
                path={this.routePaths.home}
                render={() => (
                  <Home
                    years={years}
                    firebase={firebase}
                    profile={profile}
                    updateProfile={updateProfile}
                    insertNewYear={insertNewYear}
                  />
                )}
              />
              <Route
                path={this.routePaths.notifications}
                render={() => (
                  <Notifications
                    updateNotifications={updateNotifications}
                    removeNotification={removeNotification}
                    notifications={notifications}
                    showHelpBox={showHelpBox}
                    firebase={firebase}
                  />
                )}
              />
              <Route
                path="/year/:yearIndex"
                render={() => (
                  <Year
                    setUnitDoubleWeightStatus={setUnitDoubleWeightStatus}
                    insertUnitRow={insertUnitRow}
                    history={this.history}
                    profile={profile}
                    years={years}
                    updateYears={updateYears}
                    removeYear={removeYear}
                    updateYearTitle={updateYearTitle}
                    removeUnitRow={removeUnitRow}
                    updateRowContent={updateRowContent}
                    updateUnitTitle={updateUnitTitle}
                    addUnitTable={addUnitTable}
                    removeUnitTable={removeUnitTable}
                    firebase={firebase}
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
  displayHelp: PropTypes.bool.isRequired,
  showHelpBox: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
  firebase: PropTypes.shape().isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateYearTitle: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  removeProfile: PropTypes.func.isRequired,
  updateYears: PropTypes.func.isRequired,
  profile: PropTypes.shape().isRequired,
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

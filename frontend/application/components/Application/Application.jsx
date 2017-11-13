
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import * as routePaths from './routePaths';

import style from './application.less';

import Header from '../Layout/Header';
import Login from '../Login/Login';
import SignOut from '../Login/SignOut';
import Profile from '../Profile/Profile';

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.routePaths = routePaths;
  }

  render() {
    const {
      removeProfile,
      client,
      profile,
      notifications,
      units,
      updateUnits,
      removeUnitRow,
      insertUnitRow,
      updateRowContent,
      updateUnitTitle,
    } = this.props;

    if (!_.isNil(profile.token)) {
      return (
        <Router>
          <div className={style.applicationStyle}>
            <Route
              exact
              path="/"
              render={history => (<Profile
                history={history.history}
                client={client}
                profile={profile}
                notifications={notifications}
                units={units}
                updateUnits={updateUnits}
                removeUnitRow={removeUnitRow}
                insertUnitRow={insertUnitRow}
                updateUnitTitle={updateUnitTitle}
                updateRowContent={updateRowContent}
              />)}
            />
            <Route
              path={this.routePaths.signOut}
              render={history => <SignOut removeProfile={removeProfile} history={history.history} />}
            />
          </div>
        </Router>
      );
    }

    return (
      <Router>
        <div className={style.applicationStyle}>
          <Header logo="/components/img/logo.png" />
          <Route
            exact
            path="/"
            render={history => (<Login
              history={history.history}
              google={client.google}
              updateProfile={this.props.updateProfile}
            />)}
          />
        </div>
      </Router>
    );
  }
}

Application.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  removeProfile: PropTypes.func.isRequired,
  updateUnits: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  client: PropTypes.shape().isRequired,
  profile: PropTypes.shape().isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  units: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

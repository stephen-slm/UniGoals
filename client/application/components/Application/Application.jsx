import createBrowserHistory from 'history/createBrowserHistory';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import * as _ from 'lodash';

import FirebaseWrapper from '../../utils/FirebaseWrapper';
import * as routePaths from './routePaths';

import Navigation from '../Navigation/Navigation';
import Login from '../Login/Login';
import SignOut from '../Login/SignOut';
import Home from '../Home/Home';

const style = require('./application.less');

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.routePaths = routePaths;
    this.history = createBrowserHistory();

    this.history.replace('/');

    /**
     * creating the firebase wrapper that will be used to authenticate and to interact with the
     * firebase database
     */
    this.firebase = new FirebaseWrapper({
      apiKey: 'AIzaSyDBSpRMIl4olTWN0AOMCTMVqeIVkhGio_8',
      authDomain: 'organic-lacing-185810.firebaseapp.com',
      databaseURL: 'https://organic-lacing-185810.firebaseio.com',
      projectId: 'organic-lacing-185810',
      storageBucket: 'organic-lacing-185810.appspot.com',
      messagingSenderId: '40609903553',
    });
  }

  render() {
    const {
      removeProfile,
      profile,
      notifications,
      years,
      updateYears,
      removeUnitRow,
      insertUnitRow,
      updateRowContent,
      updateUnitTitle,
      addUnitTable,
      removeUnitTable,
      updateNotifications,
      removeNotification,
      updateCourseName,
      updateProfile,
      version,
    } = this.props;

    if (!_.isNil(profile.name)) {
      return (
        <Router>
          <div className={style.applicationStyle}>
            <Navigation
              history={this.history}
              routePaths={this.routePaths}
              profile={profile}
              notifications={notifications}
              updateNotifications={updateNotifications}
              removeNotification={removeNotification}
              exampleUser={profile.exampleUser}
              firebase={this.firebase}
              version={version}
            >
              <Route
                exact
                path="/"
                render={() => (<Home
                  history={this.history}
                  profile={profile}
                  updateProfile={updateProfile}
                  updateCourseName={updateCourseName}
                  years={years}
                  updateYears={updateYears}
                  removeUnitRow={removeUnitRow}
                  insertUnitRow={insertUnitRow}
                  updateRowContent={updateRowContent}
                  updateUnitTitle={updateUnitTitle}
                  addUnitTable={addUnitTable}
                  removeUnitTable={removeUnitTable}
                  firebase={this.firebase}
                  exampleUser={profile.exampleUser}
                />)}
              />
            </Navigation>
            <Route
              path={this.routePaths.signOut}
              render={() => (<SignOut
                removeProfile={removeProfile}
                history={this.history}
                firebase={this.firebase}
              />)}
            />
          </div>
        </Router>
      );
    }

    return (
      <Router>
        <div className={style.applicationStyle}>
          <Route
            exact
            path="*"
            render={() => (<Login
              updateProfile={this.props.updateProfile}
              updateNotifications={this.props.updateNotifications}
              firebase={this.firebase}
              updateYears={this.props.updateYears}
              history={this.history}
              version={version}
            />)}
          />
        </div>
      </Router>
    );
  }
}

Application.propTypes = {
  version: PropTypes.string.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateCourseName: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  removeProfile: PropTypes.func.isRequired,
  updateYears: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  profile: PropTypes.shape().isRequired,
  notifications: PropTypes.shape().isRequired,
  units: PropTypes.shape({}),
};

Application.defaultProps = {
  units: {},
};

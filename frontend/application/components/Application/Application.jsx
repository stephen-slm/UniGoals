
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import FirebaseWrapper from '../../utils/FirebaseWrapper';
import * as routePaths from './routePaths';

import style from './application.less';

import Login from '../Login/Login';
import SignOut from '../Login/SignOut';
import Profile from '../Profile/Profile';

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.routePaths = routePaths;

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
      units,
      updateUnits,
      removeUnitRow,
      insertUnitRow,
      updateRowContent,
      updateUnitTitle,
      addUnitTable,
      removeUnitTable,
    } = this.props;

    if (!_.isNil(profile.uid)) {
      return (
        <Router>
          <div className={style.applicationStyle}>
            <Route
              exact
              path="/"
              render={history => (<Profile
                history={history.history}
                profile={profile}
                notifications={notifications}
                units={units}
                updateUnits={updateUnits}
                removeUnitRow={removeUnitRow}
                insertUnitRow={insertUnitRow}
                updateRowContent={updateRowContent}
                updateUnitTitle={updateUnitTitle}
                addUnitTable={addUnitTable}
                removeUnitTable={removeUnitTable}
                firebase={this.firebase}
              />)}
            />
            <Route
              path={this.routePaths.signOut}
              render={history => (<SignOut
                removeProfile={removeProfile}
                history={history.history}
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
            path="/"
            render={history => (<Login
              history={history.history}
              updateProfile={this.props.updateProfile}
              firebase={this.firebase}
              updateUnits={this.props.updateUnits}
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
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  profile: PropTypes.shape().isRequired,
  notifications: PropTypes.shape().isRequired,
  units: PropTypes.shape({}),
};

Application.defaultProps = {
  units: {},
};

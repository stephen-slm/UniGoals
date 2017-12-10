import React from 'react';
import PropTypes from 'prop-types';

import Navigation from '../Navigation/Navigation';
import HomeSummary from './HomeSummary/HomeSummary';
import HomeNewUser from './HomeNewUser/HomeNewUser';
import Tables from './HomeTables/Tables';

export default function Home(props) {
  const { profile } = props;

  return (
    <div>
      <HomeNewUser
        profile={profile}
        firebase={props.firebase}
        updateProfile={props.updateProfile}
        exampleUser={props.exampleUser}
      />
      <Navigation
        history={props.history}
        profile={profile}
        notifications={props.notifications}
        updateNotifications={props.updateNotifications}
        removeNotification={props.removeNotification}
        exampleUser={props.exampleUser}
        firebase={props.firebase}
        version={props.version}
      />
      <HomeSummary
        units={props.units}
        profile={profile}
        history={props.history}
      />
      <Tables
        insertUnitRow={props.insertUnitRow}
        updateUnits={props.updateUnits}
        updateRowContent={props.updateRowContent}
        removeUnitRow={props.removeUnitRow}
        updateUnitTitle={props.updateUnitTitle}
        addUnitTable={props.addUnitTable}
        removeUnitTable={props.removeUnitTable}
        firebase={props.firebase}
        exampleUser={props.exampleUser}
        units={props.units}
      />
    </div>
  );
}

Home.propTypes = {
  firebase: PropTypes.shape().isRequired,
  updateUnits: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  units: PropTypes.shape().isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  notifications: PropTypes.shape().isRequired,
  version: PropTypes.string.isRequired,
  exampleUser: PropTypes.bool,
  profile: PropTypes.shape({
    email: PropTypes.string,
    course_name: PropTypes.string,
    isNew: PropTypes.bool,
    exampleUser: PropTypes.bool,
  }).isRequired,
};

Home.defaultProps = {
  exampleUser: false,
};

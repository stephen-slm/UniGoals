import React from 'react';
import PropTypes from 'prop-types';

import ProfileNavigation from './Navigation/ProfileNavigation';
import ProfileSummary from './ProfileSummary/ProfileSummary';
import ProfileNewUser from './ProfileNewUser/ProfileNewUser';
import Tables from './ProfileTables/Tables';

export default class Profile extends React.Component {
  render() {
    const { profile } = this.props;

    return (
      <div>
        <ProfileNewUser
          profile={profile}
          firebase={this.props.firebase}
          updateProfile={this.props.updateProfile}
          exampleUser={this.props.exampleUser}
        />
        <ProfileNavigation
          history={this.props.history}
          profile={this.profile}
          notifications={this.props.notifications}
          updateNotifications={this.props.updateNotifications}
          removeNotification={this.props.removeNotification}
          exampleUser={this.props.exampleUser}
          firebase={this.props.firebase}
          version={this.props.version}
        />
        <ProfileSummary
          units={this.props.units}
          profile={this.profile}
          history={this.props.history}
        />
        <Tables
          insertUnitRow={this.props.insertUnitRow}
          updateUnits={this.props.updateUnits}
          updateRowContent={this.props.updateRowContent}
          removeUnitRow={this.props.removeUnitRow}
          updateUnitTitle={this.props.updateUnitTitle}
          addUnitTable={this.props.addUnitTable}
          removeUnitTable={this.props.removeUnitTable}
          firebase={this.props.firebase}
          exampleUser={this.props.exampleUser}
          units={this.props.units}
        />
      </div>
    );
  }
}

Profile.propTypes = {
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

Profile.defaultProps = {
  exampleUser: false,
};

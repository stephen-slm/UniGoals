import React from 'react';
import PropTypes from 'prop-types';

import { Dialog } from '@blueprintjs/core';

import ProfileNavigation from './Navigation/ProfileNavigation';
import ProfileSummary from './ProfileSummary/ProfileSummary';
import Tables from './ProfileTables/Tables';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.isNoLongerNew = this.isNoLongerNew.bind(this);
    this.newUserDialog = this.newUserDialog.bind(this);

    this.profile = this.props.profile;

    this.state = {
      isNew: true,
      canEscapeKeyClose: true,
    };
  }




  isNoLongerNew(e) {
    e.preventDefault();
    this.setState({ isNew: false });
    // TODO: This should tell the server that the user is no longer new
  }

  newUserDialog() {
    return (
      <Dialog
        iconName="pt-icon-edit"
        title={`Welcome ${this.profile.givenName}`}
        isOpen={this.state.isNew}
        onClose={this.isNoLongerNew}
        canEscapeKeyClose={this.state.canEscapeKeyClose}
      >
        <div className="pt-dialog-body">
          Thank you for  using unistats-alpha! If you have any problems please email:
          UP840877@myport.ac.uk or click the little help box in the top right hand corner!
          <br/>
          <br/>
          Thanks,
          <br/>
          <br/>
          thinknet.xyz
        </div>
      </Dialog>
    );
  }

  render() {
    return (
      <div>
        {this.newUserDialog()}
        <ProfileNavigation
          history={this.props.history}
          help={this.props.client.help}
          profile={this.profile}
          notifications={this.props.notifications}
        />
        <ProfileSummary
          units={this.props.units}
          profile={this.profile}
        />
        <Tables
          insertUnitRow={this.props.insertUnitRow}
          updateUnits={this.props.updateUnits}
          updateRowContent={this.props.updateRowContent}
          removeUnitRow={this.props.removeUnitRow}
          updateUnitTitle={this.props.updateUnitTitle}
          addUnitTable={this.props.addUnitTable}
          removeUnitTable={this.props.removeUnitTable}
          units={this.props.units}
        />
      </div>
    );
  }
}

Profile.propTypes = {
  client: PropTypes.shape().isRequired,
  updateUnits: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  units: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
};

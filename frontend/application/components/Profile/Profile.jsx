import React from 'react';
import PropTypes from 'prop-types';

import { Dialog, Classes } from '@blueprintjs/core';
import ProfileNavigation from './ProfileNavigation';

import style from './profile.less';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.isNoLongerNew = this.isNoLongerNew.bind(this);
    this.newUserDialog = this.newUserDialog.bind(this);

    this.ProfileCards = this.ProfileCards.bind(this);


    this.profile = this.props.profile;

    this.state = {
      isNew: true,
      canEscapeKeyClose: true,
      currentWeek: 6
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
        canEscapeKeyClose={this.state.canEscapeKeyClose}>
        <div className="pt-dialog-body">
          Thank you for  using unistats-alpha! If you have any problems please email:
          UP840877@myport.ac.uk or click the little help box in the top right hand corner!
          <br/>
          <br/>
          Thanks, Stephen
        </div>
      </Dialog>
    );
  }

  ProfileCards() {
    return (
      <div className={style.profileCardsWrapper}>
        <div className={`pt-card .pt-interactive .pt-elevation-2 ${style.profileCards}`}>
          <h4>Uni Week</h4>
          <h5>{this.state.currentWeek} / 24</h5>
        </div>
        <div className={`pt-card .pt-interactive .pt-elevation-2 ${style.profileCards}`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec dapibus et mauris,
          vitae dictum metus.
        </div>
        <div className={`pt-card .pt-interactive .pt-elevation-2 ${style.profileCards}`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec dapibus et mauris,
          vitae dictum metus.
        </div>
      </div>
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
        {this.ProfileCards()}
        profile {this.props.profile.email}
      </div>
    );
  }
}

Profile.propTypes = {
  client: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
};

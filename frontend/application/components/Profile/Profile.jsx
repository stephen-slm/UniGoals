import React from 'react';
import PropTypes from 'prop-types';

import { Dialog } from '@blueprintjs/core';
import ProfileNavigation from './ProfileNavigation';
import Tables from './Tables';

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
      currentWeek: this.getCurrentYearWeek(),
    };
  }

  getCurrentYearWeek() {
    const uniStartWeek = 38;
    let date = new Date();

    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
    const uniWeek = weekNo - uniStartWeek;

    return Math.abs(uniWeek);
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

  ProfileCards() {
    return (
      <div className={style.profileCardsWrapper}>
        <div className={`pt-card pt-interactive pt-elevation-2 ${style.profileCards}`}>
          <h4>Uni Week</h4>
            <h5>{this.state.currentWeek} / 24</h5>
        </div>
        <div className={`pt-card pt-interactive pt-elevation-2 ${style.profileCards}`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec dapibus et mauris,
          vitae dictum metus.
        </div>
        <div className={`pt-card pt-interactive pt-elevation-2 ${style.profileCards}`}>
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
        <Tables insertUnitRow={this.props.insertUnitRow} updateUnits={this.props.updateUnits} removeUnitRow={this.props.removeUnitRow} units={this.props.units} />
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
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dialog, Button } from '@blueprintjs/core';

import ProfileNavigation from './Navigation/ProfileNavigation';
import ProfileSummary from './ProfileSummary/ProfileSummary';
import Tables from './ProfileTables/Tables';
import toaster from '../../utils/toaster';

const style = require('./profile.less');

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.newUserDialog = this.newUserDialog.bind(this);
    this.addUniversityDetails = this.addUniversityDetails.bind(this);

    this.profile = this.props.profile;

    this.state = {
      isNew: this.profile.new,
      canEscapeKeyClose: false,

      courseYear: false,
      courseName: false,

    };
  }

  /**
   * When a user is first created, they are asked for there courseName and there courseYear
   * this will be asked every time until a valid courseName is passed, this will validate
   * if the course name is valid or not. (the database will also validate it) so if it
   * some how turns out to be invalid the user will have to reenter it when they login
   * again.
   */
  addUniversityDetails() {
    const courseName = this.universityCourse.value;
    const courseYear = this.universityYear.value;
    const courseYearNum = parseInt(this.universityYear.value, 10);

    let courseYearInvalid = false;
    let courseNameInvalid = false;

    if (_.isNil(courseYear) || _.isNaN(courseYear)
      || !_.isNumber(courseYearNum) || courseYear.length > 2) {
      courseYearInvalid = true;
    }

    if (_.isNil(courseName) || _.isNaN(courseName)
      || courseName.length < 5 || courseName.length > 50) {
      courseNameInvalid = true;
    }

    if (courseYearInvalid || courseNameInvalid) {
      return this.setState({
        courseYear: courseYearInvalid,
        courseName: courseNameInvalid,
      });
    }

    return this.props.firebase.addUniversityDetails(courseName, courseYear)
      .then(() => {
        const profile = Object.assign(this.props.profile, {
          course_name: courseName,
          course_year: courseYear,
        });

        this.props.updateProfile(profile);
        this.setState({ isNew: false });
      })
      .catch(error => toaster.danger(error));
  }

  /**
   * New user box for entering the courseName nad courseYear
   */
  newUserDialog() {
    return (
      <Dialog
        iconName="pt-icon-edit"
        title={`Welcome ${this.profile.name}`}
        isOpen={(this.state.isNew || !this.props.profile.course_name) && !this.props.exampleUser}
        onClose={this.addUniversityDetails}
        canEscapeKeyClose={this.state.canEscapeKeyClose}
      >
        <div className="pt-dialog-body">
          Thank you for  using UniGoals-alpha! If you have any problems please email:
          UP840877@myport.ac.uk or click the little help box in the top right hand corner!
          <strong> This box will only ever show once!</strong>
          <br /><br />
          For the time being please may you update the content below.
          <br /><br />
          Thanks,
          <br /><br />
          thinknet.xyz
          <br /><br />
          Below is some basic information needed to form your profile.
          Please fill this in and select continue.
          <br /><br />
          <div className={style.introductionInputs}>
            <input ref={(ref) => { this.universityCourse = ref; }} maxLength="50" className={`pt-input pt-fill ${(this.state.courseName) ? 'pt-intent-danger' : ''}`} type="text" placeholder="University Course" dir="auto" />
            <div className="pt-select pt-fill">
              <select ref={(ref) => { this.universityYear = ref; }} className={`${(this.state.courseYear) ? 'pt-intent-danger' : ''}`}>
                <option selected>{(this.state.courseName) ? 'Please Select a University Year' : 'University Year...'}</option>
                <option value="1">Year One</option>
                <option value="2">Year Two</option>
                <option value="3">Year Three</option>
                <option value="4">Year Four</option>
                <option value="5+">Year Five Plus</option>
              </select>
            </div>
          </div>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              className="pt-minimal"
              onClick={this.addUniversityDetails}
              text="Continue"
            />
          </div>
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
          profile={this.profile}
          notifications={this.props.notifications}
          updateNotifications={this.props.updateNotifications}
          removeNotification={this.props.removeNotification}
          exampleUser={this.props.profile.exampleUser}
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
          exampleUser={this.props.profile.exampleUser}
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

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dialog, Button, MenuItem, Classes } from '@blueprintjs/core';
import { Select } from '@blueprintjs/labs';

import toaster from '../../../utils/toaster';
import { courseNames, courseYears, universitiesList } from './courseData';

const style = require('./profileNewUser.less');

export default class ProfileNewUser extends React.Component {
  static filterCourse(query, course, index) {
    return `${index + 1}. ${course.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
  }

  static renderCourseMenuItem(ISelectItemRendererProps) {
    const {
      handleClick,
      item: course,
      isActive,
    } = ISelectItemRendererProps;

    return (
      <MenuItem
        className={isActive ? Classes.INTENT_PRIMARY : ''}
        key={course}
        onClick={handleClick}
        text={course}
      />
    );
  }

  constructor(props) {
    super(props);

    this.addUniversityDetails = this.addUniversityDetails.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleValueChangeYear = this.handleValueChangeYear.bind(this);
    this.handleValueChangeUni = this.handleValueChangeUni.bind(this);

    this.state = {
      canEscapeKeyClose: false,
      year: this.props.profile.course_year || null,
      course: this.props.profile.course_name || null,
      university: this.props.profile.course_university || null,
      minimal: false,

      invalidCourseName: false,
      invalidCourseYear: false,
      invalidCourseUni: false,

    };
  }

  handleValueChange(course) {
    this.setState({
      course,
    });
  }

  handleValueChangeYear(year) {
    this.setState({
      year,
    });
  }

  handleValueChangeUni(university) {
    this.setState({
      university,
    });
  }

  /**
   * When a user is first created, they are asked for there courseName and there courseYear
   * this will be asked every time until a valid courseName is passed, this will validate
   * if the course name is valid or not. (the database will also validate it) so if it
   * some how turns out to be invalid the user will have to reenter it when they login
   * again.
   */
  addUniversityDetails() {
    const courseName = this.state.course;
    const courseYear = this.state.year;
    const courseUniversity = this.state.university;
    const courseYearNum = parseInt(this.universityYear, 10);

    let invalidCourseName = false;
    let invalidCourseYear = false;
    let invalidCourseUni = false;

    if (_.isNil(courseYear) || _.isNaN(courseYear)
      || !_.isNumber(courseYearNum) || courseYear.length > 2) {
      invalidCourseYear = true;
    }

    if (_.isNil(courseName) || _.isNaN(courseName)
      || courseName.length < 5 || courseName.length > 50) {
      invalidCourseName = true;
    }

    if (_.isNil(courseUniversity) || _.isNaN(courseUniversity)
    || courseUniversity.length < 5 || courseUniversity.length > 50) {
      invalidCourseUni = true;
    }

    if (invalidCourseUni || invalidCourseName || invalidCourseYear) {
      return this.setState({
        invalidCourseName,
        invalidCourseYear,
        invalidCourseUni,
      });
    }

    return this.props.firebase.addUniversityDetails(courseName, courseYear, courseUniversity)
      .then(() => {
        const profile = Object.assign(this.props.profile, {
          course_name: courseName,
          course_year: courseYear,
          course_university: courseUniversity,
        });

        this.props.updateProfile(profile);
      })
      .catch(error => toaster.danger(error));
  }

  render() {
    const {
      course,
      year,
      university,
      minimal,
    } = this.state;

    const { profile } = this.props;

    let isOpen = false;

    if (!profile.course_name
    || !profile.course_year
    || profile.new
    || this.props.exampleUser
    || !profile.course_university) {
      isOpen = true;
    }

    return (
      <Dialog
        iconName="pt-icon-edit"
        title={`Welcome ${profile.name}`}
        isOpen={isOpen}
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
          UniGoals
          <br /><br />
          Below is some basic information needed to form your profile.
          Please fill this in and select continue.
          <br /><br />
          <div className={style.introductionInputs}>
            <div>
              <Select
                items={universitiesList}
                noResults={<MenuItem disabled text="No results." />}
                itemRenderer={ProfileNewUser.renderCourseMenuItem}
                itemPredicate={ProfileNewUser.filterCourse}
                onItemSelect={this.handleValueChangeUni}
                popoverProps={{ minimal }}
              >
                <Button className={`pt-fill pt-minimal ${(this.state.invalidCourseUni) ? 'pt-intent-danger' : ''}`} rightIconName="caret-down" text={_.defaultTo(university, 'Select a University')} />
              </Select>
            </div>
            <div>
              <Select
                items={courseYears}
                noResults={<MenuItem disabled text="No results." />}
                itemRenderer={ProfileNewUser.renderCourseMenuItem}
                itemPredicate={ProfileNewUser.filterCourse}
                onItemSelect={this.handleValueChangeYear}
                popoverProps={{ minimal }}
              >
                <Button className={`pt-fill pt-minimal ${(this.state.invalidCourseYear) ? 'pt-intent-danger' : ''}`} rightIconName="caret-down" text={_.defaultTo(year, 'Select a University Year')} />
              </Select>
            </div>
            <div>
              <Select
                items={courseNames}
                noResults={<MenuItem disabled text="No results." />}
                itemRenderer={ProfileNewUser.renderCourseMenuItem}
                itemPredicate={ProfileNewUser.filterCourse}
                onItemSelect={this.handleValueChange}
                popoverProps={{ minimal }}
              >
                <Button className={`pt-fill pt-minimal ${(this.state.invalidCourseName) ? 'pt-intent-danger' : ''}`} rightIconName="caret-down" text={_.defaultTo(course, 'Select a University Course')} />
              </Select>
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
}

ProfileNewUser.propTypes = {
  firebase: PropTypes.shape().isRequired,
  updateProfile: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    course_name: PropTypes.string,
    course_year: PropTypes.string,
    course_university: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
  exampleUser: PropTypes.bool,
};

ProfileNewUser.defaultProps = {
  exampleUser: false,
};

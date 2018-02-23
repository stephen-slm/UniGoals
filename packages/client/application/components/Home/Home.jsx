import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';

import Tables from '../Tables/Tables';
import Summary from '../Summary/Summary';
import NewUser from '../Utilities/NewUser';

const styles = () => {};

class Home extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.generateTab = this.generateTab.bind(this);

    this.state = {
      selectedId: '',
    };
  }

  componentWillReceiveProps(props) {
    if (Object.keys(props.years).indexOf(this.state.selectedId) === -1) {
      this.setState({
        selectedId: Object.keys(props.years)[Object.keys(props.years).length - 1],
      });
    }
  }

  handleChange(event, value) {
    this.setState({ selectedId: value });
  }

  generateTab(year, index) {
    return (
      <div>
        <NewUser
          yearIndex={index}
          profile={this.props.profile}
          firebase={this.props.firebase}
          updateProfile={this.props.updateProfile}
        />
        <Summary
          insertNewYear={this.props.insertNewYear}
          removeYear={this.props.removeYear}
          updateYearTitle={this.props.updateYearTitle}
          firebase={this.props.firebase}
          units={year.units}
          profile={this.props.profile}
          history={this.props.history}
          yearIndex={index}
          yearTitle={year.title}
        />
        <Tables
          yearIndex={index}
          insertUnitRow={this.props.insertUnitRow}
          updateYears={this.props.updateYears}
          updateRowContent={this.props.updateRowContent}
          removeUnitRow={this.props.removeUnitRow}
          updateUnitTitle={this.props.updateUnitTitle}
          addUnitTable={this.props.addUnitTable}
          removeUnitTable={this.props.removeUnitTable}
          firebase={this.props.firebase}
          units={year.units}
        />
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Tabs
          scrollable
          scrollButtons="off"
          value={this.state.selectedId}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          {_.map(this.props.years, (year, index) => (
            <Tab value={index} key={index} label={year.title} />
          ))}
        </Tabs>
        {this.state.selectedId !== '' &&
          this.generateTab(this.props.years[this.state.selectedId], this.state.selectedId)}
      </div>
    );
  }
}

Home.propTypes = {
  years: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  updateYearTitle: PropTypes.func.isRequired,
  firebase: PropTypes.shape({}).isRequired,
  updateYears: PropTypes.func.isRequired,
  insertNewYear: PropTypes.func.isRequired,
  removeYear: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    course_name: PropTypes.string,
    new: PropTypes.bool,
  }).isRequired,
};

Home.defaultProps = {};

export default withStyles(styles)(Home);

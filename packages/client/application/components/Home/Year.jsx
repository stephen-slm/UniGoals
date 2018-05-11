import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router';

import Tables from '../Tables/Tables';
import Summary from '../Summary/Summary';

const styles = () => {};

class Year extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      selectedId: props.match.params.yearIndex,
    };
  }

  handleChange(event, value) {
    this.setState({ selectedId: value });
  }

  render() {
    const { classes } = this.props;

    const yearIndex = Object.keys(this.props.years)[this.state.selectedId - 1];
    const year = this.props.years[yearIndex];

    return (
      <div className={classes.root}>
        <Summary
          removeYear={this.props.removeYear}
          updateYearTitle={this.props.updateYearTitle}
          firebase={this.props.firebase}
          units={year.units}
          profile={this.props.profile}
          history={this.props.history}
          yearIndex={yearIndex}
          yearTitle={year.title}
        />
        <Tables
          setUnitDoubleWeightStatus={this.props.setUnitDoubleWeightStatus}
          insertUnitRow={this.props.insertUnitRow}
          yearIndex={yearIndex}
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
}

Year.propTypes = {
  years: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      yearIndex: PropTypes.string,
    }),
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  updateYearTitle: PropTypes.func.isRequired,
  firebase: PropTypes.shape({}).isRequired,
  updateYears: PropTypes.func.isRequired,
  removeYear: PropTypes.func.isRequired,
  setUnitDoubleWeightStatus: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    course_name: PropTypes.string,
    new: PropTypes.bool,
  }).isRequired,
};

Year.defaultProps = {};

export default withRouter(withStyles(styles)(Year));

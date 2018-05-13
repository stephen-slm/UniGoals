import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  root: {
    justifyContent: 'center',
  },
});

const UnitSummaryButtons = (props) => (
  <FormGroup row className={props.classes.root}>
    <FormControlLabel control={<Checkbox checked={props.isDoubleWeighted} onChange={props.onDoubleClick} />} label="Double Weighted" />
    <FormControlLabel
      control={<Checkbox checked={props.isDroppedUnit} onChange={props.onDroppedClick} color="primary" />}
      label="Dropped Unit"
    />
  </FormGroup>
);

UnitSummaryButtons.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
  }).isRequired,
  isDoubleWeighted: PropTypes.bool,
  isDroppedUnit: PropTypes.bool,
  onDoubleClick: PropTypes.func.isRequired,
  onDroppedClick: PropTypes.func.isRequired,
};

UnitSummaryButtons.defaultProps = {
  isDoubleWeighted: false,
  isDroppedUnit: false,
};

export default withStyles(styles)(UnitSummaryButtons);

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    height: theme.spacing.unit * 15,
    width: theme.spacing.unit * 18,
    opacity: '0.3',
    color: 'grey',
    cursor: 'pointer',
  },
  addPreview: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(100%)',
  },
});

class YearPreviewAdd extends React.Component {
  constructor(props) {
    super(props);

    this.insertNewYear = this.insertNewYear.bind(this);
  }

  insertNewYear() {
    this.props.firebase
      .insertNewYear()
      .then(year => this.props.insertNewYear(year.yearKey, year.title, year.unitKey))
      .catch(error => console.log(error.message));
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.root} onClick={this.insertNewYear}>
        <CardContent>
          <Typography className={classes.addPreview} variant="subheading">
            Add
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

YearPreviewAdd.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    insertNewYear: PropTypes.func,
  }).isRequired,
  insertNewYear: PropTypes.func.isRequired,
};

YearPreviewAdd.defaultProps = {};

export default withStyles(styles)(YearPreviewAdd);

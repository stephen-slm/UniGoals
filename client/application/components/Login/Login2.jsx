import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';

import * as homePageData from './homePageData';
import * as constants from '../../utils/constants';

import Summary from '../Summary/Summary';
import UnitTable from '../Table/Table';

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 7,
  },
  card: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 300,
    maxWidth: '60%',
    margin: '0 auto',
  },
  text: {
    textAlign: 'justify',
  },
});

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      isExample: true,
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <img style={{ height: 150 }} src="components/resources/images/logo.svg" alt="Logo" />
        <Typography variant="display1" gutterBottom>
          UniGoals
        </Typography>
        <Typography variant="subheading" gutterBottom>
          <Typography component="p">
            Full Course &amp; Unit tracking<br />built by a University{' '}
            <a
              href="https://www.linkedin.com/in/stephen-lineker-miller/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Student
            </a>{' '}
            for University Students
            <br />
            Version: {this.props.version}
          </Typography>
        </Typography>
        <Button variant="raised" color="primary" onClick={this.handleClick}>
          Login | Register
        </Button>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.text} compnent="p">
              UniGoals is a modern University unit tracking tool designed to let you know where you
              currently stand on your course. Using quick and simple percentages charts to provide
              fast and accurate content about your course. Simply add your units with there
              weighting (e.g.coursework, exam, presentations, etc) and quickly see your current
              percent, average and total maximum grade! Real-time instant results.
            </Typography>
            <Summary
              units={homePageData.units}
              profile={homePageData.profile}
              history={this.props.history}
              isExample={this.state.isExample}
              yearIndex="Year 1"
              yearTitle="Example Year"
            />
            <Typography className={classes.text} compnent="p">
              Your own unqiue summary page that displays everything you need to quickly know about
              your units! Including your <strong>unit ranks</strong>, how they are compared to other
              units, <strong> Average</strong>, <strong>Max</strong> and
              <strong>Total Grade</strong>. Try hovering over the chart and percentages. Each unit
              looks like the one below, providing a <strong>Title</strong>,
              <strong>Name</strong>, <strong>Weighting</strong>, and
              <strong> Achieved</strong> column. Filling these will allow you to make the most of
              the site. The chart and percentages will also update in real time as you update the
              rows.
            </Typography>
            <UnitTable
              yearIndex="example"
              tableIndex="example"
              firebase={this.props.firebase}
              unit={homePageData.units[Object.keys(homePageData.units)[2]]}
              isExample={this.state.isExample}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
}

Login.propTypes = {
  firebase: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  version: PropTypes.string.isRequired,
};

export default withStyles(styles)(Login);

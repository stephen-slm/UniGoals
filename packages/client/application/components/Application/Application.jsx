import { BrowserRouter as Router, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import PropTypes from 'prop-types';
import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as routePaths from './routePaths';

import { PropsRoute, PrivateRoute } from '../Routes';

import Profile from '../Profile';
import Notifications from '../Notifications/Notifications';
import Navigation from '../Navigation/Navigation';
import Login from '../Login/Login';
import Years from '../Home/Years';

// Year
import Year from '../Home/Year';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#F6511D',
    }, // This is just green.A700 as hex.
    secondary: {
      main: '#00A6ED',
    }, // Purple and green play nicely together.
  },
});

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.routePaths = routePaths;
    this.history = createBrowserHistory();
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <Switch>
            <PropsRoute exact path="/" component={Login} {...this.props} />
            <PropsRoute exact path="/login" component={Login} {...this.props} />
            <Navigation
              history={this.history}
              routePaths={this.routePaths}
              profile={this.props.profile}
              removeProfile={this.props.removeProfile}
              firebase={this.props.firebase}
              version={this.props.version}
              displayHelp={this.props.displayHelp}
              showHelpBox={this.props.showHelpBox}
            >
              <PrivateRoute path="/home" component={Years} {...this.props} />
              <PrivateRoute path="/notifications" component={Notifications} {...this.props} />
              <PrivateRoute
                path="/profile"
                component={Profile}
                profile={this.props.profile}
                firebase={this.props.firebase}
                updateProfile={this.props.updateProfile}
              />
              <PrivateRoute path="/settings" component={Years} {...this.props} />
              <PrivateRoute path="/year/:yearIndex" component={Year} {...this.props} />
            </Navigation>
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }

  // render() {
  //   const {
  //     removeProfile,
  //     profile,
  //     notifications,
  //     years,
  //     updateYears,
  //     removeUnitRow,
  //     removeYear,
  //     insertUnitRow,
  //     insertNewYear,
  //     updateRowContent,
  //     updateUnitTitle,
  //     addUnitTable,
  //     removeUnitTable,
  //     updateNotifications,
  //     removeNotification,
  //     updateYearTitle,
  //     updateProfile,
  //     version,
  //     firebase,
  //     displayHelp,
  //     showHelpBox,
  //   } = this.props;

  //   if (!_.isNil(profile.name)) {
  //     return (
  //       <Router>
  //         <MuiThemeProvider theme={theme}>
  //           <Navigation
  //             history={this.history}
  //             routePaths={this.routePaths}
  //             profile={profile}
  //             removeProfile={removeProfile}
  //             firebase={firebase}
  //             version={version}
  //             displayHelp={displayHelp}
  //             showHelpBox={showHelpBox}
  //           >
  //             <Route
  //               exact
  //               path={this.routePaths.home}
  //               render={() => (
  //                 <Home
  //                   years={years}
  //                   firebase={firebase}
  //                   profile={profile}
  //                   updateProfile={updateProfile}
  //                   insertNewYear={insertNewYear}
  //                 />
  //               )}
  //             />
  //             <Route
  //               path={this.routePaths.notifications}
  //               render={() => (
  //                 <Notifications
  //                   updateNotifications={updateNotifications}
  //                   removeNotification={removeNotification}
  //                   notifications={notifications}
  //                   showHelpBox={showHelpBox}
  //                   firebase={firebase}
  //                 />
  //               )}
  //             />
  //             <Route
  //               path="/year/:yearIndex"
  //               render={() => (
  //                 <Year
  //                   insertUnitRow={insertUnitRow}
  //                   history={this.history}
  //                   profile={profile}
  //                   years={years}
  //                   updateYears={updateYears}
  //                   removeYear={removeYear}
  //                   updateYearTitle={updateYearTitle}
  //                   removeUnitRow={removeUnitRow}
  //                   updateRowContent={updateRowContent}
  //                   updateUnitTitle={updateUnitTitle}
  //                   addUnitTable={addUnitTable}
  //                   removeUnitTable={removeUnitTable}
  //                   firebase={firebase}
  //                 />
  //               )}
  //             />
  //           </Navigation>
  //         </MuiThemeProvider>
  //       </Router>
  //     );
  //   }

  //   return (
  //     <Router>
  //       <MuiThemeProvider theme={theme}>
  //         <div>
  //           <Route
  //             exact
  //             path="*"
  //             render={() => (
  //               <Login
  //                 updateProfile={this.props.updateProfile}
  //                 updateNotifications={this.props.updateNotifications}
  //                 updateYearTitle={this.props.updateYearTitle}
  //                 firebase={this.props.firebase}
  //                 updateYears={this.props.updateYears}
  //                 history={this.history}
  //                 version={version}
  //               />
  //             )}
  //           />
  //         </div>
  //       </MuiThemeProvider>
  //     </Router>
  //   );
}

Application.propTypes = {
  displayHelp: PropTypes.bool.isRequired,
  showHelpBox: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
  firebase: PropTypes.shape().isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateYearTitle: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  removeProfile: PropTypes.func.isRequired,
  updateYears: PropTypes.func.isRequired,
  profile: PropTypes.shape().isRequired,
  removeNotification: PropTypes.func.isRequired,
  removeYear: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  insertNewYear: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  notifications: PropTypes.shape().isRequired,
  years: PropTypes.shape({}),
};

Application.defaultProps = {
  years: {},
};

import * as _ from 'lodash';

import * as adminbase from './components/adminbase';

const sampleNotification: adminbase.IUniNotification = {
  message: `You can now mark units as double weighted or dropped, allowing you to get a more accurate final result!`,
  timestamp: Date.now(),
  title: 'Double Weighted/Dropped Units!',
};

adminbase.deployNotification(sampleNotification, false);

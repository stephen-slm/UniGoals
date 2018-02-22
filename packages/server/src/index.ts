import * as _ from 'lodash';

import * as adminbase from './components/adminbase';

const sampleNotification: adminbase.IUniNotification = {
  message: `You can now create years! Check it out <a target=_blank href=>here</a>!
Allowing you to plan for the following year
without deleting your current units!`,
  timestamp: Date.now(),
  title: 'Years!',
};

adminbase.deployNotification(sampleNotification, true);

import * as _ from 'lodash';

import * as adminbase from './components/adminbase';

const sampleNotification: adminbase.IUniNotification  = {
  timestamp: Date.now(),
  message: `You can now create years! Check it out <a href="https://i.imgur.com/X2btVVJ.gifv">here</a>`,
  title: 'Years!',
};

adminbase.deployNotification(sampleNotification, true);

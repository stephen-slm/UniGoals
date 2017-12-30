import * as adminbase from './components/adminbase';

const sampleNotification: adminbase.IUniNotification  = {
  timestamp: Date.now(),
  message: 'New version! minor bug fixes, adjusted\nmathematics around maximum grade and reversed\nthe notification order to display newest first',
  title: 'Version: 0.0.6',
};

adminbase.deployNotification(sampleNotification, false);

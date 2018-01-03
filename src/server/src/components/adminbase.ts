import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import * as readline from 'readline';
import { logger } from './logger';

/**
 * When the user size will get too big we will have to begin by doing some form of biniary search
 * to filter down to our selected user
 */

import * as adminService from './serviceAccount';

const serviceAccount: any = adminService.serviceAccount;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export interface IUniNotification {
  message: string;
  timestamp: number;
  title: string;
}

export interface IUniKeyObject {
  uid: string;
  profile: IUniProfile;
}

export interface IUniProfile {
  course_name: string;
  course_university: string;
  course_year: string;
  email: string;
  family_name: string;
  given_name: string;
  hd: string;
  last_login: number;
  name: string;
  picture: string;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://organic-lacing-185810.firebaseio.com',
});

export const database = admin.database();

/**
 * This will deploy a notification to every single user in the database
 * @param notification The notification to deploy to all users
 * @param debug?  if true it will only deploy to the admin account
 */
export function deployNotification(notification: IUniNotification, debug: boolean = false): void {
  if (debug) {
    insertNotification(notification, 'ymzDhOAX50e5jRAMiWDApNkgNHd2');
  } else {
    getAllUserKeys((keys: IUniKeyObject[]) => {
      logger.info(`\nInserting new notification\n\ntitle: ${notification.title}` +
      `\nMessage: ${notification.message}\nUsers: ${keys.length}\n`);

      rl.question(`Are you sure you want to send ${keys.length} users the above notification? y/n: `, (answer: string) => {
        const lowerAnswer = answer.toLowerCase();

        if (lowerAnswer === 'yes' || lowerAnswer === 'y') {
          _.forEach(keys, (key: IUniKeyObject) => {
            logger.info(`Inserted new notification for user ${key.profile.name}`);
            insertNotification(notification, key.uid);
          });
        }
      });
    });
  }
}

/**
 * Stores a single notification for a selected user
 * @param notification The notification to send
 * @param userUid The users uid who is getting the notification
 */
export function insertNotification(notification: IUniNotification, userUid: string): string {
  const insertingWelcomeNotification = database.ref(`users/${userUid}/notifications`);

  const insertingNotificationKey = insertingWelcomeNotification.push(notification);
  return insertingNotificationKey.key;
}

/**
 * Gets all the users keys that are used for reference when deploying updates or notifications
 * @param callback the call back containing all the users uids
 */
export function getAllUserKeys(callback: (content: IUniKeyObject[]) => void) {
  const usersRef = database.ref('/users');

  usersRef.once('value', (snapshot) => {
    const users = snapshot.val();

    const keys: IUniKeyObject[] = _.map(users, (user: { profile: IUniProfile }, index: string) => {
      return {
        profile: user.profile,
        uid: index,
      };
    });

    callback(keys);
  });
}

/**
 * This will get the users key that relates to the users email, allowing to target just that user
 * @param email the users email addresss
 */
export function getKeyByEmail(email: string, callback: (content: IUniKeyObject | null) => void) {
  getAllUserKeys((users: IUniKeyObject[]) => {
    _.forEach(users, (user, index) => {
      if (user.profile.email === email) {
        callback(user);
      } else if (index === users.length) {
        callback(null);
      }
    });
  });
}

/**
 * This will get the users key that relates to the users fuull name, allowing to target just that user
 * @param name The users full name
 */
export function getKeyByFullName(name: string, callback: (content: IUniKeyObject | null) => void) {
  getAllUserKeys((users: IUniKeyObject[]) => {
    _.forEach(users, (user, index) => {
      if (user.profile.name === name) {
        callback(user);
      } else if (index === users.length) {
        callback(null);
      }
    });
  });
}

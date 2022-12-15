import fcm from "../notification.cjs";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { ObjectId } from "mongoose";
const token =
  // eslint-disable-next-line max-len
  "cNkaHpkEvLgtUsIenOseE4:APA91bFz0c0A1TZzwGOG8Z8OCBexVQgg75QG4EwOxWtkC9god1pAKmu3p52CWa3vYVLOF5bQkR7y2rsByrYpLy7IhBiTvZduAZJt9dkrKF9R5n1lcLCuBOabhdlTV4id5Pxpz6Hk8KGp";
export const sendMessage = () => {
  const message1 = {
    to: token,

    notification: {
      title: "Zeyad from nodeeee",
      data: JSON.stringify({ Link: "Test again Link" }),
    },
  };
  const message = {
    to: token,
    data: {
      val: JSON.stringify({
        title: "Test notification from node",
        body: "Test body from node again newwwww",
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon",
      }),
    },
  };

  fcm.send(message1, (err, response) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(response);
    }
  });
};

/**
 * A service function used to add the access token to user to subscribe at the notifications
 * @param {ObjectID} userId the id of the user to subscribe
 * @param {String} type the type whether flutter or web
 * @param {Token} accessToken the accessToken from firebase
 * @returns {void}
 */
export async function subscribeNotification(userId, type, accessToken) {
  const neededUser = await User.findById(userId);
  if (!neededUser || neededUser.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  if (type === "web") {
    neededUser.webNotificationToken = accessToken;
  } else {
    neededUser.flutterNotificationToken = accessToken;
  }
  await neededUser.save();
}

/**
 * A service function used to remove the access token from user to unsubscribe at the notifications
 * @param {ObjectID} userId the id of the user to unsubscribe
 * @param {String} type the type whether flutter or web
 * @returns {void}
 */
export async function unsubscribeNotification(userId, type) {
  const neededUser = await User.findById(userId);
  if (!neededUser || neededUser.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  if (type === "web") {
    neededUser.webNotificationToken = undefined;
  } else {
    neededUser.flutterNotificationToken = undefined;
  }
  await neededUser.save();
}

/**
 * A service function used to send notification to a user
 * @param {User} user The user to send notification
 * @param {String} title the title of the notification
 * @param {String} data the data of the notification
 * @returns {void}
 */
async function sendNotification(user, title, data) {
  const message = {
    notification: {
      title: title,
      data: data,
    },
  };
  if (user.webNotificationToken) {
    message.to = user.webNotificationToken;
    fcm.send(message, (err, response) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Sent web");
        console.log(response);
      }
    });
  }
  if (user.flutterNotificationToken) {
    message.to = user.flutterNotificationToken;

    fcm.send(message, (err, response) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Sent flutter");
        console.log(response);
      }
    });
  }
}

/**
 * A service function used to create a notification and send it
 * @param {String} followingUsername The following username
 * @param {ObjectID} followedUserId the id of the followed user Id
 * @returns {void}
 */
export async function createFollowUserNotification(
  followingUsername,
  followedUserId
) {
  const neededUser = await User.findById(followedUserId);
  if (!neededUser || neededUser.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const notification = await new Notification({
    ownerId: followedUserId,
    type: "Follow",
    data: `${followingUsername} followed you!`,
    link: `${process.env.FRONT_BASE}/user/${followingUsername}`,
    date: Date.now(),
  }).save();
  // console.log(notification);
  const title = `${followingUsername} followed you!`;
  const data = {
    data: `${followingUsername} followed you!`,
    notificationId: notification._id,
    link: notification.link,
    createdAt: notification.date,
  };
  await sendNotification(neededUser, title, JSON.stringify(data));
}

/**
 * A service function used to mark all the notifications as read
 * @param {ObjectID} userId The user id
 * @returns {void}
 */
export async function markAllNotificationsRead(userId) {
  // console.log(userId);
  const result = await Notification.updateMany(
    { ownerId: userId, read: false },
    { $set: { read: true } }
  );
  console.log(
    // eslint-disable-next-line max-len
    `Matched ${result.matchedCount} document, updated ${result.modifiedCount} document`
  );
}

/**
 * A service function used to mark a notification as read
 * @param {ObjectID} userId The user id
 * @param {ObjectID} notificationId The id of the notifcation
 * @returns {void}
 */
export async function markNotificationRead(userId, notificationId) {
  // console.log(userId);
  const notification = await Notification.findById(notificationId);
  // console.log(notification);
  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }
  if (notification.ownerId.toString() !== userId) {
    const error = new Error(
      "User unauthorized to mark this notification as read"
    );
    error.statusCode = 401;
    throw error;
  }
  notification.read = true;
  await notification.save();
}

/**
 * A service function used to mark a notification as hidden
 * @param {ObjectID} userId The user id
 * @param {ObjectID} notificationId The id of the notifcation
 * @returns {void}
 */
export async function markNotificationHidden(userId, notificationId) {
  // console.log(userId);
  const notification = await Notification.findById(notificationId);
  // console.log(notification);
  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }
  if (notification.ownerId.toString() !== userId) {
    const error = new Error(
      "User unauthorized to mark this notification as read"
    );
    error.statusCode = 401;
    throw error;
  }
  notification.hidden = true;
  await notification.save();
}
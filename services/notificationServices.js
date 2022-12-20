import fcm from "../notification.cjs";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import { prepareLimit } from "../utils/prepareLimit.js";

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
    fcm.send(message, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Sent web to " + user.username);
      }
    });
  }
  if (user.flutterNotificationToken) {
    message.to = user.flutterNotificationToken;

    fcm.send(message, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Sent flutter to " + user.username);
      }
    });
  }
}

/**
 * A service function used to create a follow notification and send it
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
  const title = `${followingUsername} followed you!`;
  const notification = await new Notification({
    ownerId: followedUserId,
    type: "Follow",
    data: title,
    link: `${process.env.FRONT_BASE}/user/${followingUsername}`,
    date: Date.now(),
  }).save();
  const data = {
    data: title,
    notificationId: notification._id,
    link: notification.link,
    createdAt: notification.date,
  };
  await sendNotification(neededUser, title, JSON.stringify(data));
}

/**
 * A service function used to create a  comment notification and send it
 * @param {Comment} comment The created comment
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function createCommentNotification(comment) {
  await comment.populate("parentId");
  await comment.populate("postId");
  let parent, user;

  // prepare the title
  let title1 = comment.ownerUsername;
  let title2 = comment.ownerUsername;
  let title3 = comment.ownerUsername;
  let title4 = comment.ownerUsername;
  if (comment.parentType === "comment") {
    title1 += " replied to your comment!";
    title2 += " replied to a comment you are following!";
    title3 += " replied to a comment in your post!";
    title4 += " replied to a comment in a post you are following!";
    parent = await Comment.findById(comment.parentId);
  } else {
    parent = await Post.findById(comment.parentId);
    title1 += " commented on your post!";
    title2 += " commented on a post you are following!";
  }
  // get the owner of the parent to send notification
  user = await User.findById(parent.ownerId);
  // eslint-disable-next-line max-len
  const link1 = `${process.env.FRONT_BASE}/user/${
    comment.postId.ownerUsername
  }/comments/${comment.postId._id.toString()}/${comment.postId.title}`;

  // CHECK HERE FOR THE POST REPLIES
  // send notification to parent owner
  if (comment.ownerId.toString() !== parent.ownerId.toString()) {
    // Check the parent type to make sure if it is a post that it allows sendReplies
    if (comment.parentType === "post") {
      if (parent.sendReplies === true) {
        const notification = await new Notification({
          ownerId: parent.ownerId,
          type: "Comment",
          data: title1,
          link: link1,
          date: Date.now(),
        }).save();

        const data1 = {
          data: title1,
          notificationId: notification._id,
          link: notification.link,
          createdAt: notification.date,
        };
        // send the notification to the owner of the parent
        await sendNotification(user, title1, JSON.stringify(data1));
      }
    } else {
      const notification = await new Notification({
        ownerId: parent.ownerId,
        type: "Comment",
        data: title1,
        link: link1,
        date: Date.now(),
      }).save();

      const data1 = {
        data: title1,
        notificationId: notification._id,
        link: notification.link,
        createdAt: notification.date,
      };
      // send the notification to the owner of the parent
      await sendNotification(user, title1, JSON.stringify(data1));
    }
  }
  await parent.populate("followingUsers.userId");

  // send notification to parent followers
  for (let i = 0; i < parent.followingUsers.length; i++) {
    const notification2 = await new Notification({
      ownerId: parent.followingUsers[i].userId._id,
      type: "Comment",
      data: title2,
      link: link1,
      date: Date.now(),
    }).save();
    const data2 = {
      data: title2,
      notificationId: notification2._id,
      link: notification2.link,
      createdAt: notification2.date,
    };
    await sendNotification(
      parent.followingUsers[i].userId,
      title2,
      JSON.stringify(data2)
    );
  }
  // send notification to post owner and post followers if the parent was a comment
  if (comment.parentType === "comment") {
    if (comment.postId.ownerId.toString() !== comment.ownerId.toString()) {
      if (comment.postId.sendReplies) {
        const notification3 = await new Notification({
          ownerId: comment.postId.ownerId,
          type: "Comment",
          data: title3,
          link: link1,
          date: Date.now(),
        }).save();
        const data3 = {
          data: title3,
          notificationId: notification3._id,
          link: notification3.link,
          createdAt: notification3.date,
        };

        const postOwnerUser = await User.findById(comment.postId.ownerId);
        await sendNotification(postOwnerUser, title3, JSON.stringify(data3));
      }
    }
    await comment.populate("postId.followingUsers.userId");
    // send notification to post follwers
    for (let i = 0; i < comment.postId.followingUsers.length; i++) {
      const notification4 = await new Notification({
        ownerId: comment.postId.followingUsers[i].userId._id,
        type: "Comment",
        data: title4,
        link: link1,
        date: Date.now(),
      }).save();
      const data4 = {
        data: title4,
        notificationId: notification4._id,
        link: notification4.link,
        createdAt: notification4.date,
      };
      await sendNotification(
        comment.postId.followingUsers[i].userId,
        title4,
        JSON.stringify(data4)
      );
    }
  }
}

/**
 * A service function used to mark all the notifications as read
 * @param {ObjectID} userId The user id
 * @returns {void}
 */
export async function markAllNotificationsRead(userId) {
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
  const notification = await Notification.findById(notificationId);
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
  const notification = await Notification.findById(notificationId);
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

/**
 * A Service function used to get the subreddit muted users for the controller
 * @param {Number} limitReq the limit identified in the request
 * @param {ObjectID} beforeReq Before id
 * @param {ObjectID} afterReq After id
 * @param {Subreddit} subreddit The subreddit object
 * @returns {preparedResponse} the prepared response for the controller
 */
// eslint-disable-next-line max-statements
export async function getUserNotifications(
  limitReq,
  beforeReq,
  afterReq,
  userId
) {
  let preparedResponse = {
    unreadCount: 0,
    children: [],
  };
  let skipValue;
  let limit = prepareLimit(limitReq);

  if (!beforeReq && !afterReq) {
    skipValue = 0;
  } else if (beforeReq && afterReq) {
    const error = new Error("Can't set before and after");
    error.statusCode = 400;
    throw error;
  } else if (beforeReq) {
    skipValue = 0;
  } else {
    skipValue = parseInt(afterReq);
    if (isNaN(skipValue)) {
      skipValue = 0;
    }
  }

  const notifcations = await Notification.find({
    ownerId: userId,
    hidden: false,
  })
    .sort({ date: -1 })
    .skip(skipValue)
    .limit(limit);

  preparedResponse.after = notifcations.length + skipValue;

  notifcations.forEach((notification) => {
    preparedResponse.children.push({
      id: notification._id,
      title: notification.data,
      type: notification.type,
      link: notification.link,
      sendAt: notification.date,
      isRead: notification.read,
    });
    if (notifcations.read === false) {
      preparedResponse.unreadCount++;
    }
  });

  return preparedResponse;
}

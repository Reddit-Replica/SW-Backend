import fcm from "../notification.cjs";
import User from "../models/User.js";
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
 * @param {ObjectID} userId the prepared flair object
 * @param {String} type the subreddit to which that flair is created
 * @param {Token} accessToken the subreddit to which that flair is created
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

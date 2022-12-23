import {
  subscribeNotification,
  unsubscribeNotification,
  sendNotification,
  getUserNotifications,
  markNotificationHidden,
  markNotificationRead,
  markAllNotificationsRead,
  createFollowUserNotification,
} from "../../services/notificationServices.js";

import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";

describe("Testing notificationServices file", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await Notification.deleteMany({});
    await User.deleteMany({});
    closeDatabaseConnection();
  });

  describe("Testing subscribeNotification", () => {
    it("Deleted user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      await expect(
        subscribeNotification(user._id.toString(), "web", "token")
      ).rejects.toThrow("User not found");
    });

    it("existing user web", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      await subscribeNotification(user._id.toString(), "web", "token");
      const userUpdated = await User.findById(user._id);
      expect(userUpdated.webNotificationToken).toBe("token");
    });
    it("existing user flutter", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      await subscribeNotification(user._id.toString(), "flutter", "token");
      const userUpdated = await User.findById(user._id);
      expect(userUpdated.flutterNotificationToken).toBe("token");
    });
  });
  describe("Testing unsubscribeNotification", () => {
    it("Deleted user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      await expect(
        unsubscribeNotification(user._id.toString(), "web", "token")
      ).rejects.toThrow("User not found");
    });

    it("existing user web", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      await unsubscribeNotification(user._id.toString(), "web", "token");
      const userUpdated = await User.findById(user._id);
      expect(userUpdated.webNotificationToken).toBe(undefined);
    });
    it("existing user flutter", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      await unsubscribeNotification(user._id.toString(), "flutter", "token");
      const userUpdated = await User.findById(user._id);
      expect(userUpdated.flutterNotificationToken).toBe(undefined);
    });
  });
  describe("Testing sendNotification", () => {
    it("existing user", async () => {
      const user = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      expect(async () => {
        await sendNotification(user, "title", "data");
      }).not.toThrowError();
    });
    // it("existing user web and flutter", async () => {
    //   const user = await new User({
    //     username: "zeyad2",
    //     createdAt: Date.now(),
    //     flutterNotificationToken: "test",
    //     webNotificationToken: "test",
    //   }).save();
    //   expect(async () => {
    //     await sendNotification(user, "title", "data");
    //   }).not.toThrowError();
    // });
  });

  describe("Testing getUserNotifications", () => {
    it("setting after and before", async () => {
      await expect(getUserNotifications(2, true, true, 3)).rejects.toThrow(
        "Can't set before and after"
      );
    });
    it("setting before only", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
      }).save();

      const notifications = await getUserNotifications(
        2,
        true,
        false,
        user._id.toString()
      );
      expect(notifications.children.length).toBe(1);

      await User.deleteMany({});
      await Notification.deleteMany({});
    });
    it("setting invalid after only", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notifications = await getUserNotifications(
        2,
        false,
        "false",
        user._id.toString()
      );
      expect(notifications.children.length).toBe(1);

      await User.deleteMany({});
      await Notification.deleteMany({});
    });
    it("setting valid after only", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notifications = await getUserNotifications(
        2,
        false,
        3,
        user._id.toString()
      );
      expect(notifications.children.length).toBe(0);

      await User.deleteMany({});
      await Notification.deleteMany({});
    });
    it("setting nothing", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notifications = await getUserNotifications(
        2,
        false,
        false,
        user._id.toString()
      );
      expect(notifications.children.length).toBe(1);
      await User.deleteMany({});
      await Notification.deleteMany({});
    });
  });

  describe("testing markNotificationHidden", () => {
    it("deleted notifcation", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notificationId = notification._id;
      await notification.delete();

      await expect(
        markNotificationHidden(user._id, notificationId)
      ).rejects.toThrow("Notification not found");
    });
    it("not owner notifcation", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notificationId = notification._id;

      await expect(
        markNotificationHidden(user2._id, notificationId)
      ).rejects.toThrow("User unauthorized to mark this notification as read");
    });
    it("owner notifcation", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notificationId = notification._id;

      await markNotificationHidden(user._id.toString(), notificationId);
      const updatedNotification = await Notification.findById(notificationId);
      expect(updatedNotification.hidden).toBe(true);
    });
  });
  describe("testing markNotificationRead", () => {
    it("deleted notifcation", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notificationId = notification._id;
      await notification.delete();

      await expect(
        markNotificationRead(user._id, notificationId)
      ).rejects.toThrow("Notification not found");
    });
    it("not owner notifcation", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      // console.log(user._id);
      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notificationId = notification._id;

      await expect(
        markNotificationRead(user2._id, notificationId)
      ).rejects.toThrow("User unauthorized to mark this notification as read");
    });
    it("owner notifcation", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notificationId = notification._id;

      await markNotificationRead(user._id.toString(), notificationId);
      const updatedNotification = await Notification.findById(notificationId);
      expect(updatedNotification.read).toBe(true);
    });
  });

  describe("markAllNotificationsRead", () => {
    it("Mark all as read", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      const notification = await new Notification({
        ownerId: user._id,
        type: "Comment",
        data: "title1",
        link: "link1",
        date: Date.now(),
        sendingUserId: user._id,
        read: true,
      }).save();

      const notificationId = notification._id;

      await markAllNotificationsRead(user._id.toString());
      const updatedNotification = await Notification.findById(notificationId);
      expect(updatedNotification.read).toBe(true);
    });
  });

  describe("createFollowUserNotification", () => {
    it("createFollowUserNotification following user not found", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      await expect(
        createFollowUserNotification("random", user._id)
      ).rejects.toThrow("User not found");
    });
    it("createFollowUserNotification followed user not found", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const id = user2._id;
      await user2.delete();
      await expect(createFollowUserNotification("zeyad", id)).rejects.toThrow(
        "User not found"
      );
    });
    it("createFollowUserNotification followed user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const id = user2._id;
      expect(async () => {
        await createFollowUserNotification("zeyad", id);
      }).not.toThrowError();
    });
  });
});

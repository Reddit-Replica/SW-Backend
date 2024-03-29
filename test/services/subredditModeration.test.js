import {
  getSubredditModerators,
  getSubredditInvitedModerators,
  getSubredditApproved,
  getSubredditMuted,
  getModeratedSubredditsService,
  getJoinedSubredditsService,
  getFavoriteSubredditsService,
  getSubredditPostSettingsService,
  setSubredditPostSettingsService,
} from "../../services/subredditModerationServices.js";
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import Subreddit from "../../models/Community.js";
describe("Testing subredditModerationServices", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await Subreddit.deleteMany({});
    await User.deleteMany({});
    closeDatabaseConnection();
  });
  describe("Testing getSubredditModerators", () => {
    it("Setting after and before", async () => {
      await expect(
        getSubredditModerators(2, true, true, { populate: () => {} })
      ).rejects.toThrow("Can't set before and after");
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        2,
        false,
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        0,
        false,
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        2,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        0,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(moderators.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditModerators(0, false, user2._id.toString(), subredditObject)
      ).rejects.toThrow("invalid moderator id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditModerators(0, user2._id.toString(), false, subredditObject)
      ).rejects.toThrow("invalid moderator id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user3._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(moderators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set nothing", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user3._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        1,
        false,
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user3._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user4._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(moderators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user3._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user4._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        1,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user3._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user4._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        1,
        user2._id.toString(),
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user3._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        2,
        user3._id.toString(),
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user3._id,
            dateOfModeration: Date.now(),
          },
          {
            userID: user4._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();
      const moderators = await getSubredditModerators(
        2,
        user4._id.toString(),
        false,
        subredditObject
      );
      expect(moderators.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
  });
  describe("Testing getSubredditInvitedModerators", () => {
    it("Setting after and before", async () => {
      await expect(
        getSubredditInvitedModerators(2, true, true, { populate: () => {} })
      ).rejects.toThrow("Can't set before and after");
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        2,
        false,
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        0,
        false,
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        2,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        0,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditInvitedModerators(
          0,
          false,
          user2._id.toString(),
          subredditObject
        )
      ).rejects.toThrow("invalid moderator id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditInvitedModerators(
          0,
          user2._id.toString(),
          false,
          subredditObject
        )
      ).rejects.toThrow("invalid moderator id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user2._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user3._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set nothing", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user2._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user3._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        1,
        false,
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user2._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user3._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user4._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user2._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user3._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user4._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        1,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user2._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user3._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user4._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        1,
        user2._id.toString(),
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user2._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user3._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        2,
        user3._id.toString(),
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        invitedModerators: [
          {
            userID: user._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user2._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user3._id,
            dateOfInvitation: Date.now(),
          },
          {
            userID: user4._id,
            dateOfInvitation: Date.now(),
          },
        ],
      }).save();
      const invitedModerators = await getSubredditInvitedModerators(
        2,
        user4._id.toString(),
        false,
        subredditObject
      );
      expect(invitedModerators.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
  });
  describe("Testing getSubredditApproved", () => {
    it("Setting after and before", async () => {
      await expect(
        getSubredditApproved(2, true, true, { populate: () => {} })
      ).rejects.toThrow("Can't set before and after");
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        2,
        false,
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        0,
        false,
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        2,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        0,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditApproved(0, false, user2._id.toString(), subredditObject)
      ).rejects.toThrow("invalid approved id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditApproved(0, user2._id.toString(), false, subredditObject)
      ).rejects.toThrow("invalid approved id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user2._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user3._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set nothing", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user2._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user3._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        1,
        false,
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user2._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user3._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user4._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user2._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user3._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user4._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        1,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user2._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user3._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user4._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        1,
        user2._id.toString(),
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user2._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user3._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        2,
        user3._id.toString(),
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        approvedUsers: [
          {
            userID: user._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user2._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user3._id,
            dateOfApprove: Date.now(),
          },
          {
            userID: user4._id,
            dateOfApprove: Date.now(),
          },
        ],
      }).save();
      const approvedUsers = await getSubredditApproved(
        2,
        user4._id.toString(),
        false,
        subredditObject
      );
      expect(approvedUsers.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
  });
  describe("Testing getSubredditMuted", () => {
    it("Setting after and before", async () => {
      await expect(
        getSubredditMuted(2, true, true, { populate: () => {} })
      ).rejects.toThrow("Can't set before and after");
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        2,
        false,
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Didn't set neither after nor before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        0,
        false,
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        2,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        0,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditMuted(0, false, user2._id.toString(), subredditObject)
      ).rejects.toThrow("invalid muted user id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Invalid modetaor id before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      await expect(
        getSubredditMuted(0, user2._id.toString(), false, subredditObject)
      ).rejects.toThrow("invalid muted user  id");
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user2._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user3._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set nothing", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user2._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user3._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        1,
        false,
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set after", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user2._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user3._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user4._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        1,
        false,
        user._id.toString(),
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user2._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user3._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user4._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        1,
        user._id.toString(),
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(0);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user2._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user3._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user4._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        1,
        user2._id.toString(),
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(1);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user2._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user3._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        2,
        user3._id.toString(),
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
    it("Set before", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user3 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user4 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        mutedUsers: [
          {
            userID: user._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user2._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user3._id,
            dateOfMute: Date.now(),
          },
          {
            userID: user4._id,
            dateOfMute: Date.now(),
          },
        ],
      }).save();
      const mutedUsers = await getSubredditMuted(
        2,
        user4._id.toString(),
        false,
        subredditObject
      );
      expect(mutedUsers.children.length).toBe(2);
      await Subreddit.deleteMany({});
      await User.deleteMany({});
    });
  });

  describe("Testing getModeratedSubredditsService", () => {
    it("Get moderated subreddits", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject1 = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject2 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject4 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        deletedAt: Date.now(),
      }).save();

      user.moderatedSubreddits.push({
        subredditId: subredditObject1._id,
        name: subredditObject1.title,
      });
      user.moderatedSubreddits.push({
        subredditId: subredditObject4._id,
        name: subredditObject4.title,
      });
      user.moderatedSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      await user.save();
      const moderatedSubreddits = await getModeratedSubredditsService(
        user._id.toString()
      );

      expect(moderatedSubreddits.length).toBe(2);
    });
    it("Get moderated subreddits deleted user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject1 = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject2 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();

      user.moderatedSubreddits.push({
        subredditId: subredditObject1._id,
        name: subredditObject1.title,
      });
      user.moderatedSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      await user.save();
      const id = user._id;
      await user.delete();

      await expect(getModeratedSubredditsService(id)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("Testing getJoinedSubredditsService", () => {
    it("Get moderated subreddits", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject1 = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject2 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject4 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        deletedAt: Date.now(),
      }).save();

      user.joinedSubreddits.push({
        subredditId: subredditObject1._id,
        name: subredditObject1.title,
      });
      user.joinedSubreddits.push({
        subredditId: subredditObject4._id,
        name: subredditObject4.title,
      });
      user.joinedSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      await user.save();
      const joinedSubreddits = await getJoinedSubredditsService(
        user._id.toString()
      );

      expect(joinedSubreddits.length).toBe(2);
    });
    it("Get moderated subreddits deleted user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject1 = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject2 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();

      user.joinedSubreddits.push({
        subredditId: subredditObject1._id,
        name: subredditObject1.title,
      });
      user.joinedSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      await user.save();
      const id = user._id;
      await user.delete();

      await expect(getJoinedSubredditsService(id)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("Testing getFavoriteSubredditsService", () => {
    it("Get moderated subreddits", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject1 = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject2 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject4 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        deletedAt: Date.now(),
      }).save();

      user.favoritesSubreddits.push({
        subredditId: subredditObject1._id,
        name: subredditObject1.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject4._id,
        name: subredditObject4.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });

      await user.save();
      const favoritesSubreddits = await getFavoriteSubredditsService(
        user._id.toString()
      );

      expect(favoritesSubreddits.length).toBe(2);
    });
    it("Get moderated subreddits deleted user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const subredditObject1 = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject2 = await new Subreddit({
        title: "title2",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();

      user.favoritesSubreddits.push({
        subredditId: subredditObject1._id,
        name: subredditObject1.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      await user.save();
      const id = user._id;
      await user.delete();

      await expect(getFavoriteSubredditsService(id)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("Testing getSubredditPostSettingsService", () => {
    it("Testing subreddit post settings", () => {
      const subreddit = {
        subredditPostSettings: {
          enableSpoiler: false,
          suggestedSort: false,
          allowImagesInComment: true,
        },
      };
      expect(getSubredditPostSettingsService(subreddit)).toMatchObject({
        enableSpoiler: false,
        suggestedSort: false,
        allowImagesInComment: true,
      });
    });
  });
  describe("Testing setSubredditPostSettingsService", () => {
    it("Testing set subreddit post settings", () => {
      const saveFunction = jest.fn();
      const subreddit = {
        save: saveFunction,
        subredditPostSettings: {
          enableSpoiler: false,
          suggestedSort: false,
          allowImagesInComment: true,
        },
      };

      setSubredditPostSettingsService(subreddit);
      expect(saveFunction).toHaveBeenCalled();
    });
  });
});

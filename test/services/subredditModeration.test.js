import {
  getSubredditModerators,
  getSubredditInvitedModerators,
  getSubredditApproved,
  getSubredditMuted,
} from "../../services/subredditModerationServices.js";
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
});

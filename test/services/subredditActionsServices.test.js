import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Subreddit from "./../../models/Community.js";
import {
  getSubredditService,
  checkIfModerator,
  checkIfBanned,
  checkIfMuted,
  banUserService,
  unbanUserService,
  inviteToModerateService,
  cancelInvitationService,
  acceptModerationInviteService,
  leaveModerationService,
} from "../../services/subredditActionsServices.js";

// eslint-disable-next-line max-statements
describe("Testing subreddit actions services functions", () => {
  let owner = {},
    moderator = {},
    normalUser = {},
    userToBan = {},
    userToMute = {},
    subreddit = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    owner = await new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    }).save();

    moderator = await new User({
      username: "Mod",
      email: "mod@gmail.com",
      createdAt: Date.now(),
    }).save();

    normalUser = await new User({
      username: "Normal",
      email: "normal@gmail.com",
      createdAt: Date.now(),
    }).save();

    userToBan = await new User({
      username: "toBan",
      email: "none@gmail.com",
      createdAt: Date.now(),
    }).save();

    userToMute = await new User({
      username: "toMute",
      email: "none@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "Manga",
      viewName: "MangaReddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: owner.username,
        userID: owner._id,
      },
      moderators: [
        {
          userID: owner._id,
          dateOfModeration: Date.now(),
        },
        {
          userID: moderator._id,
          dateOfModeration: Date.now(),
        },
      ],
      mutedUsers: [
        {
          userID: userToMute._id,
          dateOfMute: Date.now(),
        },
      ],
      dateOfCreation: Date.now(),
    }).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have getSubredditService function", () => {
    expect(getSubredditService).toBeDefined();
  });
  it("try to get a subreddit that does not exist", async () => {
    try {
      await getSubredditService("Lol");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to get a subreddit an existing subreddit", async () => {
    const result = await getSubredditService("Manga");
    expect(result.title).toEqual("Manga");
  });

  it("should have checkIfModerator function", () => {
    expect(checkIfModerator).toBeDefined();
  });
  it("check that normal user is not a moderator in subreddit", async () => {
    const index = await checkIfModerator(userToBan._id, subreddit);
    expect(index).toEqual(-1);
  });
  it("check that owner is a moderator in subreddit", async () => {
    const index = await checkIfModerator(owner._id, subreddit);
    expect(index).not.toEqual(-1);
  });

  it("should have checkIfMuted function", () => {
    expect(checkIfMuted).toBeDefined();
  });
  it("check that unmuted user returns false with checkIfMuted", async () => {
    const index = await checkIfMuted(userToBan._id, subreddit);
    expect(index).toBeFalsy();
  });
  it("check that muted user returns true with checkIfMuted", async () => {
    const index = await checkIfMuted(userToMute._id, subreddit);
    expect(index).toBeTruthy();
  });

  it("should have banUserService function", () => {
    expect(banUserService).toBeDefined();
  });
  it("try to let normal user ban another", async () => {
    try {
      await banUserService(userToMute, userToBan, subreddit, {});
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to let the moderator ban hiself", async () => {
    try {
      await banUserService(owner, owner, subreddit, {});
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to let the moderator ban another user", async () => {
    const result = await banUserService(owner, userToBan, subreddit, {
      banPeriod: 1,
    });
    expect(result.statusCode).toEqual(200);
  });
  it("try to let the moderator ban an already banned user", async () => {
    const result = await banUserService(owner, userToBan, subreddit, {
      banPeriod: 1,
    });
    expect(result.statusCode).toEqual(200);
  });

  it("should have checkIfBanned function", () => {
    expect(checkIfBanned).toBeDefined();
  });
  it("check that unbanned user returns false with checkIfMuted", async () => {
    const index = await checkIfBanned(userToMute._id, subreddit);
    expect(index).toBeFalsy();
  });
  it("check that banned user returns true with checkIfBanned", async () => {
    const index = await checkIfBanned(userToBan._id, subreddit);
    expect(index).toBeTruthy();
  });

  it("should have unbanUserService function", () => {
    expect(unbanUserService).toBeDefined();
  });
  it("try to let normal user unban another", async () => {
    try {
      await unbanUserService(userToMute, userToBan, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to let the moderator unban another user", async () => {
    const result = await unbanUserService(owner, userToBan, subreddit);
    expect(result.statusCode).toEqual(200);
  });

  it("should have inviteToModerateService function", () => {
    expect(inviteToModerateService).toBeDefined();
  });
  it("try to invite a moderator by normal user", async () => {
    try {
      await inviteToModerateService(userToMute, userToBan, subreddit, {
        permissionToEverything: false,
        permissionToManageUsers: true,
        permissionToManageSettings: true,
        permissionToManageFlair: true,
        permissionToManagePostsComments: true,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  // eslint-disable-next-line max-len
  it("try to invite a user to be a moderator by a moderator in that subreddit", async () => {
    const result = await inviteToModerateService(owner, normalUser, subreddit, {
      permissionToEverything: false,
      permissionToManageUsers: true,
      permissionToManageSettings: true,
      permissionToManageFlair: true,
      permissionToManagePostsComments: true,
    });
    expect(result.statusCode).toEqual(200);
  });
  it("try to change the permissions of the owner", async () => {
    try {
      await inviteToModerateService(owner, owner, subreddit, {
        permissionToEverything: false,
        permissionToManageUsers: true,
        permissionToManageSettings: true,
        permissionToManageFlair: true,
        permissionToManagePostsComments: true,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to change the permissions of a moderator", async () => {
    const result = await inviteToModerateService(owner, moderator, subreddit, {
      permissionToEverything: false,
      permissionToManageUsers: true,
      permissionToManageSettings: true,
      permissionToManageFlair: true,
      permissionToManagePostsComments: true,
    });
    expect(result.statusCode).toEqual(200);
  });

  it("should have cancelInvitationService function", () => {
    expect(cancelInvitationService).toBeDefined();
  });
  it("try to cancel the invitation by normal user", async () => {
    try {
      await cancelInvitationService(normalUser, userToBan, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to cancel the invitation by a moderator", async () => {
    const result = await cancelInvitationService(
      moderator,
      userToBan,
      subreddit
    );
    expect(result.statusCode).toEqual(200);
  });
  it("try to cancel the invitation by the owner", async () => {
    const result = await cancelInvitationService(owner, userToBan, subreddit);
    expect(result.statusCode).toEqual(200);
  });

  it("should have acceptModerationInviteService function", () => {
    expect(acceptModerationInviteService).toBeDefined();
  });
  it("try to let a moderator accept an invitation", async () => {
    try {
      await acceptModerationInviteService(moderator, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to let the owner accept an invitation", async () => {
    try {
      await acceptModerationInviteService(owner, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  // eslint-disable-next-line max-len
  it("try to accept an invitation by a user who was not invited to be a moderator", async () => {
    try {
      await acceptModerationInviteService(userToBan, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  // eslint-disable-next-line max-len
  it("try to accept an invitation by a user who was invited to be a moderator", async () => {
    await inviteToModerateService(moderator, normalUser, subreddit, {
      permissionToEverything: false,
      permissionToManageUsers: true,
      permissionToManageSettings: true,
      permissionToManageFlair: true,
      permissionToManagePostsComments: true,
    });
    const result = await acceptModerationInviteService(normalUser, subreddit);
    expect(result.statusCode).toEqual(200);
  });

  it("should have leaveModerationService function", () => {
    expect(leaveModerationService).toBeDefined();
  });
  // eslint-disable-next-line max-len
  it("try to let a normal user leave the moderation of a subreddit", async () => {
    try {
      await leaveModerationService(userToBan, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to let the owner leave the moderation of a subreddit", async () => {
    try {
      await leaveModerationService(owner, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to let a moderator leave the moderation of a subreddit", async () => {
    const result = await leaveModerationService(normalUser, subreddit);
    expect(result.statusCode).toEqual(200);
  });
});

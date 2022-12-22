/* eslint-disable max-statements */

import mongoose from "mongoose";
import { compareFlairs } from "../utils/subredditFlairs.js";
import Flair from "../models/Flair.js";
/**
 * A function used to validate the request body for creating or editing a flair, if the body is invalid it throws an error
 * @param {Object} req Request object
 * @returns {void}
 */
export function validateCreateOrEditFlair(req) {
  // check if required paramaters are missed
  if (!req.body.flairName || !req.body.settings) {
    const error = new Error("Missing parameters");
    error.statusCode = 400;
    throw error;
  }
  if (req.body.settings.modOnly && req.body.settings.allowUserEdits) {
    const error = new Error("Bad request");
    error.statusCode = 400;
    throw error;
  }
  if (req.body.settings.allowUserEdits && !req.body.settings.emojisLimit) {
    const error = new Error("Missing parameters");
    error.statusCode = 400;
    throw error;
  }
  if (req.body.settings.emojisLimit < 1 || req.body.settings.emojisLimit > 10) {
    const error = new Error("Bad request");
    error.statusCode = 400;
    throw error;
  }
}

/**
 * A function used to validate the flair type as it is enum it throws an error if the flair type is invalid
 * @param {Object} req Request object
 * @returns {void}
 */
function validateFlairType(flairType) {
  if (
    flairType !== "Text and emojis" &&
    flairType !== "Text only" &&
    flairType !== "Emojis only"
  ) {
    const error = new Error("Bad request");
    error.statusCode = 400;
    throw error;
  }
}

/**
 * A function used to prepare the flair object to be created and return it to the controller
 * @param {Object} req Request object
 * @returns {Object} the prepared flair object
 */
export function prepareCreateFlairBody(req) {
  const flairObject = {
    flairName: req.body.flairName,
    flairSettings: {},
    subreddit: req.subreddit._id,
    flairOrder: req.subreddit.numberOfFlairs,
    createdAt: Date.now(),
  };
  if (req.body.backgroundColor) {
    flairObject.backgroundColor = req.body.backgroundColor;
  }
  if (req.body.backgroundColor) {
    flairObject.textColor = req.body.textColor;
  }
  if (req.body.settings.modOnly) {
    flairObject.flairSettings.modOnly = true;
    flairObject.flairSettings.allowUserEdits = false;
  } else {
    validateFlairType(req.body.settings.flairType);
    flairObject.flairSettings.modOnly = false;
    flairObject.flairSettings.allowUserEdits = true;
    flairObject.flairSettings.flairType = req.body.settings.flairType;
    flairObject.flairSettings.emojisLimit = req.body.settings.emojisLimit;
  }
  return flairObject;
}

/**
 * A function used to create a flair and add it to the subreddit
 * @param {Object} flair the prepared flair object
 * @param {Object} subreddit the subreddit to which that flair is created
 * @returns {flairId} the id of the created flair
 */
export async function createFlair(flair, subreddit) {
  const newFlair = new Flair(flair);
  subreddit.flairs.push(newFlair._id);
  subreddit.numberOfFlairs++;
  const newFlairObject = await newFlair.save();
  await subreddit.save();
  return newFlairObject._id;
}

/**
 * A function used to edit a flair
 * @param {Object} preparedFlairObject the prepared flair object
 * @param {Object} flair the flair object to edit
 * @returns {void}
 */
export async function editFlair(preparedFlairObject, flair) {
  flair.flairSettings = preparedFlairObject.flairSettings;
  flair.flairName = preparedFlairObject.flairName;
  if (preparedFlairObject.backgroundColor) {
    flair.backgroundColor = preparedFlairObject.backgroundColor;
  } else {
    flair.backgroundColor = null;
  }
  if (preparedFlairObject.textColor) {
    flair.textColor = preparedFlairObject.textColor;
  } else {
    flair.textColor = null;
  }
  flair.editedAt = new Date().toISOString();
  await flair.save();
}

/**
 * A function used to validate mongodb id
 * @param {ObjectID} id The id to validate
 * @returns {void}
 */
export function validateId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }
}

/**
 * A function used to create a flair and add it to the subreddit
 * @param {ObjectID} flairId the prepared flairId object
 * @param {Object} subreddit the subreddit to which that flair at
 * @returns {void}
 */
export async function checkFlair(flairId, subreddit) {
  await subreddit.populate("flairs");
  const neededFlair = subreddit.flairs.find(
    (el) => el._id.toString() === flairId
  );
  if (!neededFlair || neededFlair.deletedAt) {
    const error = new Error("Flair not found");
    error.statusCode = 404;
    throw error;
  }
  return neededFlair;
}

/**
 * A function used to delete a flair
 * @param {Object} flair the prepared flair object
 * @param {Object} subreddit the subreddit to which that flair is created
 * @returns {void}
 */
export async function deleteFlair(flair, subreddit) {
  flair.deletedAt = new Date().toISOString();
  subreddit.numberOfFlairs--;
  const flairToDeleteOrder = flair.flairOrder;
  const result = await Flair.updateMany(
    { subreddit: subreddit._id, flairOrder: { $gt: flairToDeleteOrder } },
    { $inc: { flairOrder: -1 } }
  );

  console.log(
    // eslint-disable-next-line max-len
    `Matched ${result.matchedCount} document, updated ${result.modifiedCount} document`
  );

  await flair.save();
  await subreddit.save();
  // await subreddit.populate("flairs");
}

/**
 * A function used to prepare a flair object for the controller to return as a response
 * @param {Object} flair the needed flair object
 * @returns {Object} flairObject the prepared flair object to return
 */
export function prepareFlairDetails(flair) {
  const flairObject = {
    flairName: flair.flairName,
    flairSettings: flair.flairSettings,
    flairOrder: flair.flairOrder,
    flairId: flair._id,
  };
  if (flair.textColor) {
    flairObject.textColor = flair.textColor;
  }
  if (flair.backgroundColor) {
    flairObject.backgroundColor = flair.backgroundColor;
  }
  return flairObject;
}

/**
 * A function used to prepare array of flairs objects for the controller to return as a response
 * @param {Object} subreddit the subreddit to prepare the array of flairs
 * @returns {Array} flairsArray the prepared flairs array
 */
export async function prepareFlairs(subreddit) {
  await subreddit.populate("flairs");
  const flairsArray = [];
  subreddit.flairs.forEach((flair) => {
    if (!flair.deletedAt) {
      flairsArray.push(prepareFlairDetails(flair));
    }
  });

  flairsArray.sort(compareFlairs);
  return flairsArray;
}

/**
 * A function used to prepare flairs settings object for the controller
 * @param {Object} subreddit the subreddit to prepare the flairs settings
 * @returns {Object} the prepared flairs settings object
 */
export function prepareFlairsSettings(subreddit) {
  const flairsSettings = {
    enablePostFlairs: subreddit.flairSettings.enablePostFlairInThisCommunity,
    allowUsers: subreddit.flairSettings.allowUsersToAssignTheirOwn,
  };
  return flairsSettings;
}

/**
 * A function used to validate the request body for editing flairs settings, if the body is invalid it throws an error
 * @param {Object} req Request object
 * @returns {Object} the flairs settings Object
 */
export function validateFlairSettingsBody(req) {
  if (
    !Object.hasOwn(req.body, "enablePostFlairs") ||
    !Object.hasOwn(req.body, "allowUsers")
  ) {
    const error = new Error("Bad request");
    error.statusCode = 400;
    throw error;
  }
  if (req.body.allowUsers && !req.body.enablePostFlairs) {
    const error = new Error("Bad request");
    error.statusCode = 400;
    throw error;
  }
  const flairsSettings = {
    enablePostFlairInThisCommunity: req.body.enablePostFlairs,
    allowUsersToAssignTheirOwn: req.body.allowUsers,
  };
  return flairsSettings;
}

/**
 * A function used to edit the flairs settings in a subreddit
 * @param {Object} subreddit the subreddit to change the flairs settings
 * @param {Object} flairsSettings the new flairs settings
 * @returns {void}
 */
export async function editFlairsSettingsService(subreddit, flairsSettings) {
  console.log(subreddit);
  subreddit.flairSettings.enablePostFlairInThisCommunity =
    flairsSettings.enablePostFlairInThisCommunity;
  subreddit.flairSettings.allowUsersToAssignTheirOwn =
    flairsSettings.allowUsersToAssignTheirOwn;
  console.log(subreddit);
  await subreddit.save();
}

/**
 * A function used to validate the request body, if the number of flairs doesn't match it throws an error
 * @param {Object} req Request object
 * @returns {void}
 */

export function checkEditFlairsOrderService(req) {
  if (req.body.flairsOrder.length !== req.subreddit.numberOfFlairs) {
    const error = new Error("Number of flairs doesn't match");
    error.statusCode = 400;
    throw error;
  }
}

/**
 * A function used to validate the request body, if the flair order or the flair id is dublicated it throws an error
 * @param {Object} req Request object
 * @returns {void}
 */

export function checkDublicateFlairOrderService(req) {
  const flairOrders = new Map();
  const flairIds = new Map();
  req.body.flairsOrder.forEach((element) => {
    if (flairOrders.has(element.flairOrder)) {
      const error = new Error("dublicate flair order");
      error.statusCode = 400;
      throw error;
    } else if (flairIds.has(element.flairId)) {
      const error = new Error("dublicate flair id");
      error.statusCode = 400;
      throw error;
    } else {
      flairOrders.set(element.flairOrder, 1);
      flairIds.set(element.flairId, 1);
    }
  });
}

/**
 * A function used to update the flairs orders of the subreddit
 * @param {Object} req Request object
 * @returns {void}
 */

export async function editFlairsOrderService(req) {
  // loop through the subreddit flairs and the request body flairs
  for (let i = 0; i < req.subreddit.flairs.length; i++) {
    for (let j = 0; j < req.body.flairsOrder.length; j++) {
      if (
        req.subreddit.flairs[i]._id.toString() ===
          req.body.flairsOrder[j].flairId &&
        req.subreddit.flairs[i].deletedAt
      ) {
        const error = new Error("Flair not found");
        error.statusCode = 400;
        throw error;
      } else if (
        req.subreddit.flairs[i]._id.toString() ===
        req.body.flairsOrder[j].flairId
      ) {
        req.subreddit.flairs[i].flairOrder = req.body.flairsOrder[j].flairOrder;
        await req.subreddit.flairs[i].save();
      }
    }
  }
  await req.subreddit.save();
}

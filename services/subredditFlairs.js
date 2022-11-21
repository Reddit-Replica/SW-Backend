/* eslint-disable max-statements */

import mongoose from "mongoose";
import { compareFlairs } from "../utils/subredditFlairs.js";
import Flair from "../models/Flair.js";
/**
 * A function used to validate the request body, if the body is invalid it throws an error
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
  subreddit.flairs.forEach((flairEl) => {
    if (Number(flairEl.flairOrder) > Number(flairToDeleteOrder)) {
      flairEl.flairOrder--;
      flairEl.save();
    }
  });
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

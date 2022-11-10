import User from "./../models/User.js";
import { generateUsername } from "unique-username-generator";
/**
 * This function generates a random username that wasn't taken before
 * using generateUsername
 * generateUsername takes three parameters(type of name,num of digits in the name,max num of characters in the name)
 * so it randomizes the type of username and num of digits to make the operation random as much as possible
 * *then if the generated username is not in the database so it return it
 *
 * @returns {string} random username of the user
 */

export async function generateRandomUsernameUtil() {
  try {
    while (true) {
      //SETTING TYPE OF USER NAME (IF IT HAS - OR NOT)
      const typeOfUsername = Math.floor(Math.random() * 2);
      //SETTING NUMBER OF DIGITS IN THE USERNAME WITH MAX VALUE OF 5
      const numOfDigits = Math.floor(Math.random() * 6);
      let RandomUsername;
      //DECIDING THE TYPE OF THE GENERATED USERNAME
      if (typeOfUsername) {
        RandomUsername = generateUsername("", numOfDigits, 20);
      } else {
        RandomUsername = generateUsername("-", numOfDigits, 20);
      }
      //CHECKING IF THERE IS NO USERNAME IN THE DATABASE AS THAT RANDOM ONE
      const user = await User.findOne({ username: RandomUsername });
      if (!user || user.deletedAt) {
        return RandomUsername;
      }
    }
  } catch (err) {
    return "Couldn't generate";
  }
}

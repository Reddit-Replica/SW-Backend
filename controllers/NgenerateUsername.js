import { generateRandomUsernameUtil } from "../utils/generateRandomUsername.js";

const generateRandomUsername = async (req, res) => {
  try {
    let numberOfNames=1;
    if (req.query.count){
      numberOfNames = req.query.count;
    }
    const randomUsernames=[];
    for (let i=0;i<numberOfNames;i++){
      const RandomUsername = await generateRandomUsernameUtil();
      if (RandomUsername === "Couldn't generate") {
        throw new Error("Couldn't generate");
      }
      randomUsernames.push(RandomUsername);
    }
    return res.status(200).json({ usernames: randomUsernames });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

export default {
  generateRandomUsername,
};

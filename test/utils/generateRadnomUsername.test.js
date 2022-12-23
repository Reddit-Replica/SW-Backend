/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {generateRandomUsernameUtil} from "../../utils/generateRandomUsername.js"
  import { connectDatabase, closeDatabaseConnection } from "../database.js";
  import User from "./../../models/User.js";
  import Subreddit from "../../models/Community.js";
  import Post from "../../models/Post.js";
  
  // eslint-disable-next-line max-statements
  describe("Testing generate random username function", () => {

    it("should have generateRandomUsernameUtil function", () => {
      expect(generateRandomUsernameUtil).toBeDefined();
    });
  
    it("try generateRandomUsernameUtil ", async () => {
      const result1=generateRandomUsernameUtil();
      const result2=generateRandomUsernameUtil();
      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
      let changed=true;
      if(result1!==result2){
        changed=false;
      }
      expect(changed).toEqual(false);
    });

  });
  
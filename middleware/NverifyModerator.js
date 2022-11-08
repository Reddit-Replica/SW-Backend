
import verifyUser from "../utils/verifyUser.js";
import Subreddit from "../models/Community.js";
// eslint-disable-next-line max-statements
export async function checkModerator(req, res, next) {
	const authPayload = verifyUser(req);
  if (!authPayload) {
    return res.status(401).send("Token may be invalid or not found");
  }
	try {
		console.log("hamada1");
		subreddit= await Subreddit.findOne({ title:req.params.subreddit });
		console.log(subreddit);
		// eslint-disable-next-line max-len
		const { moderators } = subreddit;
		console.log(moderators);
		console.log("hamada1");
		let isThere=false;
		console.log("hamada1");
		const userId=authPayload.userId;
		console.log("hamada1");
		moderators.forEach(function(moderator){
			if ((moderator.userID).toString()===userId){
			isThere=true;
			}
		});
		if (isThere){
			next();
		} else {
			res.status(400).send("you don't have the right to do this action");
		}
	} catch (err) {
			res.status(500).send({
			error:err
			});
	}
}

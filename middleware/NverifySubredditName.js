import Subreddit from "../models/Community.js";

export async function checkDuplicateSubredditTitle(req, res, next) {
	try {
			// eslint-disable-next-line max-len
			const title = await Subreddit.findOne({ title: req.body.title });
			if (title) {
			return res.status(400).send({ error: "title is already in use" });
			}
			next();
	} catch (err) {
			res.status(500).send({
			error:err
			});
	}
}

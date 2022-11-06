import mongoose, { Schema } from "mongoose";


const communitySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
    },
    picture: {
        type: String,
    },
    type: {
        type: String,
        required: true,
    },
    mainTopic: {
        type: String,
    },
    subTopics:[
        {
            type: String
        }
    ],
    flairs: [
        {
            type: String,
        }
    ],
    dateOfCreation:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    views: {
        type: Number,
    },
    members: {
        type: Number,
        required: true,
        default: 1,
    },
    nsfw: {
        type: Boolean,
        required: true,
        default: false,
    },
    rules: [
        {
            ruleTitle: {
                type: String,
                required: true,
            },
            ruleDescription: {
                type: String,
                required: true,
            },
        },
    ],
    moderators: [
        {
            username: {
                type: String,
                required: true,
            },
            nickname: {
                type: String,
                required: true,
            },
            dateOfModeration: {
                type: Date,
                required: true,
                default: Date.now(),
            },
            permissions: [
                {
                    type: String
                }
            ]
        },
    ],
    bannedUsers: [
        {
            username: {
                type: String,
                required: true,
            },
            userID: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        }
    ],
    mutedUsers: [
        {
            username: {
                type: String,
                required: true,
            },
            userID: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        }
    ],
    approvedUsers: [
        {
            username: {
                type: String,
                required: true,
            },
            userID: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        }
    ],
    subredditPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
        }
    ]

});



const Community = mongoose.model("Community",communitySchema);

export default Community;


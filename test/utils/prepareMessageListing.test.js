/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
    subredditListing,
    extraPostsListing,
  } from "../../utils/prepareSubreddit.js";
import {prepareMessageBeforeAfter,prepareMentionBeforeAfter,mentionListing,postReplyListing,conversationListing,inboxListing,setResult,splitterOnType,prepareListingMsgs,prepareListingcMentions,messageListing}from"../../utils/prepareMessageListing.js"
  import { connectDatabase, closeDatabaseConnection } from "../database.js";
  import User from "./../../models/User.js";
  import Subreddit from "../../models/Community.js";
  import Post from "../../models/Post.js";
  import Message from "../../models/Message.js"
  import Mention from "../../models/Mention.js"
  import Comment from "../../models/Comment.js"
  import Conversation from "../../models/Conversation.js"
import PostReplies from "../../models/PostReplies.js";
  
  // eslint-disable-next-line max-statements
  describe("Testing prepare subreddit listing service functions", () => {
    let userOne = {},
    userTwo = {},
    userThree = {},
    subreddit = {},
    existingMessage = {},
    secondMessage = {},
    ThirdMessage = {},
    msgToSubreddit = {},
    existingConversation = {},
    postOne = {},
    commentOne = {},
    MentionOne={},
    PostReplyOne={},
    conversationOne={},
    postTwo = {},
    commentTwo = {};
  beforeAll(async () => {
    await connectDatabase();

    userOne = await new User({
      username: "Noaman",
      email: "abdelrahmannoaman1@gmail.com",
      createdAt: Date.now(),
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "bodynoaman1996@gmail.com",
      createdAt: Date.now(),
    }).save();

    userThree = await new User({
      username: "Beshoy",
      email: "Bosha@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "noamansubreddit",
      viewName: "no3mn ygd3an",
      category: "Sports",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
    }).save();

    msgToSubreddit = await new Message({
      text: "Noaman byb3t Msg l subreddit",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "noamansubreddit",
      isReceiverUser: false,
      subject: "we are testing the msg",
    });

    existingMessage = await new Message({
      text: "Noaman byb3t Msg",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "Hamdy",
      isReceiverUser: true,
      subject: "we are testing the msg",
    }).save();

    secondMessage = await new Message({
      text: "Noaman byb3t Msg rkm etnin",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "Hamdy",
      isReceiverUser: true,
      isReply: true,
      repliedMsgId: existingMessage.id,
      subject: "we are testing the msg",
      isRead: true,
    }).save();

    ThirdMessage = await new Message({
      text: "Noaman byb3t Msg rkm Tlata",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "Hamdy",
      isReceiverUser: true,
      subject: "we are testing the msg part 2",
    }).save();

    postOne = await new Post({
      title: "Noaman post",
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      createdAt: Date.now(),
      userCommented: [userOne.id],
    }).save();

    commentTwo = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Hamdy",
      ownerId: userOne.id,
      content: "Wonderful post",
    }).save();

    commentOne = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      content: "Hamdy da mention",
    }).save();

    MentionOne=await new Mention({
        postId:postOne.id,
        commentId:commentOne.id,
        receiverUsername:"Hamdy",
        createdAt:Date.now(),
    }).save();

    PostReplyOne=await new PostReplies({
        postId:postOne.id,
        commentId:commentOne.id,
        receiverUsername:"Hamdy",
        createdAt:Date.now(),
    }).save();

    const messages = [];
    messages.push(existingMessage.id);

    existingConversation = await new Conversation({
      subject: existingMessage.subject,
      firstUsername: existingMessage.senderUsername,
      isFirstNameUser: existingMessage.isSenderUser,
      secondUsername: existingMessage.receiverUsername,
      isSecondNameUser: existingMessage.isReceiverUser,
      messages: messages,
    }).save();

    userOne.sentMessages.push(existingMessage.id);
    userTwo.receivedMessages.push(existingMessage.id);
    userOne.sentMessages.push(secondMessage.id);
    userTwo.receivedMessages.push(secondMessage.id);
    userOne.sentMessages.push(ThirdMessage.id);
    userTwo.receivedMessages.push(ThirdMessage.id);
    userOne.conversations.push(existingConversation.id);
    userTwo.conversations.push(existingConversation.id);

    await userOne.save();
    await userTwo.save();
  });
  
    afterAll(async () => {
        await User.deleteMany({});
        await Conversation.deleteMany({});
        await Message.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        await Subreddit.deleteMany({});
        await Mention.deleteMany({});
        await closeDatabaseConnection();
    });
      
    it("should have prepareMessageBeforeAfter function", () => {
        expect(prepareMessageBeforeAfter).toBeDefined();
      });
    
      it("try prepareMessageBeforeAfter function with no before,after", async () => {
        const result = await prepareMessageBeforeAfter("", "");
        expect(result).toBeNull();
      });
  
      it("try prepareMessageBeforeAfter function with both before,after", async () => {
          const result = await prepareMessageBeforeAfter("before", "after");
          expect(result).toBeNull();
      });
      it("try prepareMessageBeforeAfter function with both before,after", async () => {
          const result = await prepareMessageBeforeAfter("before","");
          expect(result).toBeNull();
      });
      it("try prepareMessageBeforeAfter function with both before,after", async () => {
          const result = await prepareMessageBeforeAfter("","after");
          expect(result).toBeNull();
      });
  
      it("try prepareMessageBeforeAfter function with both before,after", async () => {
          const result = await prepareMessageBeforeAfter(userOne.id,"");
          expect(result).toBeNull();
      });
      it("try prepareMessageBeforeAfter function with both before,after", async () => {
          const result = await prepareMessageBeforeAfter("",userOne.id);
          expect(result).toBeNull();
      });
  
      it("try prepareMessageBeforeAfter function with both before only", async () => {
          const result = await prepareMessageBeforeAfter(existingMessage.id, "");
          expect(result).toEqual({
              type: "createdAt",
              value: { $gt: existingMessage.createdAt },
            });
      });
  
      it("try prepareMessageBeforeAfter function with both after only", async () => {
          const result = await prepareMessageBeforeAfter("",existingMessage.id);
          expect(result).toEqual({
              type: "createdAt",
              value: { $lt: existingMessage.createdAt },
            });
      });
  
      it("should have prepareMentionBeforeAfter function", () => {
          expect(prepareMentionBeforeAfter).toBeDefined();
        });
      
        it("try prepareMentionBeforeAfter function with no before,after", async () => {
          const result = await prepareMentionBeforeAfter("", "");
          expect(result).toBeNull();
        });
    
        it("try prepareMentionBeforeAfter function with both before,after", async () => {
            const result = await prepareMentionBeforeAfter("before", "after");
            expect(result).toBeNull();
        });
        it("try prepareMentionBeforeAfter function with both before,after", async () => {
            const result = await prepareMentionBeforeAfter("before","");
            expect(result).toBeNull();
        });
        it("try prepareMentionBeforeAfter function with both before,after", async () => {
            const result = await prepareMentionBeforeAfter("","after");
            expect(result).toBeNull();
        });
    
        it("try prepareMentionBeforeAfter function with both before,after", async () => {
            const result = await prepareMentionBeforeAfter(userOne.id,"");
            expect(result).toBeNull();
        });
        it("try prepareMentionBeforeAfter function with both before,after", async () => {
            const result = await prepareMentionBeforeAfter("",userOne.id);
            expect(result).toBeNull();
        });
    
        it("try prepareMentionBeforeAfter function with both before only", async () => {
            const result = await prepareMentionBeforeAfter(MentionOne.id, "");
            expect(result).toEqual({
                type: "createdAt",
                value: { $gt: MentionOne.createdAt },
              });
        });
    
        it("try prepareMentionBeforeAfter function with both after only", async () => {
            const result = await prepareMentionBeforeAfter("",MentionOne.id);
            expect(result).toEqual({
                type: "createdAt",
                value: { $lt: MentionOne.createdAt },
              });
        });
  
        
      it("should have mentionListing function", () => {
          expect(mentionListing).toBeDefined();
        });
      
        it("try mentionListing function with no before,after", async () => {
         try{ const result = await mentionListing({before:userOne.id,after:"",limit:""});
          expect(result).toEqual({
              query:{},
              limit:25,
              sort:{createdAt:-1},
          });
      } catch(e){
          expect(e.message).toEqual("Invalid before Id");
          expect(e.statusCode).toEqual(400)
      }
        });
  
        it("try mentionListing function with no before,after", async () => {
          try{await mentionListing({before:"",after:userOne.id,limit:""});
       } catch(e){
           expect(e.message).toEqual("Invalid after Id");
           expect(e.statusCode).toEqual(400)
       }
         });
        it("try mentionListing function with no before,after", async () => {
          const result = await mentionListing({before:MentionOne.id,after:"",limit:""});
          expect(result).toEqual({
              query:{ createdAt:{$gt: MentionOne.createdAt }},
              limit:25,
              sort:{createdAt:-1},
          });
        });
    
        it("try mentionListing function with no before,after", async () => {
          const result = await mentionListing({before:"",after:MentionOne.id,limit:""});
          expect(result).toEqual({
              query:{ createdAt:{$lt: MentionOne.createdAt }},
              limit:25,
              sort:{createdAt:-1},
          });
        });
  
              
      it("should have postReplyListing function", () => {
          expect(postReplyListing).toBeDefined();
        });
      
        it("try postReplyListing function with no before,after", async () => {
         try{ const result = await postReplyListing({before:userOne.id,after:"",limit:""});
          expect(result).toEqual({
              query:{},
              limit:25,
              sort:{createdAt:-1},
          });
      } catch(e){
          expect(e.message).toEqual("Invalid before Id");
          expect(e.statusCode).toEqual(400)
      }
        });
  
        it("try postReplyListing function with no before,after", async () => {
          try{await postReplyListing({before:"",after:userOne.id,limit:""});
       } catch(e){
           expect(e.message).toEqual("Invalid after Id");
           expect(e.statusCode).toEqual(400)
       }
         });
        it("try postReplyListing function with no before,after", async () => {
          const result = await postReplyListing({before:PostReplyOne.id,after:"",limit:""});
          expect(result).toEqual({
              query:{ createdAt:{$gt: PostReplyOne.createdAt }},
              limit:25,
              sort:{createdAt:-1},
          });
        });
    
        it("try postReplyListing function with no before,after", async () => {
          const result = await postReplyListing({before:"",after:PostReplyOne.id,limit:""});
          expect(result).toEqual({
              query:{ createdAt:{$lt: PostReplyOne.createdAt }},
              limit:25,
              sort:{createdAt:-1},
          });
        });
  
        
              
      it("should have conversationListing function", () => {
          expect(conversationListing).toBeDefined();
        });
      
        it("try conversationListing function with no before,after", async () => {
         try{ await conversationListing({before:userOne.id,after:"",limit:""});
  
      } catch(e){
          expect(e.message).toEqual("Invalid before Id");
          expect(e.statusCode).toEqual(400)
      }
        });
  
        it("try postReplyListing function with no before,after", async () => {
          try{await conversationListing({before:"",after:userOne.id,limit:""});
       } catch(e){
           expect(e.message).toEqual("Invalid after Id");
           expect(e.statusCode).toEqual(400)
       }
         });
        it("try postReplyListing function with no before,after", async () => {
          const result = await conversationListing({before:existingConversation.id,after:"",limit:""});
          expect(result).toEqual({
              query:{ latestDate:{$gt: existingConversation.latestDate }},
              limit:25,
              sort:{ latestDate: -1 }
          });
        });
    
        it("try postReplyListing function with no before,after", async () => {
          const result = await conversationListing({before:"",after:existingConversation.id,limit:""});
          expect(result).toEqual({
              query:{ latestDate:{$lt: existingConversation.latestDate }},
              limit:25,
              sort:{ latestDate: -1 }
          });
        });
  
        it("should have inboxListing function", () => {
          expect(inboxListing).toBeDefined();
        });

        it("try postReplyListing function with no before,after", async () => {
            const result = await inboxListing({before:"",after:"",limit:""});
            expect(result).toEqual({
                query:{},
                limit:25,
                sort:{ createdAt: -1 }
            });
          });
  
        it("should have splitterOnType function", () => {
          expect(splitterOnType).toBeDefined();
        });
  
        it("try postReplyListing function with no before,after", async () => {
          try{await splitterOnType(userOne.id);
       } catch(e){
           expect(e.message).toEqual("Invalid Id");
           expect(e.statusCode).toEqual(400)
       }
         });
  
         
        it("try splitterOnType function with no before,after", async () => {
          const result=await splitterOnType(existingMessage.id);
  expect(result).not.toBeNull();
         });
  
  
        it("should have setResult function", () => {
          expect(setResult).toBeDefined();
        });
      
        it("try setResult function with no before,after", async () => {
          const result=setResult({listing:{type:"list",value:2},limit:25,sort:{createdAt:-1}});
          expect(result).toEqual({
              find:{
                  deletedAt: null,
                  list:2
              },
              limit:25,
              sort:{createdAt:-1},
          })
        });
  
        it("should have prepareListingMsgs function", () => {
          expect(prepareListingMsgs).toBeDefined();
        });
      
        it("try prepareListingMsgs function with no before,after", async () => {
          const result=await prepareListingMsgs({before:"",after:"",limit:""});
          expect(result).toEqual({
              listing:null,
              limit:25,
              sort:{ createdAt: -1, text: 1 },
          })
        });
  
        it("should have prepareListingcMentions function", () => {
          expect(prepareListingcMentions).toBeDefined();
        });
      
        it("try prepareListingcMentions function with no before,after", async () => {
          const result=await prepareListingcMentions({before:"",after:"",limit:""});
          expect(result).toEqual({
              listing:null,
              limit:25,
              sort:{ createdAt: -1, text: 1 },
          })
        });
  
  
  
  

  });
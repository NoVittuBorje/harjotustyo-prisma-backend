import { prisma } from "../../prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { GraphQLError } from "graphql";
import { connect } from "node:http2";

import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();
const MESSAGE_SENT = "messageSent";

const resolvers = {
  Search: {
    __resolveType(obj: { headline: any; feedname: any; username: any; }, contextValue: any, info: any) {
      if (obj.headline) {
        return "Post";
      }
      if (obj.feedname) {
        return "Feed";
      }
      if (obj.username) {
        return "User";
      }
      return null;
    },
  },
  NewRoomResult: {
    __resolveType(obj: { feedname: any; username: any; name: any; }, contextValue: any, info: any) {
      if (obj.feedname) {
        return "Feed";
      }
      if (obj.username) {
        return "User";
      }
      if (obj.name) {
        return "Room";
      }
      return null;
    },
  },
  Query: {
    hello: async (root: any, args: any, context: any) => {
      return "hello3";
    },
    me: async (root: any, args: any, context: { prisma:any,currentUser: any; }) => {
      const user = context.currentUser;
      console.log(user)
      return user;
    },
    getfeed: async (root: any, args: { feedname: any; }, context: any) => {
      const feed = await prisma.feed.findFirst({
        where: {
          feedname: args.feedname,
        },
        include: {
          owner: true,
          moderators: true,
          subs: true,
          feedchat: { include: { owner: true, users: true } },
        },
      });
      console.log(feed);
      return [feed];
    },
    getpost: async (root: any, args: { postid: any; }, context: any) => {
      const post = await prisma.post.findFirst({
        where: {
          id: args.postid,
        },
        include: {
          owner: true,
          feed: { include: { owner: true, moderators: true } },
          comments: { include: { replies: { include: { replies: true } } } },
        },
      });
      console.log(post);
      return post;
    },
    getfeedposts: async (root: any, args: { feedname: any; orderBy: string; offset: any; }) => {
      console.log(args.feedname, args.orderBy, args.offset);
      const feed = await prisma.feed.findFirst({
        where: { feedname: args.feedname },
      });
      if (args.orderBy === "HOTTEST") {
        try {
          const posts = await prisma.post.findMany({
            where: { feedId: feed.id, active: true },
            skip: args.offset,
            take: 20,
            orderBy: { karma: "desc", createdAt: "desc" },
            include: {
              feed: true,
              owner: true,
            },
          });
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
      if (args.orderBy === "POPULAR") {
        console.log("popular");
        try {
          const posts = await prisma.post.findMany({
            where: { feedId: feed.id, active: true },
            skip: args.offset,
            take: 20,
            orderBy: { karma: "desc" },
            include: {
              feed: true,
              owner: true,
            },
          });
          console.log(posts);
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
      if (args.orderBy === "NEWEST") {
        try {
          const posts = await prisma.post.findMany({
            where: { feedId: feed.id, active: true },
            skip: args.offset,
            take: 20,
            orderBy: { createdAt: "desc" },
            include: {
              feed: true,
              owner: true,
            },
          });
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
    },
    getuser: async (root: any, args: { id: any; }, context: any) => {
      const user = await prisma.user.findFirst({
        where: {
          id: args.id,
        },
      });
      return user;
    },
    getcomments: async (root: any, args: { commentid: any; }) => {
      console.log(args);
      const comments = await prisma.comment.findMany({
        where: { id: args.commentid },
        include: {
          owner: true,
          replies: { include: { owner: true, replies: true } },
        },
      });
      console.log(comments);
      return comments;
    },
    getpopularposts: async (root: any, args: { orderBy: string; offset: any; }, context: { currentUser: { feedsubs: any[]; ownedfeeds: any[]; }; }) => {
      console.log(args.orderBy);
      if (args.orderBy === "HOTTEST") {
        try {
          const posts = await prisma.post.findMany({
            where: { active: true },
            orderBy: { commentsCount: "desc", createdAt: "desc" },
            skip: args.offset,
            take: 20,
            include: { feed: true, owner: true },
          });
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
      if (args.orderBy === "POPULAR") {
        try {
          const posts = await prisma.post.findMany({
            where: { active: true },
            orderBy: { karma: "desc" },
            skip: args.offset,
            take: 20,
            include: { feed: true, owner: true },
          });
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
      if (args.orderBy === "NEWEST") {
        try {
          const posts = await prisma.post.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" },
            skip: args.offset,
            take: 20,
            include: { feed: true, owner: true },
          });
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
      if (args.orderBy === "SUBSCRIPTIONS") {
        try {
          console.log(context.currentUser.feedsubs);
          const subs = context.currentUser.feedsubs.map((x) => x.id);
          const posts = await prisma.post.findMany({
            where: {
              feed: { id: { in: [...subs] } },
            },
            orderBy: { createdAt: "desc" },
            skip: args.offset,
            take: 20,
            include: { feed: true, owner: true },
          });
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
      if (args.orderBy === "OWNEDFEEDS") {
        try {
          console.log(context.currentUser.ownedfeeds);
          const feeds = context.currentUser.ownedfeeds.map((x) => x.id);
          const posts = await prisma.post.findMany({
            where: {
              feed: { id: { in: [...feeds] } },
            },
            orderBy: { createdAt: "desc" },
            skip: args.offset,
            take: 20,
            include: { feed: true, owner: true },
          });
          return posts;
        } catch (e) {
          throw new GraphQLError(e);
        }
      }
    },
    getpostcomments: async (root: any, args: { postid: any; offset: any; }) => {
      console.log(args.postid, args.offset);
      const comments = await prisma.comment.findMany({
        where: {
          postId: args.postid,
          depth: 0,
          active: true,
        },
        include: {
          replies: true,
          owner: true,
        },
        orderBy: { karma: "desc" },
        skip: args.offset,
        take: 20,
      });
      console.log(comments);
      return comments;
    },
    getsearchbar: async (root: any, args: { searchby: string | null; }) => {
      if (args.searchby == "" || args.searchby == null) {
        return [];
      }
      try {
        const feeds = await prisma.feed.findMany({
          where: {
            feedname: { contains: args.searchby, mode: "insensitive" },
          },
          take: 10,
        });
        const posts = await prisma.post.findMany({
          where: {
            headline: { contains: args.searchby, mode: "insensitive" },
          },
          take: 10,
        });
        const users = await prisma.user.findMany({
          where: {
            username: { contains: args.searchby, mode: "insensitive" },
          },
          take: 10,
        });
        const result = [...feeds, ...posts, ...users];

        return result;
      } catch (e) {
        throw new GraphQLError(e);
      }
    },
    getsearchusers: async (root: any, args: { searchby: string; }) => {
      if (args.searchby == "") {
        return [];
      }
      try {
        const users = await prisma.user.findMany({
          where: {
            username: { contains: args.searchby, mode: "insensitive" },
          },
          take: 10,
        });
        console.log(users);
        return users;
      } catch (e) {
        throw new GraphQLError(e);
      }
    },
    getUserRooms: async (root: any, args: any, context: { currentUser: { id: any; }; }) => {
      const user = await prisma.user.findFirst({
        where: { id: context.currentUser.id },
        include: { chatrooms: { include: { users: true, owner: true } } },
      });

      return user;
    },
    getMessagesForRoom: async (root: any, args: { roomId: any; offset: any; }, context: any) => {
      const room = await prisma.rooms.findFirst({
        where: { id: args.roomId },
        include: {
          messages: {
            include: { owner: true },
            take: 20,
            skip: args.offset,
            orderBy: { createdAt: "desc" },
          },
        },
      });
      console.log(room)
      return room;
    },
    getMessages: async (root: any, args: { roomId: any; offset: any; }, context: any) => {
      const Room = await prisma.rooms.findFirst({
        where: { id: args.roomId },
        include: {
          messages: {
            include: { owner: true },
            skip: args.offset,
            take: 10,
            orderBy: { createdAt: "desc" },
          },
        },
      });
      const messages = await prisma.messages.findMany({
        where: { roomsId: args.roomId },
        orderBy: { createdAt: "desc" },
        skip: args.offset,
        take: 10,
      });
      console.log(messages,Room);
      return messages;
    },
    getChatRoomInfo: async (root: any, args: { roomId: any; }, context: any) => {
      const room = await prisma.rooms.findFirst({
        where: { id: args.roomId },
        include: { users: true, owner: true },
      });
      return room;
    },
  },
  Mutation: {
    createUser: async (root: any, args: { username: string; password: string; email: string; }, context: any) => {
      
      const salt_rounds = 10;
      const passwordHash = await bcrypt.hash(args.password, salt_rounds);
      console.log("juu",args,passwordHash);
      const user = await prisma.user.create({data:{username:args.username,email:args.email,password_hash:passwordHash}})
      
      return user;
    },
    makeFeed: async (root: any, args: { feedname: any; description: any; }, context: { currentUser: { id: any; }; }) => {
      if (!context.currentUser) {
        return new GraphQLError("no login");
      }
      const feed = await prisma.feed.create({
        data: {
          owner: { connect: { id: context.currentUser.id } },
          feedname: args.feedname,
          description: args.description,
        },
      });
      console.log(feed);
      return feed;
    },
    makePost: async (root: any, args: { feedname: any; headline: any; description: any; }, context: { currentUser: { id: any; }; }) => {
      if (!context.currentUser) {
        return new GraphQLError("no login");
      }
      const feed = await prisma.feed.findFirst({
        where: { feedname: args.feedname },
      });
      const post = await prisma.post.create({
        data: {
          headline: args.headline,
          description: args.description,
          owner: { connect: { id: context.currentUser.id } },
          feed: { connect: { id: feed.id } },
        },
        include: {
          owner: true,
          feed: true,
        },
      });
      console.log(feed);
      return post;
    },
    makeComment: async (root: any, args: { postid: any; replyto: any; content: any; }, context: { currentUser: { id: any; }; }) => {
      if (!context.currentUser) {
        return new GraphQLError("no login");
      }
      const post = await prisma.post.findFirst({
        where: { id: args.postid },
      });
      if (!args.replyto) {
        const comment = await prisma.comment.create({
          data: {
            owner: { connect: { id: context.currentUser.id } },
            post: { connect: { id: post.id } },
            content: args.content,
          },
          include: { owner: true },
        });
        const updatePost = await prisma.post.update({
          where: { id: post.id },
          data: {
            commentsCount: {
              increment: 1,
            },
          },
        });
        console.log(comment);
        return comment;
      } else {
        const replytocomment = await prisma.comment.findFirst({
          where: { id: args.replyto },
        });
        const comment = await prisma.comment.create({
          data: {
            owner: { connect: { id: context.currentUser.id } },
            replyto: { connect: { id: replytocomment.id } },
            post: { connect: { id: post.id } },
            content: args.content,
            depth: replytocomment.depth + 1,
          },
          include: { owner: true, replyto: true },
        });
        const updatePost = await prisma.post.update({
          where: { id: post.id },
          data: {
            commentsCount: {
              increment: 1,
            },
          },
        });
        const updatedComment = await prisma.comment.findFirst({
          where: { id: args.replyto },
          include: { owner: true, replies: { include: { owner: true } } },
        });

        return updatedComment;
      }
    },
    likeComment: async (root: any, args: { id: any; }, context: { currentUser: any; }) => {
      const user = context.currentUser;
      console.log(user);
      const comment = await prisma.comment.findFirst({
        where: { id: args.id },
        include: { owner: true, replies: true, replyto: true },
      });
      if (comment.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const likecommentids = user.likedcomments.map((comment: { id: any; }) => comment.id);
      const dislikecommentids = user.dislikedcomments.map(
        (comment: { id: any; }) => comment.id
      );
      if (likecommentids.includes(comment.id)) {
        const newcomment = await prisma.comment.update({
          where: { id: comment.id },
          data: { karma: { decrement: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });
        const commentOwner = await prisma.user.update({
          where: { id: comment.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { likedcomments: { disconnect: { id: comment.id } } },
        });
        return newcomment;
      } else {
        if (dislikecommentids.includes(comment.id)) {
          const newcomment = await prisma.comment.update({
            where: { id: comment.id },
            data: { karma: { increment: 1 } },
          });

          const commentOwner = await prisma.user.update({
            where: { id: comment.owner.id },
            data: { userKarma: { increment: 1 } },
          });

          const newuser = await prisma.user.update({
            where: { id: user.id },
            data: { dislikedcomments: { disconnect: { id: comment.id } } },
          });
        }
        const newcommentret = await prisma.comment.update({
          where: { id: comment.id },
          data: { karma: { increment: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });

        const commentOwner = await prisma.user.update({
          where: { id: comment.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { likedcomments: { connect: { id: comment.id } } },
        });

        return newcommentret;
      }
    },
    dislikeComment: async (root: any, args: { id: any; }, context: { currentUser: any; }) => {
      const user = context.currentUser;
      const comment = await prisma.comment.findFirst({
        where: { id: args.id },
        include: { owner: true, replies: true, replyto: true },
      });
      if (comment.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const dislikecommentids = user.dislikedcomments.map(
        (comment: { id: any; }) => comment.id
      );
      const likecommentids = user.likedcomments.map((comment: { id: any; }) => comment.id);
      if (dislikecommentids.includes(comment.id)) {
        const newcomment = await prisma.comment.update({
          where: { id: comment.id },
          data: { karma: { increment: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });
        const commentOwner = await prisma.user.update({
          where: { id: comment.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { dislikedcomments: { disconnect: { id: comment.id } } },
        });

        return newcomment;
      } else {
        if (likecommentids.includes(comment.id)) {
          const newcomment = await prisma.comment.update({
            where: { id: comment.id },
            data: { karma: { decrement: 1 } },
          });
          const commentOwner = await prisma.user.update({
            where: { id: comment.owner.id },
            data: { userKarma: { decrement: 1 } },
          });
          const newuser = await prisma.user.update({
            where: { id: user.id },
            data: { likedcomments: { disconnect: { id: comment.id } } },
          });
        }
        const newcommentret = await prisma.comment.update({
          where: { id: comment.id },
          data: { karma: { decrement: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });
        const commentOwner = await prisma.user.update({
          where: { id: comment.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { dislikedcomments: { connect: { id: comment.id } } },
        });

        return newcommentret;
      }
    },
    likePost: async (root: any, args: { id: any; }, context: { currentUser: any; }) => {
      const user = context.currentUser;
      const post = await prisma.post.findFirst({
        where: { id: args.id },
        include: { owner: true },
      });
      if (post.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const likeids = user.likedposts.map((post: { id: any; }) => post.id);
      const dislikedids = user.dislikedposts.map((post: { id: any; }) => post.id);
      if (likeids.includes(post.id)) {
        const newpost = await prisma.post.update({
          where: { id: args.id },
          data: { karma: { decrement: 1 } },
        });
        const postOwner = await prisma.user.update({
          where: { id: post.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { likedposts: { disconnect: { id: post.id } } },
        });
        return newpost;
      } else {
        if (dislikedids.includes(post.id.toString())) {
          const newpost = await prisma.post.update({
            where: { id: args.id },
            data: { karma: { increment: 1 } },
          });
          const postOwner = await prisma.user.update({
            where: { id: post.owner.id },
            data: { userKarma: { increment: 1 } },
          });
          const newuser = await prisma.user.update({
            where: { id: user.id },
            data: { dislikedposts: { disconnect: { id: post.id } } },
          });
        }
        const newpost = await prisma.post.update({
          where: { id: args.id },
          data: { karma: { increment: 1 } },
        });
        const postOwner = await prisma.user.update({
          where: { id: post.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { likedposts: { connect: { id: post.id } } },
        });
        return newpost;
      }
    },
    dislikePost: async (root: any, args: { id: any; }, context: { currentUser: any; }) => {
      const user = context.currentUser;
      const post = await prisma.post.findFirst({
        where: { id: args.id },
        include: { owner: true },
      });
      if (post.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const dislikeids = user.dislikedposts.map((post: { id: any; }) => post.id);
      const likeids = user.likedposts.map((post: { id: any; }) => post.id);
      if (dislikeids.includes(post.id.toString())) {
        const newpost = await prisma.post.update({
          where: { id: args.id },
          data: { karma: { increment: 1 } },
        });
        const postOwner = await prisma.user.update({
          where: { id: post.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { dislikedposts: { disconnect: { id: post.id } } },
        });

        return newpost;
      } else {
        if (likeids.includes(post.id)) {
          const newpost = await prisma.post.update({
            where: { id: args.id },
            data: { karma: { decrement: 1 } },
          });
          const postOwner = await prisma.user.update({
            where: { id: post.owner.id },
            data: { userKarma: { decrement: 1 } },
          });
          const newuser = await prisma.user.update({
            where: { id: user.id },
            data: { likedposts: { disconnect: { id: post.id } } },
          });
        }
        const newpost = await prisma.post.update({
          where: { id: args.id },
          data: { karma: { decrement: 1 } },
        });
        const postOwner = await prisma.user.update({
          where: { id: post.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.user.update({
          where: { id: user.id },
          data: { dislikedposts: { connect: { id: post.id } } },
        });
        return newpost;
      }
    },
    login: async (root: any, args: { username: any; password: string }) => {
      console.log(args)
      const user = await prisma.user.findFirst({
        where: { username: args.username },
      });
      console.log(user);
      const password_correct =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.password_hash);

      if (!user) {
        throw new GraphQLError("Wrong Username!", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      if (!password_correct) {
        throw new GraphQLError("Wrong Password!", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      console.log(user);
      const userForToken = {
        username: user.username,
        id: user.id,
      };
      
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    singleUpload: async (_: any, { input: { userId, file } }: any, context: { currentUser: any; }) => {
      if (!context.currentUser) {
        throw new GraphQLError("not logged in");
      }
      try {
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    },
    multiUpload: async (_: any, { input: { userId, files } }: any, context: { currentUser: any; }) => {
      if (!context.currentUser) {
        throw new GraphQLError("not logged in");
      }
      try {
      } catch (error) {
        console.error("Error uploading files:", error);
        throw new Error("Failed to upload files");
      }
    },
    createRoom: async (root: any, args: { type: string; name: any; feedId: any; }, context: { currentUser: { id: string; }; }) => {
      if (args.type == "group") {
        const newroom = await prisma.rooms.create({
          data: {
            owner: { connect: { id: context.currentUser.id } },
            name: args.name,
            type: "GROUP",
          },
        });
        const newuser = await prisma.user.update({
          where: { id: context.currentUser.id },
          data: { chatrooms: { connect: { id: newroom.id } } },
          include: { chatrooms: true },
        });

        console.log(newuser);
        return newuser;
      }
      if (args.type == "feedchat") {
        const feed = await prisma.feed.findFirst({
          where: { id: args.feedId },
          include: { owner: true },
        });
        if (context.currentUser.id == feed.owner.id) {
          const newroom = await prisma.rooms.create({
            data: {
              owner: { connect: { id: context.currentUser.id } },
              feed: { connect: { id: feed.id } },
              name: args.name,
              type: "FEED",
            },
          });
          const newfeed = await prisma.feed.update({
            where: { id: args.feedId },
            data: { feedchat: { connect: { id: newroom.id } } },
            include: { feedchat: { include: { owner: true } } },
          });

          console.log(newfeed);
          return newfeed;
        } else {
          return new GraphQLError("Not the owner of feed");
        }
      }
    },
    editRoom: async (root: any, args: { type: string; feedId: any; roomId: any; content: any; }, context: { currentUser: { id: any; _id: any; }; }) => {
      

    },
    roomInviteAction: async (root: any, args: { type: string; roomId: any; }, context: { currentUser: { _id: any; id: any; }; }) => {
     
    },
    

    message: async (root: any, args: { roomId: any; content: any; }, context: { currentUser: any; }) => {
      const owner = context.currentUser;
      const room = await prisma.rooms.findFirst({ where: { id: args.roomId } });

      const data = {
        content: args.content,
        owner: owner,
        room: room,
      };

      const message = await prisma.messages.create({
        data: {
          content: args.content,
          owner: {
            connect: { id: owner.id },
          },
          room: { connect: { id: room.id } },
        },
        include: { owner: true, room: true },
      });
      console.log(message);
      const newroom = await prisma.rooms.update({
        where: { id: room.id },
        data: { messages: { connect: { id: message.id } } },
      });

      pubsub.publish(MESSAGE_SENT, { messageSent: message });
      return message;
    },
    sendFriendRequest: async (root: any, args: { userId: any; }, context: { currentUser: { id: any; _id: any; }; }) => {
    },
  },
  Subscription: {
    messageSent: {
      subscribe: {}

    },
  },
};
export default resolvers;

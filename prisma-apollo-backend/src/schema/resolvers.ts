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
    __resolveType(obj, contextValue, info) {
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
    __resolveType(obj, contextValue, info) {
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
    hello: async (root, args, context) => {
      return "hello3";
    },
    me: async (root, args, context) => {
      const user = context.currentUser;
      return user;
    },
    getfeed: async (root, args, context) => {
      const feed = await prisma.feeds.findFirst({
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
    getpost: async (root, args, context) => {
      const post = await prisma.posts.findFirst({
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
    getfeedposts: async (root, args) => {
      console.log(args.feedname, args.orderBy, args.offset);
      const feed = await prisma.feeds.findFirst({
        where: { feedname: args.feedname },
      });
      if (args.orderBy === "HOTTEST") {
        try {
          const posts = await prisma.posts.findMany({
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
          const posts = await prisma.posts.findMany({
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
          const posts = await prisma.posts.findMany({
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
    getuser: async (root, args, context) => {
      const user = await prisma.users.findFirst({
        where: {
          id: args.id,
        },
      });
      return user;
    },
    getcomments: async (root, args) => {
      console.log(args);
      const comments = await prisma.comments.findMany({
        where: { id: args.commentid },
        include: {
          owner: true,
          replies: { include: { owner: true, replies: true } },
        },
      });
      console.log(comments);
      return comments;
    },
    getpopularposts: async (root, args, context) => {
      console.log(args.orderBy);
      if (args.orderBy === "HOTTEST") {
        try {
          const posts = await prisma.posts.findMany({
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
          const posts = await prisma.posts.findMany({
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
          const posts = await prisma.posts.findMany({
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
          const posts = await prisma.posts.findMany({
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
          const posts = await prisma.posts.findMany({
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
    getpostcomments: async (root, args) => {
      console.log(args.postid, args.offset);
      const comments = await prisma.comments.findMany({
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
    getsearchbar: async (root, args) => {
      if (args.searchby == "" || args.searchby == null) {
        return [];
      }
      try {
        const feeds = await prisma.feeds.findMany({
          where: {
            feedname: { contains: args.searchby, mode: "insensitive" },
          },
          take: 10,
        });
        const posts = await prisma.posts.findMany({
          where: {
            headline: { contains: args.searchby, mode: "insensitive" },
          },
          take: 10,
        });
        const users = await prisma.users.findMany({
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
    getsearchusers: async (root, args) => {
      if (args.searchby == "") {
        return [];
      }
      try {
        const users = await prisma.users.findMany({
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
    getUserRooms: async (root, args, context) => {
      const user = await prisma.users.findFirst({
        where: { id: context.currentUser.id },
        include: { chatrooms: { include: { users: true, owner: true } } },
      });

      return user;
    },
    getMessagesForRoom: async (root, args, context) => {
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
    getMessages: async (root, args, context) => {
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
    getChatRoomInfo: async (root, args, context) => {
      const room = await prisma.rooms.findFirst({
        where: { id: args.roomId },
        include: { users: true, owner: true },
      });
      return room;
    },
  },
  Mutation: {
    createUser: async (root, args, context) => {
      if (args.username.match(/^\S*$/) > 0) {
        throw new GraphQLError("Username not allowed characters.");
      }
      const salt_rounds = 10;
      const passwordHash = await bcrypt.hash(args.password, salt_rounds);
      const user = await prisma.users
        .create({
          data: {
            username: args.username,
            email: args.email,
            password_hash: passwordHash,
          },
        })
        .catch((error) => {
          if (error.errorResponse.keyValue.username) {
            console.log("username error");
            throw new GraphQLError("Username already in use", {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: error.errorResponse.keyValue,
                error,
              },
            });
          }
          if (error.errorResponse.keyValue.email) {
            console.log("email error");
            throw new GraphQLError("Email already in use", {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: error.errorResponse.keyValue,
                error,
              },
            });
          }
        });
      return user;
    },
    makeFeed: async (root, args, context) => {
      if (!context.currentUser) {
        return new GraphQLError("no login");
      }
      const feed = await prisma.feeds.create({
        data: {
          owner: { connect: { id: context.currentUser.id } },
          feedname: args.feedname,
          description: args.description,
        },
      });
      console.log(feed);
      return feed;
    },
    makePost: async (root, args, context) => {
      if (!context.currentUser) {
        return new GraphQLError("no login");
      }
      const feed = await prisma.feeds.findFirst({
        where: { feedname: args.feedname },
      });
      const post = await prisma.posts.create({
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
    makeComment: async (root, args, context) => {
      if (!context.currentUser) {
        return new GraphQLError("no login");
      }
      const post = await prisma.posts.findFirst({
        where: { id: args.postid },
      });
      if (!args.replyto) {
        const comment = await prisma.comments.create({
          data: {
            owner: { connect: { id: context.currentUser.id } },
            post: { connect: { id: post.id } },
            content: args.content,
          },
          include: { owner: true },
        });
        const updatePost = await prisma.posts.update({
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
        const replytocomment = await prisma.comments.findFirst({
          where: { id: args.replyto },
        });
        const comment = await prisma.comments.create({
          data: {
            owner: { connect: { id: context.currentUser.id } },
            replyto: { connect: { id: replytocomment.id } },
            post: { connect: { id: post.id } },
            content: args.content,
            depth: replytocomment.depth + 1,
          },
          include: { owner: true, replyto: true },
        });
        const updatePost = await prisma.posts.update({
          where: { id: post.id },
          data: {
            commentsCount: {
              increment: 1,
            },
          },
        });
        const updatedComment = await prisma.comments.findFirst({
          where: { id: args.replyto },
          include: { owner: true, replies: { include: { owner: true } } },
        });

        return updatedComment;
      }
    },
    likeComment: async (root, args, context) => {
      const user = context.currentUser;
      console.log(user);
      const comment = await prisma.comments.findFirst({
        where: { id: args.id },
        include: { owner: true, replies: true, replyto: true },
      });
      if (comment.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const likecommentids = user.likedcomments.map((comment) => comment.id);
      const dislikecommentids = user.dislikedcomments.map(
        (comment) => comment.id
      );
      if (likecommentids.includes(comment.id)) {
        const newcomment = await prisma.comments.update({
          where: { id: comment.id },
          data: { karma: { decrement: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });
        const commentOwner = await prisma.users.update({
          where: { id: comment.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { likedcomments: { disconnect: { id: comment.id } } },
        });
        return newcomment;
      } else {
        if (dislikecommentids.includes(comment.id)) {
          const newcomment = await prisma.comments.update({
            where: { id: comment.id },
            data: { karma: { increment: 1 } },
          });

          const commentOwner = await prisma.users.update({
            where: { id: comment.owner.id },
            data: { userKarma: { increment: 1 } },
          });

          const newuser = await prisma.users.update({
            where: { id: user.id },
            data: { dislikedcomments: { disconnect: { id: comment.id } } },
          });
        }
        const newcommentret = await prisma.comments.update({
          where: { id: comment.id },
          data: { karma: { increment: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });

        const commentOwner = await prisma.users.update({
          where: { id: comment.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { likedcomments: { connect: { id: comment.id } } },
        });

        return newcommentret;
      }
    },
    dislikeComment: async (root, args, context) => {
      const user = context.currentUser;
      const comment = await prisma.comments.findFirst({
        where: { id: args.id },
        include: { owner: true, replies: true, replyto: true },
      });
      if (comment.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const dislikecommentids = user.dislikedcomments.map(
        (comment) => comment.id
      );
      const likecommentids = user.likedcomments.map((comment) => comment.id);
      if (dislikecommentids.includes(comment.id)) {
        const newcomment = await prisma.comments.update({
          where: { id: comment.id },
          data: { karma: { increment: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });
        const commentOwner = await prisma.users.update({
          where: { id: comment.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { dislikedcomments: { disconnect: { id: comment.id } } },
        });

        return newcomment;
      } else {
        if (likecommentids.includes(comment.id)) {
          const newcomment = await prisma.comments.update({
            where: { id: comment.id },
            data: { karma: { decrement: 1 } },
          });
          const commentOwner = await prisma.users.update({
            where: { id: comment.owner.id },
            data: { userKarma: { decrement: 1 } },
          });
          const newuser = await prisma.users.update({
            where: { id: user.id },
            data: { likedcomments: { disconnect: { id: comment.id } } },
          });
        }
        const newcommentret = await prisma.comments.update({
          where: { id: comment.id },
          data: { karma: { decrement: 1 } },
          include: { owner: true, replies: true, replyto: true },
        });
        const commentOwner = await prisma.users.update({
          where: { id: comment.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { dislikedcomments: { connect: { id: comment.id } } },
        });

        return newcommentret;
      }
    },
    likePost: async (root, args, context) => {
      const user = context.currentUser;
      const post = await prisma.posts.findFirst({
        where: { id: args.id },
        include: { owner: true },
      });
      if (post.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const likeids = user.likedposts.map((post) => post.id);
      const dislikedids = user.dislikedposts.map((post) => post.id);
      if (likeids.includes(post.id)) {
        const newpost = await prisma.posts.update({
          where: { id: args.id },
          data: { karma: { decrement: 1 } },
        });
        const postOwner = await prisma.users.update({
          where: { id: post.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { likedposts: { disconnect: { id: post.id } } },
        });
        return newpost;
      } else {
        if (dislikedids.includes(post.id.toString())) {
          const newpost = await prisma.posts.update({
            where: { id: args.id },
            data: { karma: { increment: 1 } },
          });
          const postOwner = await prisma.users.update({
            where: { id: post.owner.id },
            data: { userKarma: { increment: 1 } },
          });
          const newuser = await prisma.users.update({
            where: { id: user.id },
            data: { dislikedposts: { disconnect: { id: post.id } } },
          });
        }
        const newpost = await prisma.posts.update({
          where: { id: args.id },
          data: { karma: { increment: 1 } },
        });
        const postOwner = await prisma.users.update({
          where: { id: post.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { likedposts: { connect: { id: post.id } } },
        });
        return newpost;
      }
    },
    dislikePost: async (root, args, context) => {
      const user = context.currentUser;
      const post = await prisma.posts.findFirst({
        where: { id: args.id },
        include: { owner: true },
      });
      if (post.owner.id == user.id) {
        throw new GraphQLError("Cant give karma to yourself.");
      }
      const dislikeids = user.dislikedposts.map((post) => post.id);
      const likeids = user.likedposts.map((post) => post.id);
      if (dislikeids.includes(post.id.toString())) {
        const newpost = await prisma.posts.update({
          where: { id: args.id },
          data: { karma: { increment: 1 } },
        });
        const postOwner = await prisma.users.update({
          where: { id: post.owner.id },
          data: { userKarma: { increment: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { dislikedposts: { disconnect: { id: post.id } } },
        });

        return newpost;
      } else {
        if (likeids.includes(post.id)) {
          const newpost = await prisma.posts.update({
            where: { id: args.id },
            data: { karma: { decrement: 1 } },
          });
          const postOwner = await prisma.users.update({
            where: { id: post.owner.id },
            data: { userKarma: { decrement: 1 } },
          });
          const newuser = await prisma.users.update({
            where: { id: user.id },
            data: { likedposts: { disconnect: { id: post.id } } },
          });
        }
        const newpost = await prisma.posts.update({
          where: { id: args.id },
          data: { karma: { decrement: 1 } },
        });
        const postOwner = await prisma.users.update({
          where: { id: post.owner.id },
          data: { userKarma: { decrement: 1 } },
        });
        const newuser = await prisma.users.update({
          where: { id: user.id },
          data: { dislikedposts: { connect: { id: post.id } } },
        });
        return newpost;
      }
    },
    login: async (root, args) => {
      const user = await prisma.users.findFirst({
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
    singleUpload: async (_, { input: { userId, file } }, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not logged in");
      }
      try {
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    },
    multiUpload: async (_, { input: { userId, files } }, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not logged in");
      }
      try {
      } catch (error) {
        console.error("Error uploading files:", error);
        throw new Error("Failed to upload files");
      }
    },
    createRoom: async (root, args, context) => {
      if (args.type == "group") {
        const newroom = await prisma.rooms.create({
          data: {
            owner: { connect: { id: context.currentUser.id } },
            name: args.name,
            type: "GROUP",
          },
        });
        const newuser = await prisma.users.update({
          where: { id: context.currentUser.id },
          data: { chatrooms: { connect: { id: newroom.id } } },
          include: { chatrooms: true },
        });

        console.log(newuser);
        return newuser;
      }
      if (args.type == "feedchat") {
        const feed = await prisma.feeds.findFirst({
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
          const newfeed = await prisma.feeds.update({
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
    editRoom: async (root, args, context) => {
      if (args.type == "removeChatFeed") {
        const feed = await Feed.findById(args.feedId)
          .populate("chatRoom", { id: 1 })
          .populate("owner", { id: 1 });
        console.log(context.currentUser.id, feed.owner.id);
        if (context.currentUser.id == feed.owner.id) {
          const newfeed = await Feed.findByIdAndUpdate(
            { _id: feed._id },
            { chatRoom: null }
          );
          return newfeed;
        } else {
          return new GraphQLError("Not the owner of chat or feed");
        }
      }
      if (args.type == "leaveroom") {
        const room = await Room.findById(args.roomId);
        if (room.owner.id == context.currentUser.id) {
          await Room.findByIdAndDelete(args.roomId);
          const newuser = await User.findByIdAndUpdate(
            context.currentUser._id,
            {
              $pull: { chatrooms: args.roomId },
            }
          ).populate("chatrooms", { id: 1, name: 1 });
          return newuser;
        } else {
          const newuser = await User.findByIdAndUpdate(
            context.currentUser._id,
            {
              $pull: { chatrooms: args.roomId },
            }
          ).populate("chatrooms", { id: 1, name: 1 });
          const newroom = await Room.findByIdAndUpdate(args.roomId, {
            $pull: { users: context.currentUser._id },
          });
          return newuser;
        }
      }
      if (args.type == "kick") {
        const room = await Room.findById(args.roomId).populate("owner", {
          id: 1,
        });

        if (room.owner.id == context.currentUser.id) {
          const newroom = await Room.findByIdAndUpdate(args.roomId, {
            $pull: { users: args.content },
          })
            .populate("users", { id: 1, username: 1, avatar: 1 })
            .populate("owner", { id: 1, username: 1, avatar: 1 });
          const newuser = await User.findByIdAndUpdate(args.content, {
            $pull: { chatrooms: args.roomId },
          });
          return newroom;
        } else {
          return new GraphQLError("not owner");
        }
      }
      if (args.type == "changename") {
        const newroom = await Room.findByIdAndUpdate(args.roomId, {
          $set: { name: args.content },
        });
        const user = await User.findById(context.currentUser.id).populate(
          "chatrooms",
          { id: 1, name: 1 }
        );
        return user;
      }
      return new GraphQLError("no such type of action");
    },
    inviteToRoom: async (root, args, context) => {
      const room = await Room.findById(args.roomId);
      const inviteduser = await User.findByIdAndUpdate(args.invitedId, {
        $addToSet: { chatroominvites: room._id },
      });
      return room;
    },
    roomInviteAction: async (root, args, context) => {
      if (args.type == "accept") {
        const newroom = await Room.findByIdAndUpdate(args.roomId, {
          $addToSet: { users: context.currentUser._id },
        });

        const newuser = await User.findByIdAndUpdate(context.currentUser.id, {
          $pull: { chatroominvites: newroom._id },
          $addToSet: { chatrooms: newroom._id },
        });
        const returnuser = await User.findById(newuser.id)
          .populate("chatroominvites", { id: 1, name: 1 })
          .populate("chatrooms", { id: 1, name: 1 });
        return returnuser;
      }
      if (args.type == "decline") {
        const newuser = await User.findByIdAndUpdate(context.currentUser.id, {
          $pull: { chatroominvites: args.roomId },
        });
        const returnuser = await User.findById(newuser.id)
          .populate("chatroominvites", { id: 1, name: 1 })
          .populate("chatrooms", { id: 1, name: 1 });
        return returnuser;
      }
    },

    message: async (root, args, context) => {
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
    sendFriendRequest: async (root, args, context) => {
      if (!context.currentUser) {
        return new GraphQLError("No user logon.");
      }
      if (args.userId == context.currentUser.id) {
        return new GraphQLError("Cant send friend request to yourself!");
      }
      const requestedUser = await User.findByIdAndUpdate(
        { _id: args.userId },
        { $addToSet: { friendsRequests: context.currentUser._id } }
      );
      const newuser = await User.findByIdAndUpdate(
        { _id: context.currentUser._id },
        { $addToSet: { friendsRequestsSent: requestedUser._id } }
      ).populate("friendsRequestsSent", { id: 1 });
      return newuser;
    },
    friendRequestAction: async (root, args, context) => {
      if (args.type == "accept") {
        const accepteduser = await User.findById(args.userId);
        const newuser = await User.findByIdAndUpdate(context.currentUser.id, {
          $addToSet: { friends: accepteduser._id },
          $pull: { friendsRequests: accepteduser._id },
        })
          .populate("friends", { username: 1, id: 1, avatar: 1 })
          .populate("friendsRequests", { username: 1, id: 1, avatar: 1 });
        const newaccepteduser = await User.findByIdAndUpdate(accepteduser.id, {
          $addToSet: { friends: context.currentUser._id },
          $pull: { friendsRequestsSent: context.currentUser._id },
        });
        return newuser;
      }
      if (args.type == "decline") {
        const declineduser = await User.findById(args.userId);
        const newuser = await User.findByIdAndUpdate(context.currentUser.id, {
          $pull: { friendsRequests: declineduser._id },
        })
          .populate("friends", { username: 1, id: 1, avatar: 1 })
          .populate("friendsRequests", { username: 1, id: 1, avatar: 1 });
        const newdeclineduser = await User.findByIdAndUpdate(declineduser.id, {
          $pull: { friendsRequestsSent: context.currentUser._id },
        });
        return newuser;
      }
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator(MESSAGE_SENT),
        (payload, variables) =>
          payload.messageSent.roomsId.equals(variables.roomId)
      ),
    },
  },
};
export default resolvers;

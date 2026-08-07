import { ApolloServer } from "@apollo/server";

import { expressMiddleware } from "@as-integrations/express5";

import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";

import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";

import { useServer } from "graphql-ws/use/ws";

import express from "express";

import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";
import typeDefs from "./schema/typedefs";
import resolvers from "./schema/resolvers";
import { prisma } from "../prisma/prisma";


var linktofrontend = "http://localhost:5173";
var hostname = "localhost";

if (process.env.NODE_ENV == "production") {
  hostname = "0.0.0.0";
  linktofrontend = "https://frontend-harjotus-sosi.fly.dev";
}

const start = async () => {
  const app = express();
  const corsOptions = {
    origin: [
      `${linktofrontend}`,
      "novittuborjeampari1.s3.eu-north-1.amazonaws.com",
      "https://studio.apollographql.com",
    ],
    methods: ["GET", "PUT", "POST"],
    accessControlAllowOrigin: "*",
    accessControlAllowCredentials: true,
  };
  app.use(cors(corsOptions));

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/subscriptions",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
  "/",
  cors<cors.CorsRequest>(),
  express.json({ limit: "50mb" }),
  expressMiddleware(server, {
    context: async ({ req }) => {
      let currentUser = null; 
      
      const auth = req ? req.headers.authorization : null;
      console.log(auth)
      if (auth && auth.startsWith("Bearer ")) {
        try {
          const decodedToken = <any>(
            jwt.verify(auth.substring(7), process.env.JWT_SECRET!)
          );
          
          currentUser = await prisma.user.findFirst({
            where: { id: decodedToken.id },
            include: {
              ownedFeeds: true,
              posts: true,
              feedSubs: true,
              likedComments: true,
              dislikedComments: true,
              likedPosts: true,
              dislikedPosts: true,
              chatrooms:true,
              ownedRooms: true,
              bannedFromFeeds: true,
              moderatedFeeds: true,
              chatroomInvites: true,
              User_UserFriendRequests_A: true,
              User_UserFriendRequests_B: true,
              User_UserFriendRequestsSent_A: true,
              User_UserFriendRequestsSent_B: true,
              User_UserFriends_A: true,
              User_UserFriends_B: true
            },
          });
          console.log(currentUser)
        } catch (error) {
          console.error("JWT verification failed:", error);
        }
      }

      return { prisma, currentUser };
    },
  })
);

  const PORT = 3000;

  await new Promise<void>((resolve) =>
    httpServer.listen(PORT, hostname, () =>
      console.log(`Server is now running on ${hostname}:${PORT}`)
    )
  );
};

start();

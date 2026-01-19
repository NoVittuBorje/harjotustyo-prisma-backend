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
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = <any>(
            jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          );
          console.log(decodedToken);
          const currentUser = await prisma.users.findFirst({
            where: { id: decodedToken.id },
            include: {
              ownedfeeds: true,
              posts: true,
              feedsubs: true,
              chatrooms: true,
              likedcomments: true,
              dislikedcomments: true,
              likedposts: true,
              dislikedposts: true,
              friendOf:true
            },
          });
          return { currentUser };
        }
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

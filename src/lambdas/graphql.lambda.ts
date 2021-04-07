import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import { createConnection, Connection, useContainer } from "typeorm";
import { Container } from "typeorm-typedi-extensions";
import dotenv from "dotenv";
dotenv.config();

import { GraphqlHelper } from "../services";
import schema from "../schema";

useContainer(Container);

let cachedConnection: Connection;
let cachedGraphqlHandler: any;
export const handler = async (event: any, context: any, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!cachedConnection) {
    cachedConnection = await createConnection();
  }

  if (!cachedGraphqlHandler) {
    const graphqlHelper = Container.get(GraphqlHelper);
    const server = new ApolloServer({
      schema,
      playground: true,
      introspection: true,
      formatError: graphqlHelper.formatError,
      context: graphqlHelper.buildContext,
    });
    cachedGraphqlHandler = server.createHandler({
      cors: {
        origin: "*",
        credentials: true,
      },
    });
  }
  await cachedGraphqlHandler(event, context, callback);
};

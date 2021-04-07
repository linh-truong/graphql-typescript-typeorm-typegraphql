import "reflect-metadata";
import { createConnection, useContainer } from "typeorm";
import { ApolloServer } from "apollo-server";
import { Container } from "typeorm-typedi-extensions";
import dotenv from "dotenv";
dotenv.config();

import { GraphqlHelper, Logger } from "./services";

useContainer(Container);

(async () => {
  await createConnection();
  const graphqlHelper = Container.get(GraphqlHelper);
  const logger = Container.get(Logger);

  const schema = await graphqlHelper.buildSchema();
  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    cors: {
      origin: "*",
      credentials: true,
    },
    formatError: graphqlHelper.formatError,
    context: graphqlHelper.buildContext,
  });

  const port = 3000;
  const { url } = await server.listen(port);
  logger.logInfo(`🚀 Server ready at ${url}`);
})();

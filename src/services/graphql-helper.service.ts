import { GraphQLError } from "graphql";
import { buildSchema } from "type-graphql";
import { Inject, Service } from "typedi";
import { Container } from "typeorm-typedi-extensions";

import { Logger } from "./logger.service";
import { CommonResolver } from "../resolvers";

export const GRAPHQL_ERROR_CODE = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_USER_INPUT: "BAD_USER_INPUT",
};

export interface AppGrapqhlContext {
  user?: any;
}

@Service()
export class GraphqlHelper {
  @Inject()
  private logger: Logger;

  async buildSchema() {
    const schema = await buildSchema({
      resolvers: [CommonResolver],
      dateScalarMode: "isoDate",
      // register the 3rd party IOC container
      container: Container,
    });
    return schema;
  }

  formatError(err: GraphQLError) {
    if (err.extensions.exception?.validationErrors) {
      err.extensions.code = GRAPHQL_ERROR_CODE.BAD_USER_INPUT;
    }
    if (err.extensions.code === GRAPHQL_ERROR_CODE.INTERNAL_SERVER_ERROR) {
      this.logger.logError(err);
    }
    return err;
  }

  buildContext(args: { req: { headers: { authorization?: string } } }) {
    const context: AppGrapqhlContext = {};
    return context;
  }
}

import { Inject, Service } from "typedi";

import { Logger } from "./logger.service";

export interface AppContext {
  user?: any;
}

@Service()
export class GraphqlHelper {
  @Inject()
  logger: Logger;

  formatError(err: any) {
    if (
      !err.extensions.code ||
      err.extensions.code === "INTERNAL_SERVER_ERROR"
    ) {
      this.logger.logError(err);
    }
    return err;
  }

  buildContext(args: any) {
    const context: AppContext = {};
    return context;
  }
}

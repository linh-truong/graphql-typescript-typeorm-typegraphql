import pino from "pino";
import { Service } from "typedi";

@Service()
export class Logger {
  private pinoInstance = pino({ base: null });

  logInfo(msg: string, ...args: any[]) {
    this.pinoInstance.info(msg, ...args);
  }

  logError(err?: Error, msg?: string, ...args: any[]) {
    this.pinoInstance.error(err, msg, ...args);
  }
}

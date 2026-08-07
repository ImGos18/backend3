const path = require("path");
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const config = require("./index");
const { fileURLToPath } = require("url");
const { DailyRotateFile } = require("winston/lib/winston/transports");

const logsDir = path.join(__dirname, "../../logs");

const isDevelopment = config.NODE_ENV === "development";

const loggerLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const colorLevels = {
  fatal: "red bold",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "magenta",
  debug: " blue",
};

winston.addColors(colorLevels);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  winston.format.json(),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack ?? message}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "DD-MM-YYYY" }),
  winston.format.json(),
);

const logger = winston.createLogger({
  levels: loggerLevels,
  level: isDevelopment ? "debug" : "info",
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new DailyRotateFile({
      auditFile: path.join(logsDir, ".fatal-audit.json"),
      dirname: logsDir,
      filename: "fatal-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxFiles: "14d",
      format: fileFormat,
      level: "fatal",
    }),

    new DailyRotateFile({
      auditFile: path.join(logsDir, ".error-audit.json"),
      dirname: logsDir,
      filename: "error-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxFiles: "14d",
      format: fileFormat,
      level: "error",
    }),
  ],
});

module.exports = logger;

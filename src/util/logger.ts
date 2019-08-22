import winston, { format } from 'winston';

export const namedFormatter = format.printf(({ level, message, timestamp, filename }) => {
  return `${timestamp} | [${level}]: ${simplifyFilename(filename)} | ${message}`;
});

export const globalLogger = winston.createLogger({
  format: format.combine(format.colorize(), format.timestamp(), namedFormatter),
  level: 'verbose',
  transports: [new winston.transports.Console()],
});

// Accepts a fileName string '__filename'
// Returns a logging function, that uses the globalLogger,
// which accepts 'level' and 'message' args
// Accepted Levels are:
// - 'verbose'
// - 'info'
// - 'warn'
// - 'error'
export const namedLog = (name: string) => {
  return (level: string, message: string) => {
    return globalLogger.log({ filename: name, level, message });
  };
};

// Parses __filename string for the last component: filename
function simplifyFilename(file: string): string {
  const parts = file.split('/');
  const name = parts[parts.length - 1];
  return name;
}

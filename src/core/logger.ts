import winston, { Logger } from 'winston';
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        label({ label: 'HONO-APP' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'warn' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ]
});


export const LogInfo = (msg: string, meta?: any): Logger => {
    return logger.info(msg, meta);
};

export const LogWarn = (msg: string, meta?: any): Logger => {
    return logger.warn(msg, meta);
};

export const LogError = (err: Error, meta?: any): Logger => {
    return logger.error(
        JSON.stringify({
            err: err.message,
            stack: err.stack,
            cause: err.cause,
            name: err.name,
        }),
        ...meta
    );
};

// LogError(new Error('boom'), 'oops');
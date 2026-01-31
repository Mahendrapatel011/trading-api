import winston from "winston";
import { APP_CONFIG } from "../config/app.config.js";

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

const logger = winston.createLogger({
    level: APP_CONFIG.NODE_ENV === "development" ? "debug" : "info",
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        new winston.transports.File({ 
            filename: "logs/error.log", 
            level: "error" 
        }),
        new winston.transports.File({ 
            filename: "logs/combined.log" 
        })
    ]
});

export default logger;
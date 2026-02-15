import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { APP_CONFIG } from "./config/app.config.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

// Handle multiple origins
const allowedOrigins = APP_CONFIG.CORS_ORIGIN
    ? APP_CONFIG.CORS_ORIGIN.split(',').map(o => o.trim())
    : [];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*') || APP_CONFIG.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-location-Id"]
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(APP_CONFIG.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(APP_CONFIG.RATE_LIMIT_MAX_REQUESTS) || 1000,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});
app.use("/api", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Compression
app.use(compression());

if (APP_CONFIG.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
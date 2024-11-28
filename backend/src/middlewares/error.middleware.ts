import { Request, Response, NextFunction } from "express";

// Custom Error Class
class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Centralized Error Handler Middleware
export const errorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    console.error("Unexpected Error:", err);
    return res.status(500).json({
        message: "Įvyko nežinoma klaida",
    });
};

export const throwError = (message: string, statusCode = 400) => {
    throw new AppError(message, statusCode);
};

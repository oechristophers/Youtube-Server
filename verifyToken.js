import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    console.log("Started authentication");

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("No authorization header found");
        return next(createError(401, "You are not authenticated!"));
    }

    console.log("Authorization header found:", authHeader);
    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log("No token found in authorization header");
        return next(createError(401, "You are not authenticated!"));
    }

    console.log("Token extracted:", token);

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return next(createError(403, "Token is not valid!"));
        }

        console.log("Token successfully verified. User:", user);
        req.user = user;
        next();
    });
};


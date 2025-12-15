import User from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { sendAuthPair, rotateRefreshToken, revokeRefreshToken, setAuthCookies, generateAccessToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/senderVerificationEmail.js";
import crypto from "crypto";

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email and password are required");
    }

    const exists = await User.findOne({ email });

    if (exists) {
        if (!exists.isVerified) {
            const now = Date.now();

            if (
                exists.lastVerificationSentAt &&
                now - exists.lastVerificationSentAt < 2 * 60 * 1000
            ) {
                res.status(429);
                throw new Error("Please wait before requesting another verification email");
            }

            const token = exists.generateVerificationToken();
            exists.lastVerificationSentAt = now;
            await exists.save();

            await sendVerificationEmail(exists.email, token);

            return res.status(200).json({
                success: true,
                message: "Verification email resent"
            });
        }

        res.status(409);
        throw new Error("Email already in use");
    }

    // 1. Create user (unverified)
    const user = new User({
        name,
        email,
        password,
        isVerified: false
    });

    // 2. Gen verify token
    const token = user.generateVerificationToken();
    user.lastVerificationSentAt = Date.now();
    await user.save();

    // 3. Send verification email
    await sendVerificationEmail(email, token);

    return res.status(201).json({
        success: true,
        message: "Account created. Please verify your email."
    });
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const hashed = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        verificationToken: hashed,
        verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.lastVerificationSentAt = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Email verified successfully"
    });
});

export const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error("User already verified");
    }

    if (
        user.lastVerificationSentAt &&
        Date.now() - user.lastVerificationSentAt < 2 * 60 * 1000
    ) {
        res.status(429);
        throw new Error("Please wait before requesting another email");
    }

    // Generate new token
    const token = user.generateVerificationToken();
    user.lastVerificationSentAt = Date.now();
    await user.save();

    await sendVerificationEmail(email, token);

    res.status(200).json({
        success: true,
        message: "Verification email resent"
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    // 🔐 Email verification check
    if (!user.isVerified) {
        const now = Date.now();

        if (
            !user.lastVerificationSentAt ||
            now - user.lastVerificationSentAt > 2 * 60 * 1000
        ) {
            const token = user.generateVerificationToken();
            user.lastVerificationSentAt = now;
            await user.save();

            await sendVerificationEmail(user.email, token);
        }

        res.status(403);
        throw new Error("Email not verified. Verification email sent.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    return sendAuthPair(user, 200, res, req.ip);
});

export const logout = asyncHandler(async (req, res) => {
    const rt = req.cookies?.rt;
    if (rt) {
        await revokeRefreshToken(rt, req.ip);
    }
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", "", { httpOnly: true, expires: new Date(0), sameSite: isProd ? "none" : "lax", secure: isProd });
    res.cookie("rt", "", { httpOnly: true, expires: new Date(0), sameSite: isProd ? "none" : "lax", secure: isProd });
    res.status(200).json({ success: true });
});

export const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
});

export const refreshToken = asyncHandler(async (req, res) => {
    const current = req.cookies?.rt;
    if (!current) {
        res.status(401);
        throw new Error("No refresh token");
    }
    const rotated = await rotateRefreshToken(current, req.ip);
    if (!rotated) {
        res.status(401);
        throw new Error("Invalid or expired refresh token");
    }
    const access = generateAccessToken(rotated.userId);
    setAuthCookies(res, access, rotated.newValue);
    res.status(200).json({ success: true, token: access });
});

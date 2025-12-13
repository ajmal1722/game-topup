import User from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { sendAuthPair, rotateRefreshToken, revokeRefreshToken, setAuthCookies, generateAccessToken } from "../utils/token.js";
import { generateVerifyToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/senderVerificationEmail.js";

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email and password are required");
    }

    const exists = await User.findOne({ email });
    if (exists) {
        res.status(409);
        throw new Error("Email already in use");
    }

    // 1. Create user (unverified)
    const user = await User.create({
        name,
        email,
        password,
        isVerified: false
    });

    // 2. Gen verify token
    const { token, hashed, expires } = generateVerifyToken();

    user.verificationToken = hashed;
    user.verificationTokenExpires = expires;
    await user.save();

    // 3. Send verification email
    await sendVerificationEmail(email, token);

    return res.status(201).json({
        success: true,
        message: "Account created. Please verify your email."
    });
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
        res.status(400);
        throw new Error("Token missing");
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        verificationToken: hashed,
        verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error("Token invalid or expired");
    }

    // Mark verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Option 1: Auto login user
    return sendAuthPair(user, 200, res, req.ip);

    // Option 2: Just show success message
    // res.status(200).json({ success: true, message: "Email verified" });
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

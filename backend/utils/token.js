import jwt from "jsonwebtoken";

export const sendAuthToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: parseExpiry(process.env.JWT_EXPIRE) ?? 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const parseExpiry = (exp) => {
  if (!exp) return null;
  if (/^\d+d$/.test(exp)) return parseInt(exp) * 24 * 60 * 60 * 1000;
  if (/^\d+h$/.test(exp)) return parseInt(exp) * 60 * 60 * 1000;
  if (/^\d+m$/.test(exp)) return parseInt(exp) * 60 * 1000;
  if (/^\d+s$/.test(exp)) return parseInt(exp) * 1000;
  return null;
};

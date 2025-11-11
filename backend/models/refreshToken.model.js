import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, index: true },
    expires: { type: Date, required: true },
    revoked: { type: Date },
    replacedByToken: { type: String },
    createdByIp: { type: String },
    revokedByIp: { type: String },
  },
  { timestamps: true }
);

refreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires.getTime();
});

refreshTokenSchema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
});

export default mongoose.model('RefreshToken', refreshTokenSchema);

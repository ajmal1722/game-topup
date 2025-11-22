import mongoose from "mongoose";

const adminActivityLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // admin & user share same user schema
            required: true,
        },

        action: {
            type: String,
            required: true,
        },

        // What module this action belongs to
        module: {
            type: String,
            enum: [
                "users",
                "games",
                "products",
                "orders",
                "payments",
                "coupons",
                "categories",
                "dashboard",
                "settings",
                "support",
                "other",
            ],
            default: "other",
        },

        // Store old and new values (optional but powerful)
        changes: {
            type: Object,
            default: {},
        },

        // Entity the admin modified (Order ID, Product ID, etc.)
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },

        targetModel: {
            type: String, // e.g., "Order", "Product"
        },

        ipAddress: {
            type: String,
        },

        userAgent: {
            type: String,
        },

        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("AdminActivityLog", adminActivityLogSchema);
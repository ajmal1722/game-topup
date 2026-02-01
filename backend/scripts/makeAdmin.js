import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

/**
 * Quick script to make a user an admin
 * Usage: node scripts/makeAdmin.js <email>
 * Example: node scripts/makeAdmin.js admin@example.com
 */

const makeAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        if (!email) {
            console.error("❌ Please provide an email address");
            console.log("Usage: node scripts/makeAdmin.js <email>");
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`❌ User not found with email: ${email}`);
            console.log("\n💡 Tip: Register this user first at /signup, then run this script.");
            process.exit(1);
        }

        if (user.role === "admin") {
            console.log(`ℹ️  User ${email} is already an admin`);
            console.log(`\n✅ You can login at: http://localhost:3000/admin/login`);
            process.exit(0);
        }

        // Update user to admin
        user.role = "admin";
        user.isVerified = true; // Auto-verify admin users
        await user.save();

        console.log(`\n✅ Successfully made ${email} an admin!`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Name:     ${user.name}`);
        console.log(`Email:    ${user.email}`);
        console.log(`Role:     ${user.role}`);
        console.log(`Verified: ${user.isVerified}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`\n🚀 You can now login at: http://localhost:3000/admin/login\n`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

const email = process.argv[2];
makeAdmin(email);

import { Request, Response } from "express";
import geoip from "geoip-lite";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { LoginActivity } from "../models/loginActivity.model";
import { sendEmail } from "../config/mailer";

// Login Controller
export const loginUser = async (req: Request, res: Response) => {
     try {
          const { username, password } = req.body;

          if (!username || !password) {
               return res.status(400).json({ message: "Username and password are required" });
          }

          const user = await User.findOne({ username }).populate("role");
          if (!user) {
               return res.status(401).json({ message: "Invalid username or password" });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               return res.status(401).json({ message: "Invalid username or password" });
          }

          // Generate new token
          const token = jwt.sign(
               { id: user._id },
               process.env.JWT_SECRET_KEY as string,
               { expiresIn: "1d" }
          );

          // Invalidate old session (force logout previous device)
          user.isLoggedIn = true;
          user.currentToken = token;
          await user.save();

          // Record login activity
          let ipAddress = req.headers["x-forwarded-for"]?.toString() || req.ip || "";
          if (ipAddress.includes(",")) ipAddress = ipAddress.split(",")[0].trim();
          if (ipAddress.startsWith("::ffff:")) ipAddress = ipAddress.replace("::ffff:", "");

          const geo = geoip.lookup(ipAddress);
          const lat = geo?.ll?.[0] ?? 0;
          const lng = geo?.ll?.[1] ?? 0;

          await LoginActivity.create({
               userId: user._id,
               ipAddress,
               status: "login",
               lat,
               lng,
          });

          res.status(200).json({
               message: "Login successful",
               token,
          });
     } catch (error) {
          console.error("Login error:", error);
          res.status(500).json({ message: "Internal server error" });
     }
};


// Logout Controller
export const logoutUser = async (req: Request, res: Response) => {
     try {
          const userId = (req as any).user?.id;
          if (!userId) return res.status(401).json({ message: "Unauthorized" });

          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          user.isLoggedIn = false;
          user.currentToken = null;
          await user.save();

          let ipAddress = req.headers["x-forwarded-for"]?.toString() || req.ip || "";
          if (ipAddress.includes(",")) ipAddress = ipAddress.split(",")[0].trim();
          if (ipAddress.startsWith("::ffff:")) ipAddress = ipAddress.replace("::ffff:", "");

          const geo = geoip.lookup(ipAddress);
          const lat = geo?.ll?.[0] ?? 0;
          const lng = geo?.ll?.[1] ?? 0;

          await LoginActivity.create({
               userId,
               ipAddress,
               status: "logout",
               lat,
               lng,
          });

          res.status(200).json({ message: "Logout successful" });
     } catch (err) {
          console.error("Logout error:", err);
          res.status(500).json({ message: "Internal server error" });
     }
};


// Permissions Controller
export const getRolePermissions = async (req: Request, res: Response) => {
     try {
          const userId = (req as any).user?.id;
          const user = await User.findById(userId).populate("role");
          const permissions = user?.role
          res.status(200).json({ permissions });
     } catch (err) {
          console.error("Error getting permissions:", err);
          res.status(500).json({ message: "Server error" });
     }
}


// forgot password
export const forgotPassword = async (req: Request, res: Response) => {
     try {
          const userId = (req as any).user?.id;
          const { oldPassword, newPassword } = req.body;

          if (!oldPassword || !newPassword) {
               return res.status(400).json({ message: "Both old and new passwords are required" });
          }

          // Fetch user
          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          // Check old password
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
               return res.status(401).json({ message: "Old password is incorrect" });
          }

          // Hash new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          // Update password
          user.password = hashedPassword;
          await user.save();

          // -------------------------
          // Send Password Change Email (with new password)
          // -------------------------
          if (user.email) {
               const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Hello ${user.firstName},</h2>
                <p>Your BetHive account password has been successfully changed.</p>
                
                <table style="margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Username:</td>
                        <td style="padding: 8px;">${user.username}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">New Password:</td>
                        <td style="padding: 8px;">${newPassword}</td>
                    </tr>
                </table>

                <p style="margin-top: 20px;">You can login to your account here:</p>
                <p>
                    <a href="https://bethive.vercel.app/login" 
                       style="color: #4F9DFF; text-decoration: none;">
                       Login to BetHive
                    </a>
                </p>

                <p>If you did not request this change, reset your password immediately:</p>
                <p>
                    <a href="https://bethive.vercel.app/forgot-password" 
                       style="color: #FACC15; text-decoration: none;">
                       Reset Password
                    </a>
                </p>

                <hr />
                <p style="font-size: 12px; color: #999;">
                    BetHive - Your trusted betting platform
                </p>
            </div>
            `;

               await sendEmail(user.email, "Your BetHive Password Changed", html);
          }

          return res.status(200).json({ message: "Password updated successfully and email sent" });
     } catch (err) {
          console.error("❌ Error in forgotPassword:", err);
          return res.status(500).json({ message: "Server error" });
     }
};


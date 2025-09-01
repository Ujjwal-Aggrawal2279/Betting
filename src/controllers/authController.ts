import { Request, Response } from "express";
import geoip from "geoip-lite";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { LoginActivity } from "../models/loginActivity.model";

// Login Controller
export const loginUser = async (req: Request, res: Response) => {
     try {
          const { username, password } = req.body;

          // 1. Validate request body
          if (!username || !password) {
               return res.status(400).json({ message: "Username and password are required" });
          }

          // 2. Find user by username
          const user = await User.findOne({ username }).populate("role");
          if (!user) {
               return res.status(401).json({ message: "Invalid username or password" });
          }

          // 3. Compare password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               return res.status(401).json({ message: "Invalid username or password" });
          }

          // 4. Generate JWT token
          const token = jwt.sign(
               { id: user._id },
               process.env.JWT_SECRET_KEY as string,
               { expiresIn: "1d" }
          );

          // 5. Record login activity
          let ipAddress = req.headers["x-forwarded-for"]?.toString() || req.ip || "";
          if (ipAddress.includes(",")) ipAddress = ipAddress.split(",")[0].trim();
          if (ipAddress.startsWith("::ffff:")) ipAddress = ipAddress.replace("::ffff:", "");

          // Geo lookup
          let geo = geoip.lookup(ipAddress);
          let lat: number | undefined = geo?.ll[0];
          let lng: number | undefined = geo?.ll[1];

          // Optional: fallback for localhost/private IPs
          if (!lat || !lng) {
               lat = 0;
               lng = 0;
          }

          // 6. Login Activity Creation
          await LoginActivity.create({
               userId: user._id,
               ipAddress,
               status: "login",
               lat,
               lng,
          });

          // 7. Send response
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

          // IP handling
          let ipAddress = req.headers["x-forwarded-for"]?.toString() || req.ip || "";
          if (ipAddress.includes(",")) ipAddress = ipAddress.split(",")[0].trim();
          if (ipAddress.startsWith("::ffff:")) ipAddress = ipAddress.replace("::ffff:", "");

          // Geo lookup
          const geo = geoip.lookup(ipAddress);
          let lat = geo?.ll[0] ?? 0;
          let lng = geo?.ll[1] ?? 0;

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

          // Fetch the user
          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          // Check if old password matches
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
               return res.status(401).json({ message: "Old password is incorrect" });
          }

          // Hash new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          // Update user password
          user.password = hashedPassword;
          await user.save();

          return res.status(200).json({ message: "Password updated successfully" });
     } catch (err) {
          console.error("❌ Error in forgotPassword:", err);
          return res.status(500).json({ message: "Server error" });
     }
};

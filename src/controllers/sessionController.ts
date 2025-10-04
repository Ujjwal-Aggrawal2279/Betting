import { Request, Response } from "express";
import matchSessionsModel, { ISession } from "../models/matchSessions.model";
import matchModel, { IMatch } from "../models/match.model";
import historicalmatchModel from "../models/historicalmatch.model";
import { SessionBet } from "../models/sessionbets.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";

// get all match sessions
export const getAllMatchSessions = async (req: Request, res: Response) => {
       try {
              const allSessions = await matchSessionsModel.find().lean(); // plain JS objects

              if (!allSessions.length) {
                     return res.status(200).json({ message: "No session markets found", data: [] });
              }

              const result = [];

              for (const session of allSessions) {
                     const matchId = session.matchId;

                     // Try to find the match title in either collection
                     let match =
                            (await matchModel.findOne({ matchId }).select("title").lean<IMatch>()) ||
                            (await historicalmatchModel.findOne({ matchId }).select("title").lean<IMatch>());

                     const title = match?.title || "Unknown Match";

                     result.push({
                            matchId,
                            title,
                            sessions: session.sessions,
                            createdAt: session.createdAt,
                            updatedAt: session.updatedAt,
                     });
              }

              res.status(200).json({
                     count: result.length,
                     data: result,
              });
       } catch (error) {
              console.error("Error fetching all match sessions:", error);
              res.status(500).json({ message: "Internal Server Error" });
       }
};


// get particular match sessions
export const getMatchSessions = async (req: Request, res: Response) => {
       try {
              const { matchId } = req.params;

              if (!matchId) {
                     return res.status(400).json({ message: "Match ID is required" });
              }

              const matchSessions = await matchSessionsModel.findOne({ matchId });

              let match = await matchModel.findOne({ matchId }).select("title teamA teamB").lean<IMatch>();

              if (!match) {
                     match = await historicalmatchModel.findOne({ matchId }).select("title teamA teamB").lean<IMatch>();
              }

              if (!match) {
                     return res.status(404).json({ message: "Match not found in any collection" });
              }

              res.status(200).json({
                     title: match.title,
                     teamA: match.teamA,
                     teamB: match.teamB,
                     matchSessions,
              });
       } catch (error) {
              console.error("Error fetching match sessions:", error);
              res.status(500).json({ message: "Internal Server Error" });
       }
};

// create match session
export const createMatchSession = async (req: Request, res: Response) => {
       try {
              const { matchId, teamName, sessions } = req.body;
              if (!matchId) {
                     return res.status(400).json({ message: "Match ID is required" });
              }
              if (!teamName) {
                     return res.status(400).json({ message: "Team ID is required" });
              }
              if (!sessions || !Array.isArray(sessions) || !sessions.length) {
                     return res.status(400).json({ message: "Sessions array is required" });
              }
              const createdBy = (req as any).user?.id;
              const existingSession = await matchSessionsModel.findOne({ matchId, teamName });
              if (existingSession) {
                     const existingOverRanges = existingSession.sessions?.map(s => s.overRange) || [];
                     for (const newSession of sessions) {
                            if (!newSession.overRange) continue;
                            const [newStart, newEnd] = newSession.overRange
                                   .split("-")
                                   .map((s: any) => parseInt(s));
                            for (const existingRange of existingOverRanges) {
                                   const [exStart, exEnd] = existingRange
                                          .replace(/\D/g, " ")
                                          .trim()
                                          .split(" ")
                                          .map(Number);

                                   if (
                                          (newStart >= exStart && newStart <= exEnd) ||
                                          (newEnd >= exStart && newEnd <= exEnd) ||
                                          (newStart <= exStart && newEnd >= exEnd)
                                   ) {
                                          return res.status(400).json({
                                                 message: `Overlapping or duplicate over range detected: ${newSession.overRange} conflicts with existing ${existingRange}`,
                                          });
                                   }
                            }
                     }
                     const matchSession = await matchSessionsModel.findOneAndUpdate(
                            { matchId, teamName },
                            { $push: { sessions: { $each: sessions } }, $set: { createdBy } },
                            { new: true }
                     );
                     return res.status(200).json({
                            message: "Match session updated successfully",
                            data: matchSession,
                     });
              } else {
                     const matchSession = await matchSessionsModel.create({
                            matchId,
                            teamName,
                            sessions,
                            createdBy,
                     });
                     return res.status(200).json({
                            message: "Match session created successfully",
                            data: matchSession,
                     });
              }
       } catch (error) {
              console.error("Error creating match session:", error);
              return res.status(500).json({ message: "Internal Server Error" });
       }
};


// update match session
export const updateActualRuns = async (req: Request, res: Response) => {
       try {
              const { matchId, overRange, actualRuns } = req.body;

              if (!matchId || !overRange || actualRuns === undefined) {
                     return res.status(400).json({ message: "matchId, overRange and actualRuns are required" });
              }

              const updatedSession = await matchSessionsModel.findOneAndUpdate(
                     { matchId, "sessions.overRange": overRange },
                     { $set: { "sessions.$.actualRuns": actualRuns } },
                     { new: true }
              );

              if (!updatedSession) {
                     return res.status(404).json({ message: "Match session or overRange not found" });
              }

              res.status(200).json({
                     message: `Actual runs updated for ${overRange}`,
                     data: updatedSession,
              });
       } catch (error) {
              console.error("Error updating actual runs:", error);
              res.status(500).json({ message: "Internal Server Error" });
       }
};


// create session bets
export const createSessionBet = async (req: Request, res: Response) => {
       const session = await mongoose.startSession();
       session.startTransaction();

       try {
              const userId = (req as any).user?.id;
              if (!userId) {
                     return res.status(401).json({ message: "Unauthorized" });
              }

              const { matchId, overRange, rate, tokenAmount, teamName } = req.body;

              if (!matchId || !overRange || !rate || !tokenAmount || !teamName) {
                     return res.status(400).json({ message: "Missing required fields" });
              }
              const user = await User.findById(userId).select("fullName tokens").session(session);
              if (!user) {
                     return res.status(404).json({ message: "User not found" });
              }
              const existingBet = await SessionBet.findOne({
                     user: userId,
                     matchId,
                     overRange,
                     teamName,
              }).session(session);

              if (existingBet) {
                     if (user.tokens < tokenAmount) {
                            return res.status(400).json({ message: "Insufficient tokens" });
                     }

                     await User.findByIdAndUpdate(
                            userId,
                            { $inc: { tokens: -Number(tokenAmount) } },
                            { new: true, session }
                     );

                     existingBet.tokenAmount += Number(tokenAmount);
                     existingBet.rate = Number(rate);
                     await existingBet.save({ session });

                     await session.commitTransaction();
                     session.endSession();

                     return res.status(200).json({
                            message: "Session bet updated successfully",
                            bet: existingBet,
                     });
              }

              if (user.tokens < tokenAmount) {
                     return res.status(400).json({ message: "Insufficient tokens" });
              }

              await User.findByIdAndUpdate(
                     userId,
                     { $inc: { tokens: -Number(tokenAmount) } },
                     { new: true, session }
              );

              const newSessionBet = new SessionBet({
                     matchId,
                     overRange,
                     rate: Number(rate),
                     tokenAmount: Number(tokenAmount),
                     user: userId,
                     fullName: user.fullName,
                     teamName,
                     result: "pending",
              });

              await newSessionBet.save({ session });

              await session.commitTransaction();
              session.endSession();

              return res.status(201).json({
                     message: "Session bet placed successfully",
                     bet: newSessionBet,
              });
       } catch (error: any) {
              await session.abortTransaction();
              session.endSession();

              console.error("Error creating/updating session bet:", error);
              return res.status(500).json({ message: "Server Error" });
       }
};
import matchOddsModel from "../models/matchOdds.model";
import matchResultModel from "../models/matchResult.model";
import { Bet } from "../models/bets.model";
import { User } from "../models/user.model";

export const updateBetResultsCron = async () => {
       try {
              console.log("⏳ Running Bet Results Cron Job...");

              // 1. Get all bets whose result is still pending
              const pendingBets = await Bet.find({ result: "pending" }).lean();

              if (pendingBets.length === 0) {
                     console.log("✅ No pending bets found");
                     return;
              }

              console.log(`📌 Found ${pendingBets.length} pending bets`);

              await Promise.all(
                     pendingBets.map(async (bet) => {
                            try {
                                   // 2. Get matchOdds by bet.matchId
                                   const odds = await matchOddsModel.findById(bet.matchId).lean();
                                   if (!odds) {
                                          console.warn(`⚠️ No odds found for betId: ${bet._id}, matchOddsId: ${bet.matchId}`);
                                          return;
                                   }

                                   // 3. Get match result from MatchResult collection
                                   const result = await matchResultModel.findOne({ matchId: odds.matchId }).lean();
                                   if (!result) {
                                          console.log(`⏳ No result yet for matchId: ${odds.matchId}`);
                                          return;
                                   }

                                   // 4. Determine bet outcome
                                   let newResult: "won" | "lost";
                                   if (result.winningTeamId && Number(bet.teamId) === result.winningTeamId) {
                                          newResult = "won";

                                          // 5. Calculate winning tokens: rate * tokenAmount
                                          const winningTokens = bet.rate * bet.tokenAmount;

                                          // 6. Update user tokens
                                          const updatedUser = await User.findByIdAndUpdate(
                                                 bet.user,
                                                 { $inc: { tokens: winningTokens } },
                                                 { new: true }
                                          );

                                          console.log(`✅ Credited ${winningTokens} tokens to user ${updatedUser?._id}`);
                                   } else {
                                          newResult = "lost";
                                   }

                                   // 7. Update bet with result and settledAt
                                   await Bet.findByIdAndUpdate(bet._id, {
                                          $set: { result: newResult, settledAt: new Date() }
                                   });

                                   console.log(
                                          `✅ Bet ${bet._id} updated -> ${newResult} (teamId: ${bet.teamId}, winner: ${result.winningTeamId})`
                                   );

                            } catch (err: any) {
                                   console.error(`❌ Error updating betId ${bet._id}:`, err.message);
                            }
                     })
              );

              console.log("🎯 Bet Results Cron Job Finished");
       } catch (error: any) {
              console.error("❌ Cron Job Failed:", error.message);
       }
};

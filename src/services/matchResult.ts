import axios from "axios";
import matchModel from "../models/match.model";
import matchResultModel from "../models/matchResult.model";

export const updateMatchResultsCron = async () => {
       try {
              console.log("⏳ Running Match Results Cron Job...");

              // 1. Get all matches (live + historical)
              const liveMatches = await matchModel.find().lean();

              // Merge both
              const allMatches = [...liveMatches];

              if (allMatches.length === 0) {
                     console.log("✅ No matches pending result update");
                     return;
              }

              console.log(`📌 Found ${allMatches.length} matches to update`);

              // 2. Process all matches
              await Promise.all(
                     allMatches.map(async (match) => {
                            try {
                                   const entityUrl = `https://restapi.entitysport.com/exchange/matches/${match.matchId}/info?token=${process.env.ENTITY_EXCHANGE_ACCESS_TOKEN}`;
                                   const { data } = await axios.get(entityUrl);

                                   if (!data?.response) {
                                          console.warn(`⚠️ No response for matchId: ${match.matchId}`);
                                          return;
                                   }

                                   const result = data?.response?.match_info?.result || null;
                                   const winningTeamId = data?.response?.match_info?.winning_team_id || null;

                                   // ✅ Upsert into MatchResult collection
                                   await matchResultModel.updateOne(
                                          { matchId: match.matchId },
                                          {
                                                 $set: {
                                                        matchId: match.matchId,
                                                        winningTeamId,
                                                        result,
                                                 },
                                          },
                                          { upsert: true }
                                   );

                                   console.log(
                                          `✅ Saved result for matchId: ${match.matchId}, Result: ${result}, Winner Team: ${winningTeamId}`
                                   );
                            } catch (err: any) {
                                   console.error(`❌ Error updating matchId ${match.matchId}:`, err.message);
                            }
                     })
              );

              console.log("🎯 Match Results Cron Job Finished");
       } catch (error: any) {
              console.error("❌ Cron Job Failed:", error.message);
       }
};

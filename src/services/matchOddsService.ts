import axios from "axios";
import matchModel from "../models/match.model";
import matchOddsModel from "../models/matchOdds.model";

const safeParse = (val: any): number => {
       const num = parseFloat(val);
       return isNaN(num) ? 0 : num;
};

export const fetchAndUpsertMatchOdds = async () => {
       try {
              const matches = await matchModel.find({ status: { $in: ["Scheduled", "Live"] } });
              if (!matches.length) {
                     console.log("No scheduled/live matches found.");
                     return;
              }

              for (const match of matches) {
                     try {
                            const entityUrl = `https://restapi.entitysport.com/exchange/matches/${match.matchId}/odds?token=${process.env.ENTITY_EXCHANGE_ACCESS_TOKEN}`;
                            const { data } = await axios.get(entityUrl, { timeout: 5000 });

                            if (!data?.response?.live_odds) {
                                   console.log(`No odds found for match ${match.matchId}`);
                                   continue;
                            }

                            for (const [type, odds] of Object.entries<any>(data?.response?.live_odds)) {
                                   const filter = { matchId: match.matchId, type, source: "API" };

                                   const update = {
                                          matchId: match.matchId,
                                          type,
                                          source: "API",
                                          createdBy: null,
                                          odds: {
                                                 teama: {
                                                        teamId: data?.response?.match_info?.teama?.team_id,
                                                        teamName: data?.response?.match_info?.teama?.name,
                                                        back: safeParse(odds.teama.back),
                                                        lay: safeParse(odds.teama.lay),
                                                 },
                                                 teamb: {
                                                        teamId: data?.response?.match_info?.teamb?.team_id,
                                                        teamName: data?.response?.match_info?.teamb?.name,
                                                        back: safeParse(odds.teamb.back),
                                                        lay: safeParse(odds.teamb.lay),
                                                 },
                                          },
                                   };

                                   await matchOddsModel.findOneAndUpdate(filter, { $set: update }, { upsert: true, new: true });
                            }

                            console.log(`✅ Updated odds for match ${match.matchId}`);
                     } catch (err: any) {
                            console.error(`❌ Failed fetching odds for match ${match.matchId}`, err.message);
                     }
              }
       } catch (err: any) {
              console.error("Error in fetchAndUpsertMatchOdds:", err.message);
       }
};

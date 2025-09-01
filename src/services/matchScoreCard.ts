import axios from "axios";
import matchModel from "../models/match.model";
import MatchScoreCard, { IMatchScoreCard } from "../models/matchScoreCard.model";

export const fetchMatchScoreCard = async () => {
       try {
              // Find all live matches
              const matches = await matchModel.find({ status: "Live" });
              if (!matches.length) {
                     console.log("No live matches found.");
                     return;
              }

              for (const match of matches) {
                     try {
                            const entityUrl = `https://restapi.entitysport.com/exchange/matches/${match.matchId}/info?token=${process.env.ENTITY_EXCHANGE_ACCESS_TOKEN}`;
                            const { data } = await axios.get(entityUrl, { timeout: 10000 });

                            const scoreData = data?.response?.scorecard;
                            if (!scoreData) {
                                   console.log(`No scorecard found for match ${match.matchId}`);
                                   continue;
                            }

                            // Upsert scorecard: create if doesn't exist, update if exists
                            await MatchScoreCard.findOneAndUpdate(
                                   { matchId: match.matchId },
                                   { scoreData },
                                   { upsert: true, new: true }
                            );

                            console.log(`Scorecard updated for match ${match.matchId}`);
                     } catch (err: any) {
                            console.error(`Failed to fetch scorecard for match ${match.matchId}:`, err.message);
                     }
              }
       } catch (err: any) {
              console.error("Error fetching matches:", err.message);
       }
};

import matchModel from "../models/match.model";
import matchSessionsModel from "../models/matchSessions.model";
import { ISession } from "../models/matchSessions.model";

export const updateMatchSessions = async () => {
       try {
              const matches = await matchModel.find({ status: "Live" });

              if (!matches.length) {
                     console.log("No live matches found.");
                     return;
              }

              for (const match of matches) {
                     const dummySessions: ISession[] = [];

                     await matchSessionsModel.findOneAndUpdate(
                            { matchId: match.matchId },
                            {
                                   $setOnInsert: {
                                          matchId: match.matchId,
                                          sessions: dummySessions,
                                          createdBy: null,
                                   },
                            },
                            { upsert: true, new: true }
                     );
              }

              console.log("Session markets ensured for all live matches ✅");
       } catch (error) {
              console.error("Error updating match sessions:", error);
       }
};

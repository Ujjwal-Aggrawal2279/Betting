import { Server } from "socket.io";
import axios from "axios";
import matchModel from "../models/match.model";
import historicalmatchModel from "../models/historicalmatch.model";

// Today Date
const getTodayDateString = (): string => {
       const today = new Date();
       const yyyy = today.getFullYear();
       const mm = String(today.getMonth() + 1).padStart(2, "0");
       const dd = String(today.getDate()).padStart(2, "0");
       return `${yyyy}-${mm}-${dd}`;
};

// Fetching and upserting today`s matches
export const fetchAndUpsertMatches = async (io?: Server) => {
       const today = getTodayDateString();
       const ENTITY_API_URL = `https://restapi.entitysport.com/v2/matches/?date=${today}_${today}&token=${process.env.ENTITY_ACCESS_TOKEN}`;
       try {
              const response = await axios.get(`${ENTITY_API_URL}`);
              const matches = response.data?.response?.items || [];

              for (const match of matches) {
                     const status = match?.status_str;

                     if (status === "Completed" || status === "Cancelled") {
                            await historicalmatchModel.updateOne(
                                   { matchId: match?.match_id },
                                   {
                                          $set: {
                                                 title: match?.title,
                                                 teamA: match?.teama?.name,
                                                 teamB: match?.teamb?.name,
                                                 teamALogo: match?.teama?.logo_url,
                                                 teamBLogo: match?.teamb?.logo_url,
                                                 venue: match?.venue?.name,
                                                 format: match?.format_str,
                                                 startDate: match?.date_start_ist,
                                                 endDate: match?.date_end_ist ? match?.date_end_ist : undefined,
                                                 status: status,
                                          },
                                   },
                                   { upsert: true }
                            );

                            await matchModel.deleteOne({ matchId: match?.match_id });
                     } else {
                            await matchModel.updateOne(
                                   { matchId: match?.match_id },
                                   {
                                          $set: {
                                                 title: match?.title,
                                                 teamA: match?.teama?.name,
                                                 teamB: match?.teamb?.name,
                                                 teamALogo: match?.teama?.logo_url,
                                                 teamBLogo: match?.teamb?.logo_url,
                                                 venue: match?.venue?.name,
                                                 format: match?.format_str,
                                                 startDate: match?.date_start_ist,
                                                 endDate: match?.date_end_ist ? match?.date_end_ist : undefined,
                                                 status: status,
                                          },
                                   },
                                   { upsert: true }
                            );
                     }
              }

              console.log(`[${new Date().toISOString()}] Matches updated: ${matches.length}`);

              // Emit updated live matches to all connected clients
              if (io) {
                     const liveMatches = await matchModel.find({ status: "Live" }).lean();
                     io.emit("matchesUpdated", liveMatches);
              }
       } catch (err) {
              console.error("Error fetching matches:", err);
       }
};


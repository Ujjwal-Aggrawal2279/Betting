import { Server, Socket } from "socket.io";
import matchModel from "../models/match.model";
import historicalMatchModel from "../models/historicalmatch.model";

const convertToIST = (utcDate?: Date) => {
       if (!utcDate) return null;
       const istOffset = 5.5 * 60; 
       const date = new Date(utcDate.getTime() + istOffset * 60 * 1000);
       return date.toISOString(); 
};

export const registerMatchFetchHandlers = (io: Server, socket: Socket) => {
       console.log("🟢 Match socket handler registered for:", socket.id);

       socket.on("getMatches", async ({ status }, callback) => {
              try {
                     let matches;

                     if (status === "Live" || status === "Scheduled") {
                            matches = await matchModel.find({ status }).lean();
                     } else if (status === "Completed" || status === "Cancelled") {
                            matches = await historicalMatchModel.find({ status }).lean();
                     } else {
                            return callback({ success: false, message: "Invalid status" });
                     }

                     // Convert dates to IST
                     const converted = matches.map((match) => ({
                            ...match,
                            startDate: convertToIST(match.startDate),
                            endDate: convertToIST(match.endDate),
                     }));

                     callback({ success: true, data: converted });
              } catch (err) {
                     console.error("Error fetching matches via socket:", err);
                     callback({ success: false, message: "Server error" });
              }
       });
};

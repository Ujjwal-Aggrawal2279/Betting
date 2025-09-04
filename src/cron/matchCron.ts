import cron from "node-cron";
import { Server } from "socket.io";
import { fetchAndUpsertMatches } from "../services/matchService";
import { fetchAndUpsertMatchOdds } from "../services/matchOddsService";
import { fetchMatchScoreCard } from "../services/matchScoreCard";

export const scheduleMatchCron = (io: Server) => {
       // Daily fetch at 00:15 AM
       cron.schedule("15 0 * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running daily match fetch...`);
              await fetchAndUpsertMatches(io);
       });

       // Every 10 mins fetch for new/updated matches
       cron.schedule("*/10 * * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running every 10 mins match update...`);
              await fetchAndUpsertMatches(io);
       });

       // Every 5 minutes fetch odds for live/scheduled matches
       cron.schedule("*/5 * * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running every 15 minutes match odds update...`);
              await fetchAndUpsertMatchOdds();
       })

       // Every 5 minutes fetch scoreCard for live matches
       cron.schedule("*/5 * * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running every 5 minutes match scoreCard update...`);
              await fetchMatchScoreCard();
       })
};

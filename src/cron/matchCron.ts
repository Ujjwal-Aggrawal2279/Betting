import cron from "node-cron";
import { Server } from "socket.io";
import { fetchAndUpsertMatches } from "../services/matchService";
import { fetchAndUpsertMatchOdds } from "../services/matchOddsService";
import { fetchMatchScoreCard } from "../services/matchScoreCard";
import { updateMatchResultsCron } from "../services/matchResult";
import { updateBetResultsCron } from "../services/betResult";

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

       // Every 2 minutes fetch odds for live/scheduled matches
       cron.schedule("*/2 * * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running every 2 minutes match odds update...`);
              await fetchAndUpsertMatchOdds();
       })

       // Every 2 minutes fetch scoreCard for live matches
       cron.schedule("*/2 * * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running every 2 minutes match scoreCard update...`);
              await fetchMatchScoreCard();
       })

       // Every 2 minutes update result for matches
       cron.schedule("*/2 * * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running every 2 minutes match result update...`);
              await updateMatchResultsCron();
       })

       // Every 5 minutes update tokens based on result
       cron.schedule("*/5 * * * *", async () => {
              console.log(`[${new Date().toISOString()}] Running every 5 minutes token update...`);
              await updateBetResultsCron();
       })
};

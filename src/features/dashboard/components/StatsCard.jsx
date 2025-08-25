import { Users, UserCheck, UserX, UserPlus, Coins, Trophy, XCircle, Hourglass, ClipboardList, CheckCircle2, Clock3, Ban } from "lucide-react";

const iconMap = {
       "Total Users": Users,
       "Active Users": UserCheck,
       "Inactive Users": UserX,
       "New Users (Today)": UserPlus,
       "Today's Bets": ClipboardList,
       "Won Bets (Today)": Trophy,
       "Lost Bets (Today)": XCircle,
       "Pending Bets (Today)": Hourglass,
       "Tokens Requested (Today)": Coins,
       "Tokens Approved (Today)": CheckCircle2,
       "Tokens Pending (Today)": Clock3,
       "Tokens Rejected (Today)": Ban,
};

const StatsCard = ({ title, value, Icon }) => {
       return (
              <div
                     className="flex flex-col justify-between rounded-sm p-5 border border-[#666E9733] 
                 bg-gradient-to-br from-[#13162080] to-[#13162000] 
                 backdrop-blur-md shadow-lg transition-transform transform 
                 hover:scale-105 hover:shadow-[#666E97]/30 
                 h-36 font-display cursor-pointer"
              >
                     <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">{title}</p>
                            {Icon && <Icon className="w-10 h-10 text-[#EC981A]" />}
                     </div>
                     <h2 className="text-3xl font-bold text-white">{value}</h2>
              </div>
       );
};

const DashboardStats = ({ data }) => {
       const stats = [
              { title: "Total Users", value: data.totalUsers },
              { title: "Active Users", value: data.totalactiveUsers },
              { title: "Inactive Users", value: data.totalInactiveUsers },
              { title: "New Users (Today)", value: data.newUsers },
              { title: "Today's Bets", value: data.todaysBets },
              { title: "Won Bets (Today)", value: data.wonBets },
              { title: "Lost Bets (Today)", value: data.lostBets },
              { title: "Pending Bets (Today)", value: data.pendingBets },
              { title: "Tokens Requested (Today)", value: data.tokensRequested },
              { title: "Tokens Approved (Today)", value: data.tokensApproved },
              { title: "Tokens Pending (Today)", value: data.tokensPendingApproval },
              { title: "Tokens Rejected (Today)", value: data.tokensRejected },
       ];

       return (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 w-full">
                     {stats.map((stat, idx) => {
                            const Icon = iconMap[stat.title];
                            return <StatsCard key={idx} title={stat.title} value={stat.value} Icon={Icon} />;
                     })}
              </div>
       );
};

export default DashboardStats;

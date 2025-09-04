import { Users, UserCheck, UserX, UserPlus, Coins, Trophy, XCircle, Hourglass, ClipboardList, CheckCircle2, Clock3, Ban, Loader2 } from "lucide-react";

const iconMap = {
       "Total Users": Users,
       "Active Users": UserCheck,
       "Inactive Users": UserX,
       "New Users (Today)": UserPlus,
       "Live Matches": ClipboardList,
       "Completed Matches": Trophy,
       "Cancelled Matches": XCircle,
       "Scheduled Matches": Hourglass,
       "Tokens Requested": Coins,
       "Tokens Approved": CheckCircle2,
       "Tokens Pending": Clock3,
       "Tokens Rejected": Ban,
};

const StatsCard = ({ title, value, Icon, loading }) => {
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
                     <h2 className="text-3xl font-bold text-white">
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : value}
                     </h2>
              </div>
       );
};

const DashboardStats = ({ data, loading }) => {
       const stats = [
              { title: "Total Users", value: data?.totalUsers },
              { title: "Active Users", value: data?.totalActiveUsers },
              { title: "Inactive Users", value: data?.totalInactiveUsers },
              { title: "New Users (Today)", value: data?.newUsers },
              { title: "Live Matches", value: data?.liveMatches },
              { title: "Completed Matches", value: data?.completedMatches },
              { title: "Cancelled Matches", value: data?.cancelledMatches },
              { title: "Scheduled Matches", value: data?.scheduledMatches },
              { title: "Tokens Requested", value: data?.tokensRequested },
              { title: "Tokens Approved", value: data?.tokensApproved },
              { title: "Tokens Pending", value: data?.tokensPendingApproval },
              { title: "Tokens Rejected", value: data?.tokensRejected },
       ];

       return (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 w-full">
                     {stats.map((stat, idx) => {
                            const Icon = iconMap[stat.title];
                            return <StatsCard key={idx} title={stat.title} value={stat.value} Icon={Icon} loading={loading} />;
                     })}
              </div>
       );
};

export default DashboardStats;

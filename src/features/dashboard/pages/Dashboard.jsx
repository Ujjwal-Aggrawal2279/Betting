import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/common/Layout";
import NavigationSidebar from "../../home/components/NavigationSidebar";
import DashboardStats from "../components/StatsCard";
import TokensFlowChart from "../components/TokenFlowChart";
import { useEffect } from "react";
import { fetchDashboardStats } from "../../../store/slices/dashboardSlice";

const Dashboard = () => {
       const dispatch = useDispatch();
       const stats = useSelector((state) => state.stats);
       const {
              totalUsers,
              totalActiveUsers,
              totalInactiveUsers,
              newUsers,
              liveMatches,
              scheduledMatches,
              completedMatches,
              cancelledMatches,
              tokensRequested,
              tokensApproved,
              tokensPendingApproval,
              tokensRejected,
              loading,
       } = stats;

       useEffect(() => {
              dispatch(fetchDashboardStats());
       }, [dispatch]);

       const data = {
              totalUsers,
              totalActiveUsers,
              totalInactiveUsers,
              newUsers,
              liveMatches,
              scheduledMatches,
              completedMatches,
              cancelledMatches,
              tokensRequested,
              tokensApproved,
              tokensPendingApproval,
              tokensRejected,
       };

       return (
              <Layout>
                     <div className="flex flex-row h-full">
                            <NavigationSidebar />
                            <div className="w-full">
                                   <DashboardStats data={data} loading={loading} />
                                   <TokensFlowChart />
                            </div>
                     </div>
              </Layout>
       );
};

export default Dashboard;

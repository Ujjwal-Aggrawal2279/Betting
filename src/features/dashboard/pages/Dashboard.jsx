import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../../home/components/NavigationSidebar'
import DashboardStats from '../components/StatsCard'
import TokensFlowChart from '../components/TokenFlowChart'
const data = { "totalUsers": 100, "totalactiveUsers": 85, "totalInactiveUsers": 15, "newUsers": 20, "todaysBets": 20, "wonBets": 87, "lostBets": 10, "pendingBets": 180, "tokensRequested": 10000, "tokensApproved": 5000, "tokensPendingApproval": 3000, "tokensRejected": 2000 }
const Dashboard = () => {
       return (
              <Layout>
                     <div className='flex flex-row h-full'>
                            <NavigationSidebar />
                            <div className='w-full'>
                                   <DashboardStats data={data} />
                                   <TokensFlowChart />
                            </div>
                     </div>
              </Layout>
       )
}

export default Dashboard

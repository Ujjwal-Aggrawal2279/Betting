import NavigationSidebar from '../../home/components/NavigationSidebar'
import Layout from '../../../components/common/Layout'
import BetsList from '../components/BetsList'

const Betspage = () => {
     return (
          <Layout>
               <div className='flex flex-row h-full'>
                    <NavigationSidebar />
                    <div className='w-full'>
                         <BetsList />
                    </div>
               </div>
          </Layout>
     )
}

export default Betspage

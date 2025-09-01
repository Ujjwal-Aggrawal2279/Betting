import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../../home/components/NavigationSidebar'
import MatchOddsTable from '../components/MatchOddsTable';

const RatesPage = () => {

       return (
              <Layout>
                     <div className="flex flex-row h-full">
                            <NavigationSidebar />
                            <div className="w-full p-4">
                                   <MatchOddsTable />
                            </div>
                     </div>
              </Layout>
       );
};

export default RatesPage;

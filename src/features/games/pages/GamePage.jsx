import React from 'react'
import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../../home/components/NavigationSidebar'
import CategoryTabs from '../components/CategoryTab'

const GamePage = () => {
       return (
              <Layout>
                     <div className='flex flex-row h-full'>
                            <NavigationSidebar />
                            <div className='w-full'>
                                   <CategoryTabs />
                            </div>
                     </div>

              </Layout>
       )
}

export default GamePage

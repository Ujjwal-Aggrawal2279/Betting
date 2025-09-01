import React from 'react'
import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../../home/components/NavigationSidebar'
import TokenList from '../components/TokenList'

const TokenPage = () => {
       return (
              <Layout>
                     <div className='flex flex-row h-full'>
                            <NavigationSidebar />
                            <div className='w-full'>
                                   <TokenList />
                            </div>
                     </div>

              </Layout>
       )
}

export default TokenPage

import React from 'react'
import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../components/NavigationSidebar'
import MainSection from '../components/MainSection'
import GlobalChat from '../components/GlobalChat'
import GamesSection from '../components/GamesSection'

const HomePage = () => {
       return (
              <Layout>
                     <div className='w-screen flex h-full'>
                            <NavigationSidebar />
                            <GamesSection />
                            <GlobalChat />
                     </div>
              </Layout>
       )
}

export default HomePage

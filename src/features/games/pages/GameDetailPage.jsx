import React from 'react'
import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../../home/components/NavigationSidebar'
import { useLocation } from 'react-router-dom'
import GameTabs from '../components/GamesTab'

const GameDetailPage = () => {
       const location = useLocation()
       const matchId = location.state
       return (
              <Layout>
                     <div className='flex flex-row h-full'>
                            <NavigationSidebar />
                            <div className='w-full'>
                                   <GameTabs matchId={matchId} />
                            </div>
                     </div>
              </Layout>
       )
}

export default GameDetailPage

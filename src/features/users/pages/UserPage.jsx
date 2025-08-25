import React from 'react'
import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../../home/components/NavigationSidebar'
import UserList from '../components/UserList'

const UserPage = () => {

  return (
    <Layout>
      <div className='flex flex-row h-full'>
        <NavigationSidebar />
        <div className='w-full'>
          <UserList />
        </div>
      </div>
    </Layout>
  )
}

export default UserPage

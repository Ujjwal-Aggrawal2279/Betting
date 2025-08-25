import React from 'react'
import RolesTree from '../components/RoleTree'
import Layout from '../../../components/common/Layout'
import NavigationSidebar from '../../home/components/NavigationSidebar'

const Roles = () => {
       return (
              <Layout>
                     <div className='flex flex-row h-full'>
                            <NavigationSidebar />
                            <div className='w-full'>
                                   <RolesTree />
                            </div>
                     </div>
              </Layout>
       )
}

export default Roles

import { useState } from "react";
import Layout from "../../../components/common/Layout"
import NavigationSidebar from "../../home/components/NavigationSidebar"
import SessionList from "../components/SessionList"
import SessionDetail from "../components/SessionDetail";

const Session = () => {
       const [selectedMatchId, setSelectedMatchId] = useState(null);
       return (
              <Layout>
                     <div className="flex flex-row h-full">
                            <NavigationSidebar />
                            <div className="w-full">
                                   {!selectedMatchId && (
                                          <SessionList onView={(matchId) => setSelectedMatchId(matchId)} />
                                   )}
                                   {selectedMatchId && (
                                          <SessionDetail
                                                 matchId={selectedMatchId}
                                                 onBack={() => setSelectedMatchId(null)}
                                          />
                                   )}
                            </div>
                     </div>
              </Layout>
       )
}

export default Session

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OctagonAlert } from "lucide-react";
import { fetchMatches } from "../../../store/slices/matchSlice";
import { connectSocket, disconnectSocket, getMatches, onMatchesUpdated } from "../../../services/socket-client";
import GameCard from "../../games/components/GameCard";

const GamesSection = () => {
       const dispatch = useDispatch();
       const { matches, loading, error } = useSelector((state) => state.match);
       const [activeTab, setActiveTab] = useState("live");
       const [syncMessage, setSyncMessage] = useState("");

       // Memoized mapping of tab -> API / socket status
       const statusMap = useMemo(
              () => ({
                     live: "Live",
              }),
              []
       );

       const currentStatus = statusMap[activeTab];

       // Fetch matches via REST whenever the tab changes
       useEffect(() => {
              if (!currentStatus) return;
              dispatch(fetchMatches(currentStatus));
       }, [currentStatus, dispatch]);

       // Setup socket connection & listeners
       useEffect(() => {
              connectSocket();
              if (!currentStatus) return;

              // Initial fetch via socket
              getMatches(currentStatus, (response) => {
                     if (response.success) {
                            dispatch({
                                   type: "matches/fetchMatches/fulfilled",
                                   payload: response.data,
                            });
                     }
              });

              // Listen for live updates
              const handleMatchesUpdated = (updatedMatches) => {
                     const filtered = updatedMatches.filter((m) => m.status === currentStatus);
                     dispatch({
                            type: "matches/fetchMatches/fulfilled",
                            payload: filtered,
                     });
                     // Show "Matches Synced" briefly
                     setSyncMessage("Matches Synced");
                     setTimeout(() => setSyncMessage(""), 2000);
              };

              onMatchesUpdated(handleMatchesUpdated);

              return () => {
                     disconnectSocket();
              };
       }, [currentStatus, dispatch]);

       return (
              <div className="relative h-full 2xl:w-[70%] xl:w-[68%] lg:w-[55%] px-2">
                     {syncMessage && (
                            <div className="absolute top-0 right-0 m-4 p-2 bg-green-600 text-white rounded-md shadow-lg z-50">
                                   {syncMessage}
                            </div>
                     )}

                     <Tabs
                            defaultValue="live"
                            className="w-full p-5 font-display"
                            value={activeTab}
                            onValueChange={setActiveTab}
                     >
                            {/* Tab Buttons */}
                            <TabsList className="grid grid-cols-1 bg-[#1f2133] p-1 rounded-lg">
                                   {Object.keys(statusMap).map((tab) => (
                                          <TabsTrigger
                                                 key={tab}
                                                 value={tab}
                                                 className="data-[state=active]:bg-[#4f5fff] data-[state=active]:text-white data-[state=active]:font-semibold text-[#c0c0c0] rounded-md hover:bg-[#3b3f5c] transition-colors cursor-pointer"
                                          >
                                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                          </TabsTrigger>
                                   ))}
                            </TabsList>

                            {/* Tab Contents */}
                            <TabsContent
                                   value={activeTab}
                                   className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                            >
                                   {loading ? (
                                          <p className="text-white col-span-full">Loading...</p>
                                   ) : error ? (
                                          <p className="text-red-500 col-span-full">{error}</p>
                                   ) : matches.length === 0 ? (
                                          <p className="text-gray-400 col-span-full flex gap-5 items-center p-1">
                                                 <OctagonAlert /> No matches found
                                          </p>
                                   ) : (
                                          matches.map((match, index) => (
                                                 <GameCard
                                                        key={index}
                                                        matchId={match.matchId}
                                                        format={match.format}
                                                        teamA={match.teamA}
                                                        logoA={match.teamALogo}
                                                        teamB={match.teamB}
                                                        logoB={match.teamBLogo}
                                                        title={match.title}
                                                        venue={match.venue}
                                                        startDate={match.startDate}
                                                        endDate={match.endDate}
                                                 />
                                          ))
                                   )}
                            </TabsContent>
                     </Tabs>
              </div>
       );
};

export default GamesSection;

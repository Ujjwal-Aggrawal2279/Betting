import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Odds from "./Odds";
import ScoreCard from "./ScoreCard";

const GameTabs = ({ matchId }) => {

       return (
              <div className="w-full mt-4 px-3">
                     <Tabs defaultValue="scorecard" className="w-full">
                            {/* Tabs Header */}
                            <TabsList className="grid w-full grid-cols-2 bg-[#1f2133] p-0 rounded-lg">
                                   <TabsTrigger
                                          value="scorecard"
                                          className="data-[state=active]:bg-[#4f5fff] data-[state=active]:text-white data-[state=active]:font-semibold text-[#c0c0c0] rounded-md hover:bg-[#3b3f5c] transition-colors cursor-pointer"
                                   >
                                          Scorecard
                                   </TabsTrigger>
                                   <TabsTrigger
                                          value="odds"
                                          className="data-[state=active]:bg-[#4f5fff] data-[state=active]:text-white data-[state=active]:font-semibold text-[#c0c0c0] rounded-md hover:bg-[#3b3f5c] transition-colors cursor-pointer"
                                   >
                                          Odds
                                   </TabsTrigger>
                            </TabsList>

                            {/* Scorecard Tab */}
                            <TabsContent value="scorecard" className="mt-4">
                                   <ScoreCard matchId={matchId} />
                            </TabsContent>

                            {/* Odds Tab */}
                            <TabsContent value="odds" className="mt-4">
                                   <Odds matchId={matchId} />
                            </TabsContent>
                     </Tabs>
              </div>
       );
};

export default GameTabs;

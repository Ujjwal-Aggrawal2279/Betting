import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMatchScoreCard } from "../../../store/slices/matchSlice";
import {
       Tabs,
       TabsContent,
       TabsList,
       TabsTrigger,
} from "@/components/ui/tabs";
import {
       Card,
       CardHeader,
       CardTitle,
       CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Activity, Zap } from "lucide-react";

const ScoreCard = ({ matchId }) => {
       const dispatch = useDispatch();
       const { matchScoreCard, loadingScoreCard, error } = useSelector(
              (state) => state.match
       );
       const [activeTab, setActiveTab] = useState("innings1");

       useEffect(() => {
              if (matchId) dispatch(getMatchScoreCard(matchId?.matchId));
       }, [matchId, dispatch]);

       if (loadingScoreCard) return <p className="text-white">Loading scorecard...</p>;
       if (error) return <p className="text-red-500">{error}</p>;
       if (!matchScoreCard?.innings) return <p className="text-gray-400">No scorecard available.</p>;

       const innings = matchScoreCard.innings;

       return (
              <Card className="bg-gradient-to-br from-[#1f2133]/80 to-[#272b42]/80 border border-white/10 backdrop-blur-md shadow-lg mt-4 font-display">
                     <CardHeader>
                            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                                   <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                                   Match Scorecard
                            </CardTitle>
                     </CardHeader>
                     <CardContent>
                            <Tabs
                                   value={activeTab}
                                   onValueChange={setActiveTab}
                                   className="w-full"
                            >
                                   <TabsList
                                          className={`grid gap-2 p-1 rounded-lg bg-gradient-to-r from-blue-700/20 to-purple-700/20 backdrop-blur-md ${innings.length === 1
                                                 ? "grid-cols-1"
                                                 : innings.length === 2
                                                        ? "grid-cols-2"
                                                        : innings.length === 3
                                                               ? "grid-cols-3"
                                                               : "grid-cols-4"
                                                 }`}
                                   >
                                          {innings.map((inn, index) => (
                                                 <TabsTrigger
                                                        key={index}
                                                        value={`innings${index + 1}`}
                                                        className="text-white text-sm font-semibold data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-500 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-transform rounded-lg"
                                                 >
                                                        {inn.name || `Innings ${index + 1}`}
                                                 </TabsTrigger>
                                          ))}
                                   </TabsList>

                                   {innings.map((inn, index) => (
                                          <TabsContent
                                                 key={index}
                                                 value={`innings${index + 1}`}
                                                 className="mt-4"
                                          >
                                                 <div className="overflow-x-auto">
                                                        {/* Batsmen Table */}
                                                        <div className="mb-6">
                                                               <h3 className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
                                                                      <User className="w-4 h-4 text-blue-400" /> Batsmen
                                                               </h3>
                                                               <table className="w-full text-sm text-gray-300 rounded-md overflow-hidden shadow-md backdrop-blur-sm bg-white/5">
                                                                      <thead className="bg-white/10">
                                                                             <tr className="text-left border-b border-white/20">
                                                                                    <th className="px-3 py-2">Batsman</th>
                                                                                    <th className="px-3 py-2">R</th>
                                                                                    <th className="px-3 py-2">B</th>
                                                                                    <th className="px-3 py-2">4s</th>
                                                                                    <th className="px-3 py-2">6s</th>
                                                                                    <th className="px-3 py-2">SR</th>
                                                                             </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                             {inn.batsmen.map((batsman, idx) => (
                                                                                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                                                                           <td className="px-3 py-2">{batsman.name}</td>
                                                                                           <td className="px-3 py-2">{batsman.runs}</td>
                                                                                           <td className="px-3 py-2">{batsman.balls_faced}</td>
                                                                                           <td className="px-3 py-2">{batsman.fours}</td>
                                                                                           <td className="px-3 py-2">{batsman.sixes}</td>
                                                                                           <td className="px-3 py-2">{batsman.strike_rate}</td>
                                                                                    </tr>
                                                                             ))}
                                                                      </tbody>
                                                               </table>
                                                        </div>

                                                        <Separator className="my-4 border-white/20" />

                                                        {/* Bowlers Table */}
                                                        <div>
                                                               <h3 className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
                                                                      <Activity className="w-4 h-4 text-red-400" /> Bowlers
                                                               </h3>
                                                               <table className="w-full text-sm text-gray-300 rounded-md overflow-hidden shadow-md backdrop-blur-sm bg-white/5">
                                                                      <thead className="bg-white/10">
                                                                             <tr className="text-left border-b border-white/20">
                                                                                    <th className="px-3 py-2">Bowler</th>
                                                                                    <th className="px-3 py-2">O</th>
                                                                                    <th className="px-3 py-2">M</th>
                                                                                    <th className="px-3 py-2">R</th>
                                                                                    <th className="px-3 py-2">W</th>
                                                                                    <th className="px-3 py-2">Econ</th>
                                                                             </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                             {inn.bowlers.map((bowler, idx) => (
                                                                                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                                                                           <td className="px-3 py-2">{bowler.name}</td>
                                                                                           <td className="px-3 py-2">{bowler.overs}</td>
                                                                                           <td className="px-3 py-2">{bowler.maidens}</td>
                                                                                           <td className="px-3 py-2">{bowler.runs_conceded}</td>
                                                                                           <td className="px-3 py-2">{bowler.wickets}</td>
                                                                                           <td className="px-3 py-2">{bowler.econ}</td>
                                                                                    </tr>
                                                                             ))}
                                                                      </tbody>
                                                               </table>
                                                        </div>
                                                 </div>
                                          </TabsContent>
                                   ))}
                            </Tabs>
                     </CardContent>
              </Card>
       );
};

export default ScoreCard;

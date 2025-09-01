import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { getMatchOddsByHierarchy } from "../../../store/slices/matchSlice";

const Odds = ({ matchId }) => {
       const dispatch = useDispatch();
       const { hierarchicalOdds } = useSelector((state) => state.match);

       useEffect(() => {
              if (matchId) {
                     dispatch(getMatchOddsByHierarchy(matchId?.matchId));
              }
       }, [matchId, dispatch]);

       const appOdds = hierarchicalOdds?.appOdds || [];
       const apiOdds = hierarchicalOdds?.apiOdds || [];

       const renderOddCard = (o, isApp = true) => (
              <div
                     key={o.id}
                     className={`mb-4 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-xl hover:scale-[1.02] transition-transform duration-300 ${isApp
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                            : "bg-gradient-to-r from-green-400/20 to-yellow-400/20"
                            }`}
              >
                     <p className="text-sm text-gray-300 font-semibold mb-1 capitalize">Type: {o.type}</p>
                     <Separator className="my-2 border-white/20" />
                     <div className="grid grid-cols-2 gap-4 text-sm text-white">
                            <div className="space-y-1">
                                   <p className="font-medium text-white/80">Team A</p>
                                   <p className="text-green-400 font-semibold">Back: {o.odds.teama.back}</p>
                                   <p className="text-red-400 font-semibold">Lay: {o.odds.teama.lay}</p>
                            </div>
                            <div className="space-y-1">
                                   <p className="font-medium text-white/80">Team B</p>
                                   <p className="text-green-400 font-semibold">Back: {o.odds.teamb.back}</p>
                                   <p className="text-red-400 font-semibold">Lay: {o.odds.teamb.lay}</p>
                            </div>
                     </div>
              </div>
       );

       return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                     {/* Application Odds */}
                     <Card className="bg-[#1b1e2b]/70 border border-white/20 shadow-2xl backdrop-blur-lg">
                            <CardHeader>
                                   <CardTitle className="text-white text-xl font-bold tracking-wide">
                                          Application Odds Rate
                                   </CardTitle>
                            </CardHeader>
                            <CardContent>
                                   {appOdds.length > 0
                                          ? appOdds.map((o) => renderOddCard(o, true))
                                          : <p className="text-gray-400 text-sm">No Application Odds available</p>}
                            </CardContent>
                     </Card>

                     {/* Market Odds */}
                     <Card className="bg-[#1b1e2b]/70 border border-white/20 shadow-2xl backdrop-blur-lg">
                            <CardHeader>
                                   <CardTitle className="text-white text-xl font-bold tracking-wide">
                                          Market Odds Rate
                                   </CardTitle>
                            </CardHeader>
                            <CardContent>
                                   {apiOdds.length > 0
                                          ? apiOdds.map((o) => renderOddCard(o, false))
                                          : <p className="text-gray-400 text-sm">No Market Odds available</p>}
                            </CardContent>
                     </Card>
              </div>
       );
};

export default Odds;

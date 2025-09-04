import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getMatchOddsByHierarchy } from "../../../store/slices/matchSlice";
import { createBet } from "../../../store/slices/betSlice";
import { toast } from "sonner"

const Odds = ({ matchId }) => {
       const dispatch = useDispatch();
       const { hierarchicalOdds } = useSelector((state) => state.match);

       const [selectedOdds, setSelectedOdds] = useState(null);
       const [tokenAmount, setTokenAmount] = useState("");

       useEffect(() => {
              if (matchId) {
                     dispatch(getMatchOddsByHierarchy(matchId?.matchId));
              }
       }, [matchId, dispatch]);

       const appOdds = hierarchicalOdds?.appOdds || [];
       const apiOdds = hierarchicalOdds?.apiOdds || [];

       // Common bet placement handler
       const handlePlaceBet = async (teamKey, betType) => {
              if (!selectedOdds || !tokenAmount) {
                     alert("Please enter a token amount before placing a bet.");
                     return;
              }

              const team = selectedOdds.odds[teamKey];
              const body = {
                     matchId: selectedOdds.id,
                     teamId: team.teamId,
                     rate: betType === "back" ? team.back : team.lay,
                     tokenAmount,
                     type: selectedOdds.type,
                     betType,
              };
              const response = await dispatch(createBet(body));
              if (response?.meta?.requestStatus === "fulfilled") {
                     toast.success("Bet placed successfully!");
              } else {
                     toast.error(response?.payload);
              }
       };

       const renderOddCard = (o, isApp = true) => (
              <div
                     key={o.id}
                     onClick={() => isApp && setSelectedOdds(o)}
                     className={`mb-4 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-xl 
        hover:scale-[1.02] transition-transform duration-300 
        ${isApp ? "cursor-pointer" : "cursor-default"} 
        ${isApp
                                   ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                                   : "bg-gradient-to-r from-green-400/20 to-yellow-400/20"
                            }`}
              >
                     <p className="text-sm text-gray-300 font-semibold mb-1 capitalize">
                            Type: {o.type}
                     </p>
                     <Separator className="my-2 border-white/20" />
                     <div className="grid grid-cols-2 gap-4 text-sm text-white">
                            <div className="space-y-1">
                                   <p className="font-medium text-white/80">{o.odds.teama.teamName}</p>
                                   <p className="text-green-400 font-semibold">Back: {o.odds.teama.back}</p>
                                   <p className="text-red-400 font-semibold">Lay: {o.odds.teama.lay}</p>
                            </div>
                            <div className="space-y-1">
                                   <p className="font-medium text-white/80">{o.odds.teamb.teamName}</p>
                                   <p className="text-green-400 font-semibold">Back: {o.odds.teamb.back}</p>
                                   <p className="text-red-400 font-semibold">Lay: {o.odds.teamb.lay}</p>
                            </div>
                     </div>
              </div>
       );

       return (
              <>
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

                     {/* Bet Placement Dialog */}
                     <Dialog open={!!selectedOdds} onOpenChange={() => setSelectedOdds(null)}>
                            <DialogContent className="bg-[#1b1e2b] text-white border border-white/10 rounded-xl shadow-xl">
                                   <DialogHeader>
                                          <DialogTitle className="text-lg font-semibold">Place Your Bet</DialogTitle>
                                   </DialogHeader>

                                   {selectedOdds && (
                                          <div className="space-y-4 mt-4">
                                                 {/* Token Amount Input */}
                                                 <Input
                                                        type="number"
                                                        placeholder="Enter Token Amount"
                                                        value={tokenAmount}
                                                        onChange={(e) => setTokenAmount(e.target.value)}
                                                        className="bg-white/10 text-white border border-white/20 rounded-lg"
                                                 />

                                                 {/* Team A Back */}
                                                 <div
                                                        onClick={() => handlePlaceBet("teama", "back")}
                                                        className="p-4 rounded-lg border bg-white/5 border-white/20 hover:border-green-500 cursor-pointer"
                                                 >
                                                        <p className="font-bold">{selectedOdds.odds.teama.teamName} - Back</p>
                                                        <p className="text-green-400 text-sm">Rate: {selectedOdds.odds.teama.back}</p>
                                                 </div>

                                                 {/* Team A Lay */}
                                                 <div
                                                        onClick={() => handlePlaceBet("teama", "lay")}
                                                        className="p-4 rounded-lg border bg-white/5 border-white/20 hover:border-red-500 cursor-pointer"
                                                 >
                                                        <p className="font-bold">{selectedOdds.odds.teama.teamName} - Lay</p>
                                                        <p className="text-red-400 text-sm">Rate: {selectedOdds.odds.teama.lay}</p>
                                                 </div>

                                                 {/* Team B Back */}
                                                 <div
                                                        onClick={() => handlePlaceBet("teamb", "back")}
                                                        className="p-4 rounded-lg border bg-white/5 border-white/20 hover:border-green-500 cursor-pointer"
                                                 >
                                                        <p className="font-bold">{selectedOdds.odds.teamb.teamName} - Back</p>
                                                        <p className="text-green-400 text-sm">Rate: {selectedOdds.odds.teamb.back}</p>
                                                 </div>

                                                 {/* Team B Lay */}
                                                 <div
                                                        onClick={() => handlePlaceBet("teamb", "lay")}
                                                        className="p-4 rounded-lg border bg-white/5 border-white/20 hover:border-red-500 cursor-pointer"
                                                 >
                                                        <p className="font-bold">{selectedOdds.odds.teamb.teamName} - Lay</p>
                                                        <p className="text-red-400 text-sm">Rate: {selectedOdds.odds.teamb.lay}</p>
                                                 </div>
                                          </div>
                                   )}

                                   <div className="mt-6">
                                          <Button
                                                 onClick={() => setSelectedOdds(null)}
                                                 className="w-full bg-green-600 hover:bg-green-700"
                                          >
                                                 Close
                                          </Button>
                                   </div>
                            </DialogContent>
                     </Dialog>
              </>
       );
};

export default Odds;

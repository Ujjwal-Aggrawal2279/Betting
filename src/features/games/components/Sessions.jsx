import React, { useEffect, useState } from "react";
import {
       Card,
       CardHeader,
       CardTitle,
       CardContent,
} from "@/components/ui/card";
import {
       Dialog,
       DialogContent,
       DialogHeader,
       DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { createSessionBet, fetchMatchSession } from "../../../store/slices/sessionSlice";

const Sessions = ({ matchId }) => {
       const dispatch = useDispatch();
       const [selectedSession, setSelectedSession] = useState(null);
       const [tokenAmount, setTokenAmount] = useState("");

       const { currentMatch, loading } = useSelector((state) => state.sessions);

       useEffect(() => {
              if (matchId) {
                     dispatch(fetchMatchSession(matchId?.matchId));
              }
       }, [dispatch, matchId]);

       const handlePlaceBet = async (betType) => {
              if (!tokenAmount) {
                     toast.error("Please enter a token amount before placing a bet.");
                     return;
              }
              const body = {
                     matchId: currentMatch?.matchSessions?.matchId,
                     overRange: selectedSession.overRange,
                     teamName: selectedSession.teamName,
                     rate: selectedSession[betType],
                     tokenAmount,
              }
              const response = await dispatch(createSessionBet(body));
              if (response?.meta?.requestStatus === "fulfilled") {
                     toast.success("Bet placed successfully!");
              } else {
                     toast.error(response?.payload);
              }
              setSelectedSession(null);
              setTokenAmount("");
       };

       const sessions = currentMatch?.matchSessions?.sessions || [];
       const matchTitle = currentMatch?.title || "Match Sessions";

       return (
              <div className="space-y-8 font-sans">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white tracking-wide">
                                   {matchTitle} - Session Market
                            </h2>
                     </div>

                     {/* Loading State */}
                     {loading && (
                            <div className="flex justify-center py-20">
                                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                     )}

                     {/* No Sessions */}
                     {!loading && sessions.length === 0 && (
                            <div className="text-center py-16 bg-[#1b1e2b]/70 border border-white/10 rounded-xl shadow-lg backdrop-blur-md">
                                   <p className="text-gray-300 text-lg font-medium">
                                          No session data available yet for this match.
                                   </p>
                                   <p className="text-gray-500 text-sm mt-2">
                                          Sessions will appear here once the market opens.
                                   </p>
                            </div>
                     )}

                     {/* Sessions Grid */}
                     {!loading && sessions.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {sessions.map((s, index) => (
                                          <Card
                                                 key={index}
                                                 className="bg-[#1b1e2b]/70 border border-white/20 backdrop-blur-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                                                 onClick={() => setSelectedSession(s)}
                                          >
                                                 <CardHeader>
                                                        <CardTitle className="text-white font-semibold text-lg">
                                                               {s.overRange}
                                                        </CardTitle>
                                                        <p className="text-sm text-gray-400">Team : {s.teamName}</p>
                                                        <p className="text-sm text-gray-400">{s.runs} Runs</p>
                                                 </CardHeader>

                                                 <Separator className="my-2 border-white/10" />

                                                 <CardContent>
                                                        <div className="flex justify-between items-center">
                                                               <div className="flex flex-col items-center w-1/2 p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition">
                                                                      <p className="text-green-400 font-semibold">Back</p>
                                                                      <p className="text-white text-lg font-bold">{s.back}</p>
                                                               </div>
                                                               <div className="flex flex-col items-center w-1/2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition">
                                                                      <p className="text-red-400 font-semibold">Lay</p>
                                                                      <p className="text-white text-lg font-bold">{s.lay}</p>
                                                               </div>
                                                        </div>
                                                 </CardContent>
                                          </Card>
                                   ))}
                            </div>
                     )}

                     {/* Bet Dialog */}
                     <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
                            <DialogContent className="bg-[#1b1e2b] text-white border border-white/10 rounded-xl shadow-xl max-w-md">
                                   <DialogHeader>
                                          <DialogTitle className="text-lg font-semibold">
                                                 Place Session Bet
                                          </DialogTitle>
                                   </DialogHeader>

                                   {selectedSession && (
                                          <div className="space-y-4 mt-4">
                                                 <p className="text-sm text-gray-300">
                                                        <span className="font-semibold">{selectedSession.overRange}</span> —{" "}
                                                        {selectedSession.runs} Runs
                                                 </p>

                                                 <Input
                                                        type="number"
                                                        placeholder="Enter Token Amount"
                                                        value={tokenAmount}
                                                        onChange={(e) => setTokenAmount(e.target.value)}
                                                        className="bg-white/10 text-white border border-white/20 rounded-lg"
                                                 />

                                                 <div className="grid grid-cols-2 gap-4">
                                                        <Button
                                                               className="bg-green-600 hover:bg-green-700"
                                                               onClick={() => handlePlaceBet("back")}
                                                        >
                                                               Back @ {selectedSession.back}
                                                        </Button>
                                                        <Button
                                                               className="bg-red-600 hover:bg-red-700"
                                                               onClick={() => handlePlaceBet("lay")}
                                                        >
                                                               Lay @ {selectedSession.lay}
                                                        </Button>
                                                 </div>

                                                 <Button
                                                        onClick={() => setSelectedSession(null)}
                                                        variant="outline"
                                                        className="w-full border-white/20 hover:bg-white/10 text-gray-300"
                                                 >
                                                        Cancel
                                                 </Button>
                                          </div>
                                   )}
                            </DialogContent>
                     </Dialog>
              </div>
       );
};

export default Sessions;

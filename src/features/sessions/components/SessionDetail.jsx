import React, { useEffect, useState } from "react";
import {
       Card,
       CardHeader,
       CardTitle,
       CardContent,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { createMatchSession, fetchMatchSession, updateActualRuns } from "../../../store/slices/sessionSlice";
import { Edit } from "lucide-react";

const SessionDetail = ({ matchId, onBack }) => {
       const dispatch = useDispatch();
       const { currentMatch, loading } = useSelector((state) => state.sessions);

       const [overRange, setOverRange] = useState("");
       const [runs, setRuns] = useState("");
       const [back, setBack] = useState("");
       const [lay, setLay] = useState("");
       const [actualRuns, setActualRuns] = useState("");
       const [creating, setCreating] = useState(false);

       const [editSession, setEditSession] = useState(null);
       const [editActualRuns, setEditActualRuns] = useState("");

       useEffect(() => {
              if (matchId) {
                     dispatch(fetchMatchSession(matchId));
              }
       }, [dispatch, matchId]);

       const sessions = currentMatch?.matchSessions?.sessions || [];
       const [teamName, setTeamName] = useState(currentMatch?.teamA || "");

       const handleAddSession = async () => {
              try {
                     if (!overRange || !runs || !back || !lay) {
                            toast.error("Please fill in all required fields.");
                            return;
                     }

                     setCreating(true);

                     const matchId = currentMatch?.matchSessions?.matchId;
                     if (!matchId) return;

                     const sessions = [{
                            overRange,
                            runs: Number(runs),
                            back: Number(back),
                            lay: Number(lay),
                            teamName,
                            actualRuns: actualRuns ? Number(actualRuns) : undefined
                     }];

                     const response = await dispatch(createMatchSession({ matchId, sessions }));

                     if (response?.meta?.requestStatus === "fulfilled") {
                            toast.success("Session created successfully!");
                            setOverRange("");
                            setRuns("");
                            setBack("");
                            setLay("");
                            setActualRuns("");
                     } else {
                            toast.error("Failed to create session. Please try again.");
                     }
              } catch (error) {
                     console.error("Error creating session:", error);
                     toast.error("Failed to create session. Please try again.");
              } finally {
                     setCreating(false);
              }
       };

       const handleUpdateActualRuns = async () => {
              try {
                     if (!editSession || editActualRuns === "") return;

                     const matchId = currentMatch?.matchSessions?.matchId;
                     const payload = {
                            matchId,
                            overRange: editSession.overRange,
                            actualRuns: Number(editActualRuns),
                     };

                     const response = await dispatch(updateActualRuns(payload));

                     if (response?.meta?.requestStatus === "fulfilled") {
                            toast.success(`Actual runs updated for ${editSession.overRange}`);
                            setEditSession(null);
                            setEditActualRuns("");
                     } else {
                            toast.error("Failed to update actual runs.");
                     }
              } catch (error) {
                     console.error(error);
                     toast.error("Error updating actual runs.");
              }
       };

       return (
              <div className="space-y-8 p-6 font-display">
                     <Button className="bg-gray-600 hover:bg-gray-700 mb-4" onClick={onBack}>
                            Go Back
                     </Button>

                     <h2 className="text-2xl font-bold text-white">
                            {currentMatch?.title || "Match"} - Session Market
                     </h2>

                     {loading && <p className="text-gray-400">Loading session data...</p>}

                     {sessions.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {sessions.map((s, index) => (
                                          <Card key={index} className="bg-[#1b1e2b]/70 border border-white/20 backdrop-blur-lg shadow-2xl relative">
                                                 <CardHeader className="flex justify-between items-start">
                                                        <div>
                                                               <CardTitle className="text-white font-semibold">{s.overRange}</CardTitle>
                                                               <p className="text-sm text-gray-400">{s.teamName}</p>
                                                               <p className="text-sm text-gray-400">{s.runs} Runs</p>
                                                               <p className="text-sm text-gray-400">Actual: {s.actualRuns ?? "N/A"}</p>
                                                        </div>
                                                        <Edit
                                                               className="text-white cursor-pointer hover:text-green-400"
                                                               size={18}
                                                               onClick={() => {
                                                                      setEditSession(s);
                                                                      setEditActualRuns(s.actualRuns ?? "");
                                                               }}
                                                        />
                                                 </CardHeader>

                                                 <Separator className="my-2 border-white/10" />

                                                 <CardContent>
                                                        <div className="flex justify-between">
                                                               <div className="flex flex-col items-center w-1/2 p-2 rounded-lg bg-green-500/10">
                                                                      <p className="text-green-400 font-semibold">Back</p>
                                                                      <p className="text-white font-bold">{s.back}</p>
                                                               </div>
                                                               <div className="flex flex-col items-center w-1/2 p-2 rounded-lg bg-red-500/10">
                                                                      <p className="text-red-400 font-semibold">Lay</p>
                                                                      <p className="text-white font-bold">{s.lay}</p>
                                                               </div>
                                                        </div>
                                                 </CardContent>
                                          </Card>
                                   ))}
                            </div>
                     ) : (
                            <p className="text-gray-400">No sessions found. Create one below:</p>
                     )}

                     {/* Form to create new session */}
                     <div className="w-64">
                            <p className="text-white mb-2 font-semibold">Select Team</p>
                            <Select value={teamName} onValueChange={setTeamName}>
                                   <SelectTrigger className="bg-white/10 text-white border border-white/20">
                                          <SelectValue placeholder="Select Team" />
                                   </SelectTrigger>
                                   <SelectContent className="bg-[#1b1e2b] text-white border border-white/20">
                                          <SelectItem value={currentMatch?.teamA}>{currentMatch?.teamA}</SelectItem>
                                          <SelectItem value={currentMatch?.teamB}>{currentMatch?.teamB}</SelectItem>
                                   </SelectContent>
                            </Select>
                     </div>
                     <div className="bg-[#1b1e2b]/70 p-6 rounded-xl border border-white/20 shadow-xl space-y-4">
                            <h3 className="text-lg font-semibold text-white">Create New Session</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                   <Input
                                          placeholder="Over Range (e.g., 1-5 Overs)"
                                          value={overRange}
                                          onChange={(e) => setOverRange(e.target.value)}
                                          className="bg-white/10 text-white border border-white/20"
                                   />
                                   <Input
                                          placeholder="Runs"
                                          type="number"
                                          value={runs}
                                          onChange={(e) => setRuns(e.target.value)}
                                          className="bg-white/10 text-white border border-white/20"
                                   />
                                   <Input
                                          placeholder="Back"
                                          type="number"
                                          value={back}
                                          onChange={(e) => setBack(e.target.value)}
                                          className="bg-white/10 text-white border border-white/20"
                                   />
                                   <Input
                                          placeholder="Lay"
                                          type="number"
                                          value={lay}
                                          onChange={(e) => setLay(e.target.value)}
                                          className="bg-white/10 text-white border border-white/20"
                                   />
                                   <Input
                                          placeholder="Actual Runs"
                                          type="number"
                                          value={actualRuns}
                                          onChange={(e) => setActualRuns(e.target.value)}
                                          className="bg-white/10 text-white border border-white/20"
                                   />
                            </div>

                            <Button
                                   className="bg-green-600 hover:bg-green-700"
                                   onClick={handleAddSession}
                                   disabled={creating}
                            >
                                   {creating ? "Creating..." : "Add Session"}
                            </Button>
                     </div>

                     {/* Edit Actual Runs Modal */}
                     {editSession && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                   <div className="bg-[#1b1e2b] p-6 rounded-xl border border-white/20 w-80 space-y-4">
                                          <h3 className="text-white font-semibold">Update Actual Runs</h3>
                                          <p className="text-gray-400">{editSession.overRange}</p>
                                          <Input
                                                 type="number"
                                                 value={editActualRuns}
                                                 onChange={(e) => setEditActualRuns(e.target.value)}
                                                 className="bg-white/10 text-white border border-white/20"
                                          />
                                          <div className="flex justify-between gap-2">
                                                 <Button
                                                        className="bg-green-600 hover:bg-green-700 flex-1"
                                                        onClick={handleUpdateActualRuns}
                                                 >
                                                        Update
                                                 </Button>
                                                 <Button
                                                        className="bg-gray-600 hover:bg-gray-700 flex-1"
                                                        onClick={() => setEditSession(null)}
                                                 >
                                                        Cancel
                                                 </Button>
                                          </div>
                                   </div>
                            </div>
                     )}
              </div>
       );
};

export default SessionDetail;

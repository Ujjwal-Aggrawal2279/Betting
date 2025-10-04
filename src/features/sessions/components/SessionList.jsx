import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { fetchAllMatchSessions } from "../../../store/slices/sessionSlice";

const SessionList = ({ onView }) => {
       const dispatch = useDispatch();
       const { allSessions, loading, error } = useSelector((state) => state.sessions);

       useEffect(() => {
              dispatch(fetchAllMatchSessions());
       }, [dispatch]);

       return (
              <div className="p-6">
                     <h2 className="text-2xl font-bold text-white mb-4">All Match Sessions</h2>

                     {loading && (
                            <div className="flex justify-center py-10">
                                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                     )}

                     {error && (
                            <p className="text-red-400 text-center py-10">{error}</p>
                     )}

                     {!loading && allSessions.length === 0 && (
                            <p className="text-gray-400 text-center py-10">
                                   No session markets available.
                            </p>
                     )}

                     {!loading && allSessions.length > 0 && (
                            <div className="overflow-x-auto bg-[#1b1e2b]/70 border border-white/20 rounded-xl shadow-xl">
                                   <table className="min-w-full text-left divide-y divide-white/10">
                                          <thead>
                                                 <tr>
                                                        <th className="px-6 py-3 text-white text-sm font-medium uppercase tracking-wider">
                                                               Match Title
                                                        </th>
                                                        <th className="px-6 py-3 text-white text-sm font-medium uppercase tracking-wider">
                                                               Action
                                                        </th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-white/10">
                                                 {allSessions.map((match) => (
                                                        <tr key={match.matchId} className="hover:bg-white/5 transition-colors">
                                                               <td className="px-6 py-4 text-white font-medium">{match.title}</td>
                                                               <td className="px-6 py-4">
                                                                      <Button
                                                                             className="bg-blue-600 hover:bg-blue-700"
                                                                             onClick={() => onView(match.matchId)}
                                                                      >
                                                                             View
                                                                      </Button>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>
                     )}
              </div>
       );
};

export default SessionList;

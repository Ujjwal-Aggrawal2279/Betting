import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBets } from "../../../store/slices/betSlice";
import { Button } from "@/components/ui/button";

const BetsList = () => {
     const [page, setPage] = useState(1);
     const rowsPerPage = 15;
     const dispatch = useDispatch();

     const { bets, loading, error, total } = useSelector((state) => state.bets);

     useEffect(() => {
          dispatch(fetchBets({ page, limit: rowsPerPage }));
     }, [dispatch, page]);

     const totalPages = total ? Math.ceil(total / rowsPerPage) : 1;
     return (
          <div className="p-6 text-white font-display">
               <h1 className="text-2xl font-bold tracking-tight">Bets Placed</h1>

               <div className="bg-[#1E2233] ring-1 ring-[#2B2F45] shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden mt-3">
                    <Table>
                         <TableHeader className="sticky top-0 z-10 bg-[#22273A]">
                              <TableRow className="[&>th]:h-12">
                                   <TableHead className="w-12 text-white/80 font-semibold">
                                        <Checkbox aria-label="Select all" />
                                   </TableHead>
                                   <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">ID</TableHead>
                                   <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Full Name</TableHead>
                                   <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Team</TableHead>
                                   <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Token Amount</TableHead>
                                   <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Type</TableHead>
                                   <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Rate</TableHead>
                                   <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Result</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {loading && (
                                   <TableRow>
                                        <TableCell colSpan={8} className="text-center py-6 text-gray-400">
                                             Loading bets...
                                        </TableCell>
                                   </TableRow>
                              )}
                              {error && (
                                   <TableRow>
                                        <TableCell colSpan={8} className="text-center py-6 text-red-400">
                                             {error}
                                        </TableCell>
                                   </TableRow>
                              )}
                              {!loading && bets.length === 0 && (
                                   <TableRow>
                                        <TableCell colSpan={8} className="text-center py-6 text-gray-400">
                                             No bets placed yet
                                        </TableCell>
                                   </TableRow>
                              )}
                              {bets.map((bet, idx) => (
                                   <TableRow key={bet._id || idx} className="[&>td]:py-3">
                                        <TableCell>
                                             <Checkbox />
                                        </TableCell>
                                        <TableCell className="text-gray-300 text-sm">{idx + 1}</TableCell>
                                        <TableCell className="text-gray-300 text-sm">{bet.fullName}</TableCell>
                                        <TableCell className="text-gray-300 text-sm">{bet.teamId}</TableCell>
                                        <TableCell className="text-gray-300 text-sm">{bet.tokenAmount}</TableCell>
                                        <TableCell className="text-gray-300 text-sm">{bet.betType}</TableCell>
                                        <TableCell className="text-gray-300 text-sm">{bet.rate}</TableCell>
                                        <TableCell
                                             className={`text-sm font-semibold ${bet.result === "won"
                                                  ? "text-green-400"
                                                  : bet.result === "lost"
                                                       ? "text-red-400"
                                                       : "text-yellow-400"
                                                  }`}
                                        >
                                             {bet.result}
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
                    {/* Footer / Pagination */}
                    <div className="flex items-center justify-between p-4 gap-3 bg-[#1C2131] border-t border-white/[0.06]">
                         <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-lg bg-white/5 text-white hover:bg-white/10 cursor-pointer disabled:opacity-40"
                              disabled={page === 1}
                              onClick={() => setPage((p) => p - 1)}
                         >
                              Previous
                         </Button>

                         <div className="text-white/80 text-sm">
                              Page <span className="text-white font-semibold">{page}</span> of{" "}
                              <span className="text-white font-semibold">{totalPages}</span>
                         </div>

                         <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 cursor-pointer disabled:opacity-40"
                              disabled={page === totalPages}
                              onClick={() => setPage((p) => p + 1)}
                         >
                              Next
                         </Button>
                    </div>
               </div>
          </div>
     );
};

export default BetsList;

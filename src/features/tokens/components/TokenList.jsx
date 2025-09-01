import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, MoreHorizontal, Plus } from "lucide-react";
import RequestTokenDialog from "./RequestTokenDialog";
import { useDispatch, useSelector } from "react-redux";
import {
       Table,
       TableBody,
       TableCell,
       TableHead,
       TableHeader,
       TableRow,
} from "@/components/ui/table";
import {
       DropdownMenu,
       DropdownMenuContent,
       DropdownMenuItem,
       DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
       fetchTokens,
       updateTokenStatus,
} from "../../../store/slices/tokenSlice";

const TokenList = () => {
       const dispatch = useDispatch();
       const { tokens, loading } = useSelector((state) => state.tokens);

       const [open, setOpen] = useState(false);
       const [page, setPage] = useState(1);
       const rowsPerPage = 15;

       // Fetch tokens whenever page changes
       useEffect(() => {
              dispatch(fetchTokens(page));
       }, [dispatch, page]);

       const handleUpdateStatus = (tokenId, status) => {
              dispatch(updateTokenStatus({ tokenId, status }));
       };

       const pageData = tokens || [];
       const totalPages = tokens?.total ? Math.ceil(tokens.total / rowsPerPage) : 1;

       if (loading)
              return (
                     <div className="flex items-center justify-center w-full h-full">
                            <Loader className="animate-spin text-white h-10 w-10 m-auto" />
                     </div>
              );

       return (
              <div className="p-6 text-white font-display">
                     <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold tracking-tight">Tokens List</h1>
                            <Button
                                   className="bg-amber-500 text-black font-semibold hover:bg-amber-400 cursor-pointer rounded-md shadow-sm flex items-center"
                                   onClick={() => setOpen(true)}
                            >
                                   <Plus className="mr-2 h-4 w-4" /> Request Tokens
                            </Button>
                     </div>

                     <div className="bg-[#1E2233] ring-1 ring-[#2B2F45] shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
                            <Table>
                                   <TableHeader className="sticky top-0 z-10 bg-[#22273A]">
                                          <TableRow className="[&>th]:h-12">
                                                 <TableHead className="w-12 text-white/80 font-semibold">
                                                        <Checkbox aria-label="Select all" />
                                                 </TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">ID</TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Full Name</TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Approval From</TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Token Amount</TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Status</TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Action taken by</TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">Actions</TableHead>
                                          </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                          {pageData.map((token, index) => (
                                                 <TableRow key={token._id}>
                                                        <TableCell className="font-medium text-white/80">
                                                               <Checkbox aria-label="Select all" />
                                                        </TableCell>
                                                        <TableCell className="font-medium text-white/80">{index + 1}</TableCell>
                                                        <TableCell className="font-medium text-white/80">{token?.requestedBy?.fullName}</TableCell>
                                                        <TableCell className="font-medium text-white/80">{token.requestedTo?.fullName}</TableCell>
                                                        <TableCell className="font-medium text-white/80">{token.tokenAmount}</TableCell>
                                                        <TableCell className="font-medium text-white/80 capitalize">{token.status}</TableCell>
                                                        <TableCell className="font-medium text-white/80">{token?.approvedBy?.fullName || token?.rejectedBy?.fullName}</TableCell>
                                                        <TableCell className="font-medium text-white/80">
                                                               <DropdownMenu>
                                                                      <DropdownMenuTrigger asChild>
                                                                             <button className="p-1 hover:bg-white/10 cursor-pointer">
                                                                                    <MoreHorizontal className="h-4 w-4 text-white/70" />
                                                                             </button>
                                                                      </DropdownMenuTrigger>
                                                                      <DropdownMenuContent align="start" className="bg-[#1E2233] border border-white/10 text-white font-display">
                                                                             {token.status === "pending" && (
                                                                                    <>
                                                                                           <DropdownMenuItem
                                                                                                  className="hover:bg-amber-500/30 cursor-pointer"
                                                                                                  onClick={() => handleUpdateStatus(token._id, "approved")}
                                                                                           >
                                                                                                  Approve
                                                                                           </DropdownMenuItem>
                                                                                           <DropdownMenuItem
                                                                                                  className="hover:bg-red-500/30 cursor-pointer"
                                                                                                  onClick={() => handleUpdateStatus(token._id, "rejected")}
                                                                                           >
                                                                                                  Reject
                                                                                           </DropdownMenuItem>
                                                                                    </>
                                                                             )}
                                                                             {token.status === "approved" && (
                                                                                    <DropdownMenuItem
                                                                                           className="hover:bg-red-500/30 cursor-pointer"
                                                                                           onClick={() => handleUpdateStatus(token._id, "rejected")}
                                                                                    >
                                                                                           Reject
                                                                                    </DropdownMenuItem>
                                                                             )}
                                                                             {token.status === "rejected" && (
                                                                                    <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
                                                                                           No actions available
                                                                                    </DropdownMenuItem>
                                                                             )}
                                                                      </DropdownMenuContent>
                                                               </DropdownMenu>
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

                     {/* Request Token Dialog */}
                     <RequestTokenDialog open={open} setOpen={setOpen} />
              </div>
       );
};

export default TokenList;

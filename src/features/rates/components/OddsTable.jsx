import React, { useState } from "react"
import {
       Table,
       TableBody,
       TableCell,
       TableHead,
       TableHeader,
       TableRow,
} from "@/components/ui/table"
import {
       DropdownMenu,
       DropdownMenuContent,
       DropdownMenuItem,
       DropdownMenuLabel,
       DropdownMenuSeparator,
       DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import OddsSheet from "./OddsSheet"

const OddsTable = ({ data }) => {
       const [page, setPage] = useState(1)
       const [sheetOpen, setSheetOpen] = useState(false);
       const [selectedOdds, setSelectedOdds] = useState(null)
       const pageSize = 15

       const totalPages = Math.ceil(data.length / pageSize)
       const paginatedData = data.slice((page - 1) * pageSize, page * pageSize)

       // Badge colors for type
       const typeColors = {
              matchOdds: "bg-blue-500/90 text-white",
              tiedMatch: "bg-purple-500/90 text-white",
              default: "bg-gray-500/90 text-white",
       }

       return (
              <div className="p-4 text-white font-display">
                     {/* Header */}
                     <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold tracking-tight text-[#EC981A]">Match Odds</h1>
                     </div>

                     {/* Table Card */}
                     <div className="bg-[#161A29] rounded-sm ring-1 ring-[#2B2F45]/70 shadow-[0_10px_35px_rgba(0,0,0,0.55)] overflow-hidden">
                            <Table>
                                   <TableHeader className="sticky top-0 z-10 bg-[#1F2436]/95 backdrop-blur-md">
                                          <TableRow className="[&>th]:h-12">
                                                 <TableHead className="text-white/70 font-semibold uppercase tracking-wider text-xs">
                                                        Match
                                                 </TableHead>
                                                 <TableHead className="hidden lg:table-cell text-white/70 font-semibold uppercase tracking-wider text-xs">
                                                        Type
                                                 </TableHead>
                                                 <TableHead className="hidden lg:table-cell text-white/70 font-semibold uppercase tracking-wider text-xs">
                                                        Source
                                                 </TableHead>
                                                 <TableHead className="hidden lg:table-cell text-white/70 font-semibold uppercase tracking-wider text-xs text-center">
                                                        Team A
                                                 </TableHead>
                                                 <TableHead className="hidden lg:table-cell text-white/70 font-semibold uppercase tracking-wider text-xs text-center">
                                                        Team B
                                                 </TableHead>
                                                 <TableHead className="text-white/70 font-semibold uppercase tracking-wider text-xs text-center">
                                                        Created By
                                                 </TableHead>
                                                 <TableHead className="text-white/70 font-semibold uppercase tracking-wider text-xs text-center">
                                                        Actions
                                                 </TableHead>
                                          </TableRow>
                                   </TableHeader>

                                   <TableBody>
                                          {paginatedData.map((item, idx) => (
                                                 <TableRow
                                                        key={item.id}
                                                        className={`transition-all duration-300 border-b border-white/[0.06] ${idx % 2 === 0 ? "bg-[#1A1F2E]" : "bg-[#20263A]"
                                                               } hover:bg-[#2B324A]`}
                                                 >
                                                        <TableCell className="text-white font-medium text-sm">
                                                               {item.matchName}
                                                        </TableCell>

                                                        {/* Type Badge */}
                                                        <TableCell className="hidden lg:table-cell">
                                                               <Badge
                                                                      className={`px-3 py-1 rounded-lg text-xs font-medium shadow-sm ${typeColors[item.type] || typeColors.default
                                                                             } hover:scale-105 transition`}
                                                               >
                                                                      {item.type}
                                                               </Badge>
                                                        </TableCell>

                                                        <TableCell className="text-white/70 text-sm hidden lg:table-cell">{item.source}</TableCell>

                                                        {/* Team A Odds */}
                                                        <TableCell className="text-center space-x-2 hidden lg:table-cell">
                                                               <TooltipProvider>
                                                                      <Tooltip>
                                                                             <TooltipTrigger>
                                                                                    <Badge className="bg-green-500/90 text-black font-semibold rounded-md px-3 py-1 hover:scale-105 transition">
                                                                                           📈 Back {item.odds.teama.back}
                                                                                    </Badge>
                                                                             </TooltipTrigger>
                                                                             <TooltipContent className="text-xs">
                                                                                    Back = Bet in favor of Team A winning
                                                                             </TooltipContent>
                                                                      </Tooltip>
                                                               </TooltipProvider>

                                                               <TooltipProvider>
                                                                      <Tooltip>
                                                                             <TooltipTrigger>
                                                                                    <Badge className="bg-red-500/90 text-black font-semibold rounded-md px-3 py-1 hover:scale-105 transition">
                                                                                           📉 Lay {item.odds.teama.lay}
                                                                                    </Badge>
                                                                             </TooltipTrigger>
                                                                             <TooltipContent className="text-xs">
                                                                                    Lay = Bet against Team A (they will not win)
                                                                             </TooltipContent>
                                                                      </Tooltip>
                                                               </TooltipProvider>
                                                        </TableCell>

                                                        {/* Team B Odds */}
                                                        <TableCell className="text-center space-x-2 hidden lg:table-cell">
                                                               <TooltipProvider>
                                                                      <Tooltip>
                                                                             <TooltipTrigger>
                                                                                    <Badge className="bg-green-500/90 text-black font-semibold rounded-md px-3 py-1 hover:scale-105 transition">
                                                                                           📈 Back {item.odds.teamb.back}
                                                                                    </Badge>
                                                                             </TooltipTrigger>
                                                                             <TooltipContent className="text-xs">
                                                                                    Back = Bet in favor of Team B winning
                                                                             </TooltipContent>
                                                                      </Tooltip>
                                                               </TooltipProvider>

                                                               <TooltipProvider>
                                                                      <Tooltip>
                                                                             <TooltipTrigger>
                                                                                    <Badge className="bg-red-500/90 text-black font-semibold rounded-md px-3 py-1 hover:scale-105 transition">
                                                                                           📉 Lay {item.odds.teamb.lay}
                                                                                    </Badge>
                                                                             </TooltipTrigger>
                                                                             <TooltipContent className="text-xs">
                                                                                    Lay = Bet against Team B (they will not win)
                                                                             </TooltipContent>
                                                                      </Tooltip>
                                                               </TooltipProvider>
                                                        </TableCell>

                                                        <TableCell className="text-white/70 text-sm ">{item?.createdBy}</TableCell>

                                                        <TableCell className="flex justify-center">
                                                               <DropdownMenu>
                                                                      <DropdownMenuTrigger asChild>
                                                                             <Button variant="ghost" size="sm" className="rounded-lg bg-white/5">
                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                             </Button>
                                                                      </DropdownMenuTrigger>
                                                                      <DropdownMenuContent align="end">
                                                                             <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                           setSelectedOdds(item)
                                                                                           setSheetOpen(true)
                                                                                    }}
                                                                             >
                                                                                    Configure Odds
                                                                             </DropdownMenuItem>
                                                                      </DropdownMenuContent>
                                                               </DropdownMenu>
                                                        </TableCell>
                                                 </TableRow>
                                          ))}
                                   </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-4 gap-3 bg-[#141826] border-t border-white/[0.06]">
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
                     {/* Sheet Component */}
                     <OddsSheet
                            open={sheetOpen}
                            onOpenChange={setSheetOpen}
                            odds={selectedOdds}
                     />
              </div>
       )
}

export default OddsTable

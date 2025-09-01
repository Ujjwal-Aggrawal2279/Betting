import { useEffect, useState } from "react";
import {
       Table,
       TableBody,
       TableCell,
       TableHead,
       TableHeader,
       TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, Plus, MoreHorizontal } from "lucide-react";
import AddUserSheet from "./AddUserSheet";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/store/slices/userSlice";
import {
       DropdownMenu,
       DropdownMenuContent,
       DropdownMenuItem,
       DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserDetailSheet from "./UserDetailSheet";
import UserDeleteAlert from "./UserDeleteAlert";
import { toast } from "sonner";
import { deleteUser } from "../../../store/slices/userSlice";

export default function UserList() {
       const dispatch = useDispatch();
       const permissions = useSelector((state) => state.auth.permissions);
       const { list: users, loading } = useSelector((state) => state.users);

       const [page, setPage] = useState(1);
       const rowsPerPage = 15;
       const [selectedUserId, setSelectedUserId] = useState(null);
       const [isSheetOpen, setIsSheetOpen] = useState(false);
       const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

       // Fetch users whenever page changes
       useEffect(() => {
              dispatch(fetchUsers(page));
       }, [dispatch, page]);

       const pageData = users || [];
       const totalPages = users?.total ? Math.ceil(users.total / rowsPerPage) : 1;

       if (loading)
              return (
                     <div className="flex items-center justify-center w-full h-full">
                            <Loader className="animate-spin text-white h-10 w-10 m-auto" />
                     </div>
              );

       const handleEditClick = (userId) => {
              setSelectedUserId(userId);
              setIsSheetOpen(true);
       };

       const handleSheetClose = () => {
              setIsSheetOpen(false);
       };

       const handleDeleteAlert = (userId) => {
              setSelectedUserId(userId);
              setOpenDeleteDialog(true);
       };

       const handleDeleteDialogClose = () => {
              setOpenDeleteDialog(false);
       };

       const handleDeleteUser = async (userId) => {
              try {
                     const response = await dispatch(deleteUser(userId));
                     if (response) {
                            dispatch(fetchUsers(page));
                            toast.success(response.payload.message);
                            setOpenDeleteDialog(false);
                     } else {
                            toast.error(response.payload.message);
                     }
              } catch (error) {
                     toast.error(error.message || "Failed to delete user");
              }
       }

       return (
              <div className="p-6 text-white font-display">
                     {/* Header */}
                     <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                            {permissions.includes("create_user") && (
                                   <div>
                                          <AddUserSheet>
                                                 <Button className="bg-amber-500 text-black font-semibold hover:bg-amber-400 cursor-pointer rounded-xl shadow-sm flex items-center">
                                                        <Plus className="mr-2 h-4 w-4" /> Add User
                                                 </Button>
                                          </AddUserSheet>
                                   </div>
                            )}
                     </div>

                     {/* Table Card */}
                     <div className="bg-[#1E2233] ring-1 ring-[#2B2F45] shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
                            <Table>
                                   <TableHeader className="sticky top-0 z-10 bg-[#22273A]">
                                          <TableRow className="[&>th]:h-12">
                                                 <TableHead className="w-12 text-white/80 font-semibold">
                                                        <Checkbox aria-label="Select all" />
                                                 </TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">
                                                        ID
                                                 </TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">
                                                        Full Name
                                                 </TableHead>
                                                 <TableHead className="hidden xl:table-cell text-white/80 font-semibold uppercase tracking-wide text-xs">
                                                        Email
                                                 </TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">
                                                        Role
                                                 </TableHead>
                                                 <TableHead className="hidden md:table-cell text-white/80 font-semibold uppercase tracking-wide text-xs">
                                                        Enabled
                                                 </TableHead>
                                                 <TableHead className="hidden md:table-cell text-white/80 font-semibold uppercase tracking-wide text-xs">
                                                        Created By
                                                 </TableHead>
                                                 <TableHead className="text-white/80 font-semibold uppercase tracking-wide text-xs">
                                                        Actions
                                                 </TableHead>
                                          </TableRow>
                                   </TableHeader>

                                   <TableBody>
                                          {pageData.map((user, idx) => (
                                                 <TableRow
                                                        key={user._id}
                                                        className={`transition-colors border-b border-white/[0.06] ${idx % 2 === 0 ? "bg-[#1E2233]" : "bg-[#20263A]"
                                                               } hover:bg-white/5`}
                                                 >
                                                        <TableCell className="align-middle">
                                                               <Checkbox aria-label={`Select ${user._id}`} />
                                                        </TableCell>
                                                        <TableCell className="text-white/90 font-medium">{idx + 1}</TableCell>
                                                        <TableCell className="text-white">{user.fullName}</TableCell>
                                                        <TableCell className="hidden xl:table-cell text-white/70">{user.email}</TableCell>
                                                        <TableCell>
                                                               <Badge className="bg-amber-500/90 text-black font-semibold rounded-md px-2 py-1 hover:bg-amber-400">
                                                                      {user.role?.name}
                                                               </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell text-white/70">
                                                               {user.enabled ? "Enabled" : "Disabled"}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell text-white/70">
                                                               {user?.createdBy?.fullName}
                                                        </TableCell>
                                                        <TableCell className="text-white/70">
                                                               <DropdownMenu>
                                                                      <DropdownMenuTrigger asChild>
                                                                             <button className="p-1 hover:bg-white/10 cursor-pointer">
                                                                                    <MoreHorizontal className="h-4 w-4 text-white/70" />
                                                                             </button>
                                                                      </DropdownMenuTrigger>
                                                                      <DropdownMenuContent
                                                                             align="start"
                                                                             className="bg-[#1E2233] border border-white/10 text-white font-display"
                                                                      >
                                                                             <DropdownMenuItem
                                                                                    className="hover:bg-amber-500/30 cursor-pointer"
                                                                                    onClick={() => handleEditClick(user._id)}
                                                                             >
                                                                                    Edit
                                                                             </DropdownMenuItem>
                                                                             <DropdownMenuItem
                                                                                    className="hover:bg-red-500/30 cursor-pointer"
                                                                                    onClick={() => handleDeleteAlert(user._id)}
                                                                             >
                                                                                    Delete
                                                                             </DropdownMenuItem>
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

                     {/* Conditionally Render UserDetailSheet */}
                     {selectedUserId && (
                            <UserDetailSheet userId={selectedUserId} isOpen={isSheetOpen} onClose={handleSheetClose} />
                     )}

                     {/* Conditionally Render DeleteUserAlert */}
                     {selectedUserId && (
                            <UserDeleteAlert userId={selectedUserId} isOpen={openDeleteDialog} onClose={handleDeleteDialogClose} onDelete={handleDeleteUser} />
                     )}
              </div>
       );
}

import {
       Sheet,
       SheetContent,
       SheetHeader,
       SheetTitle,
       SheetFooter,
} from "@/components/ui/sheet";
import {
       AlertDialog,
       AlertDialogAction,
       AlertDialogCancel,
       AlertDialogContent,
       AlertDialogDescription,
       AlertDialogFooter,
       AlertDialogHeader,
       AlertDialogTitle,
       AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { editRole, fetchRoleDetails } from "../../../store/slices/roleSlice";
import { MultiSelect } from "../../../components/common/form/MultiSelect";
import { Button } from "@/components/ui/button";
import { Permissions } from "../../../data/permissions";
import { toast } from "sonner"

const RoleSheet = ({ roleId, open, onOpenChange }) => {
       const dispatch = useDispatch();
       const { selectedRoleDetails: role, loading } = useSelector((state) => state.roles);
       const userPermissions = useSelector((state) => state.auth.permissions);
       const canEdit = userPermissions.includes("role_permissions_manager");

       const methods = useForm({
              defaultValues: {
                     permissions: [],
              },
       });

       // Update form values when role changes
       useEffect(() => {
              if (role?.permissions?.length > 0) {
                     methods.setValue("permissions", role?.permissions);
              } else {
                     methods.setValue("permissions", []);
              }
       }, [role, methods]);

       // Fetch role details only when sheet opens and roleId changes
       useEffect(() => {
              if (open && roleId) {
                     dispatch(fetchRoleDetails(roleId));
              }
       }, [open, roleId, dispatch]);

       const onSubmit = async (data) => {
              if (canEdit) {
                     try {
                            const response = await dispatch(editRole({ roleId, permissions: data.permissions }));
                            if (response) {
                                   toast.success(response.payload.message);
                                   onOpenChange(false);
                            } else {
                                   toast.error(response.payload.message);
                            }
                     } catch (error) {
                            toast.error(error.message || "Failed to update role");
                     }
              }
       };

       return (
              <Sheet open={open} onOpenChange={onOpenChange}>
                     <SheetContent className="bg-[#181A27] text-white p-6 font-display w-full sm:max-w-md">
                            {/* Header */}
                            <SheetHeader className="p-0 mb-4">
                                   <SheetTitle className="text-xl font-bold text-[#EC981A]">
                                          {role?.name || "Role Details"}
                                   </SheetTitle>
                            </SheetHeader>

                            {/* Loading */}
                            {loading ? (
                                   <p className="text-gray-400">Loading...</p>
                            ) : (
                                   <FormProvider {...methods}>
                                          <form onSubmit={methods.handleSubmit(onSubmit)}>
                                                 {/* Users Count */}
                                                 <div className="mb-4 flex justify-between items-center">
                                                        <span className="text-gray-400 font-medium">Users Assigned:</span>
                                                        <span className="font-semibold">{role?.usersCount || 0}</span>
                                                 </div>
                                                 <Separator className="border-gray-700 mb-4" />

                                                 {/* Users List */}
                                                 <div className="mb-4">
                                                        <span className="text-gray-400 font-medium mb-2 block">Users:</span>
                                                        <ScrollArea className="min-h-40 rounded-md border border-gray-700 p-2 bg-[#1F2233]">
                                                               <ul className="space-y-1">
                                                                      {role?.users?.length > 0 ? (
                                                                             role.users.map((user, idx) => (
                                                                                    <li
                                                                                           key={idx}
                                                                                           className="text-white px-2 py-1 rounded hover:bg-[#2A2E44]"
                                                                                    >
                                                                                           {user}
                                                                                    </li>
                                                                             ))
                                                                      ) : (
                                                                             <li className="text-gray-500 px-2 py-1">No users assigned</li>
                                                                      )}
                                                               </ul>
                                                        </ScrollArea>
                                                 </div>

                                                 {/* Permissions */}
                                                 <div className="mb-4">
                                                        <MultiSelect
                                                               options={Permissions}
                                                               label="Permissions"
                                                               fieldProps={{ control: methods.control, name: "permissions" }}
                                                               isDisabled={!canEdit}
                                                        />
                                                 </div>

                                                 {/* Footer */}
                                                 <SheetFooter className="pt-4 flex flex-col gap-2 px-0">
                                                        <div className="mt-2 text-sm text-white font-semibold">
                                                               Note : {role?.versionHistory || "No version info available"}
                                                        </div>

                                                        {canEdit && (
                                                               <AlertDialog>
                                                                      <AlertDialogTrigger asChild>
                                                                             <Button
                                                                                    type="button"
                                                                                    className="w-full bg-[#EC981A] cursor-pointer"
                                                                                    variant="ghost"
                                                                             >
                                                                                    Save Changes
                                                                             </Button>
                                                                      </AlertDialogTrigger>
                                                                      <AlertDialogContent className="font-display">
                                                                             <AlertDialogHeader>
                                                                                    <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                           Updating this role will also update <span className="font-semibold text-black">All users</span> with this role.
                                                                                           Are you sure you want to continue?
                                                                                    </AlertDialogDescription>
                                                                             </AlertDialogHeader>
                                                                             <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                    <AlertDialogAction
                                                                                           className="bg-[#EC981A] hover:bg-[#d58210]"
                                                                                           onClick={methods.handleSubmit(onSubmit)}
                                                                                    >
                                                                                           Yes, Update
                                                                                    </AlertDialogAction>
                                                                             </AlertDialogFooter>
                                                                      </AlertDialogContent>
                                                               </AlertDialog>
                                                        )}
                                                 </SheetFooter>
                                          </form>
                                   </FormProvider>
                            )}
                     </SheetContent>
              </Sheet>
       );
};

export default RoleSheet;

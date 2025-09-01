import { useEffect } from "react";
import {
       Sheet,
       SheetContent,
       SheetHeader,
       SheetTitle,
       SheetFooter,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "../../../components/common/form/FloatingLabels";
import { MultiSelect } from "../../../components/common/form/MultiSelect";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser, updateUser } from "@/store/slices/userSlice";
import { toast } from "sonner";
import { fetchRoles, fetchRolePermissions } from "../../../store/slices/roleSlice";
import { RoleSelect } from "../../../components/common/form/RoleSelect";
import { Permissions } from "../../../data/permissions";
import { Loader2 } from "lucide-react";
import { isEqual } from "lodash";

// Validation schema
const formSchema = z.object({
       firstName: z.string().min(2, "Name must be at least 2 characters."),
       lastName: z.string().min(2, "Name must be at least 2 characters."),
       username: z.string().min(2, "Username must be at least 2 characters."),
       email: z.string().email("Enter a valid email."),
       role: z.string().min(2, "Role is required."),
       permissions: z.array(z.string()).min(1, "Select at least 1 permission."),
       enabled: z.boolean(),
});

const UserDetailSheet = ({ userId, isOpen, onClose }) => {
       const dispatch = useDispatch();
       const { user, fetchingSingleUser, singleUserError, versionHistory } = useSelector(
              (state) => state.users
       );
       const { selectedRolePermissions, list: roles } = useSelector(
              (state) => state.roles
       );

       const form = useForm({
              resolver: zodResolver(formSchema),
              defaultValues: {
                     firstName: "",
                     lastName: "",
                     username: "",
                     email: "",
                     tokens: "",
                     role: "",
                     permissions: [],
                     enabled: true,
              },
       });

       const selectedRole = form.watch("role");

       // Fetch roles and user data
       useEffect(() => {
              if (userId) {
                     dispatch(fetchRoles());
                     dispatch(getSingleUser(userId));
              }
       }, [userId, dispatch]);

       // Update form when user data is fetched
       useEffect(() => {
              if (user && roles.length > 0) {
                     const selectedRole = roles.find((role) => role.value === user.role._id);
                     form.reset({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            username: user.username,
                            email: user.email,
                            tokens: user.tokens,
                            role: selectedRole ? selectedRole.value : user.role,
                            permissions: user.permissions,
                            enabled: user.enabled,
                     });
              }
       }, [user, roles, form]);

       // Fetch permissions when role changes
       useEffect(() => {
              if (selectedRole) {
                     dispatch(fetchRolePermissions(selectedRole));
              }
       }, [selectedRole, dispatch]);

       // Update permissions field when role permissions are fetched
       useEffect(() => {
              if (selectedRolePermissions?.length) {
                     form.setValue("permissions", selectedRolePermissions);
              } else {
                     form.setValue("permissions", []);
              }
       }, [selectedRolePermissions, form]);

       if (singleUserError) {
              toast.error(`Failed to load user: ${singleUserError}`);
              return null;
       }

       // Updating User
       const handleUpdateUser = async (data) => {
              const updatedData = {};

              // Compare form values to user data (ignoring 'tokens' field)
              Object.keys(data).forEach((key) => {
                     if (key !== "tokens") {
                            if (key === "role") {
                                   if (data[key] !== user.role?._id) {
                                          updatedData[key] = data[key];
                                   }
                            } else if (Array.isArray(data[key])) {
                                   if (!isEqual(data[key], user[key])) {
                                          updatedData[key] = data[key];
                                   }
                            } else if (typeof data[key] === "object") {
                                   if (!isEqual(data[key], user[key])) {
                                          updatedData[key] = data[key];
                                   }
                            } else if (data[key] !== user[key]) {
                                   updatedData[key] = data[key];
                            }
                     }
              });

              // If no changes are detected, show a message and return
              if (Object.keys(updatedData).length === 0) {
                     toast.warning("No changes detected.");
                     return;
              }

              // Dispatch the updateUser thunk
              try {
                     await dispatch(updateUser({ userId, userData: updatedData })).unwrap();
                     toast.success("User updated successfully!");
                     onClose(); // Close the sheet after successful update
              } catch (error) {
                     toast.error(`Failed to update user: ${error.message}`);
              }
       };

       return (
              <Sheet open={isOpen} onOpenChange={onClose}>
                     <SheetContent className="bg-[#181A27] text-white p-4 font-display w-full sm:max-w-md md:max-w-xl lg:max-w-2xl">
                            <SheetHeader className="p-0">
                                   <SheetTitle className="text-lg font-bold text-[#EC981A]">
                                          User Details
                                   </SheetTitle>
                            </SheetHeader>

                            {fetchingSingleUser ? (
                                   <div className="flex items-center justify-center h-full">
                                          <Loader2 className="animate-spin text-white h-10 w-10 m-auto" />
                                   </div>
                            ) : (
                                   <>
                                          <div className="flex items-center gap-5">
                                                 <img
                                                        src={user?.profilePic}
                                                        alt={user?.fullName}
                                                        className="rounded"
                                                 />
                                                 <p className="text-xl font-semibold">{user?.fullName}</p>
                                          </div>

                                          <Form {...form}>
                                                 <form
                                                        className="space-y-6 mt-3"
                                                        onSubmit={form.handleSubmit(handleUpdateUser)}
                                                 >
                                                        {/* Enabled Switch */}
                                                        <FormField
                                                               control={form.control}
                                                               name="enabled"
                                                               render={({ field }) => (
                                                                      <FormItem className="flex items-center justify-between">
                                                                             <FormLabel>Enabled</FormLabel>
                                                                             <FormControl>
                                                                                    <Switch
                                                                                           checked={field.value}
                                                                                           onCheckedChange={(val) => field.onChange(val)}
                                                                                    />
                                                                             </FormControl>
                                                                      </FormItem>
                                                               )}
                                                        />

                                                        {/* First Name */}
                                                        <FloatingLabelInput
                                                               label={"First Name"}
                                                               fieldProps={{ control: form.control, name: "firstName" }}
                                                               type="text"
                                                        />

                                                        {/* Last Name */}
                                                        <FloatingLabelInput
                                                               label={"Last Name"}
                                                               fieldProps={{ control: form.control, name: "lastName" }}
                                                               type="text"
                                                        />

                                                        {/* Username */}
                                                        <FloatingLabelInput
                                                               label={"Username"}
                                                               fieldProps={{ control: form.control, name: "username" }}
                                                               type="text"
                                                        />

                                                        {/* Email */}
                                                        <FloatingLabelInput
                                                               label={"Email"}
                                                               fieldProps={{ control: form.control, name: "email" }}
                                                               type="email"
                                                        />

                                                        {/* Tokens */}
                                                        <FloatingLabelInput
                                                               label={"Tokens"}
                                                               fieldProps={{ control: form.control, name: "tokens" }}
                                                               type="text"
                                                               disabled={true}
                                                        />

                                                        {/* Role */}
                                                        <RoleSelect
                                                               label="Role"
                                                               options={roles}
                                                               fieldProps={{ control: form.control, name: "role" }}
                                                               createRolePath="/roles"
                                                        />

                                                        {/* Permissions */}
                                                        <MultiSelect
                                                               options={Permissions}
                                                               label="Permissions"
                                                               fieldProps={{ control: form.control, name: "permissions" }}
                                                        />

                                                        <SheetFooter className="px-0 flex flex-col gap-4">
                                                               <p>Note : {versionHistory}</p>
                                                               <Button
                                                                      type="submit"
                                                                      className="bg-[#EC981A] text-black font-semibold cursor-pointer"
                                                                      variant="ghost"
                                                               >
                                                                      Update
                                                               </Button>
                                                        </SheetFooter>
                                                 </form>
                                          </Form>
                                   </>
                            )}
                     </SheetContent>
              </Sheet>
       );
};

export default UserDetailSheet;

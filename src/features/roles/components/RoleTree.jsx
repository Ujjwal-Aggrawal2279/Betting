import { useEffect, useState } from "react";
import { Tree } from "react-arborist";
import { Card } from "@/components/ui/card";
import { PlusCircle, GripVertical, Folder, FolderOpen, Eye, Loader, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
       Dialog,
       DialogContent,
       DialogHeader,
       DialogTitle,
       DialogFooter,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { MultiSelect } from "../../../components/common/form/MultiSelect";
import { Permissions } from "../../../data/permissions";
import { FloatingLabelInput } from "../../../components/common/form/FloatingLabels";
import { useDispatch, useSelector } from "react-redux";
import { createRole, deleteRole, fetchRoles } from "../../../store/slices/roleSlice";
import { toast } from "sonner";
import RoleSheet from "./RoleSheet";
import RoleDeleteAlert from "./RoleDeleteAlert";

// Zod validation schema for adding a child role
const childSchema = z.object({
       childName: z.string().min(1, "Child name is required"),
       permissions: z.array(z.string()).min(1, "Select at least 1 permission."),
       parentRole: z.string().optional(),
});

export default function RolesTree() {
       const dispatch = useDispatch();
       const { tree: roles, loadingRoles } = useSelector((state) => state.roles);

       const [openDialog, setOpenDialog] = useState(false);
       const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
       const [selectedNode, setSelectedNode] = useState(null);

       const [sheetOpen, setSheetOpen] = useState(false);
       const [selectedRoleId, setSelectedRoleId] = useState(null);

       const form = useForm({
              resolver: zodResolver(childSchema),
              defaultValues: { childName: "", permissions: [], parentRole: "" },
       });

       // Fetch roles on mount
       useEffect(() => {
              dispatch(fetchRoles());
       }, [dispatch]);

       // Update parentRole field when selectedNode changes
       useEffect(() => {
              if (selectedNode) {
                     form.setValue("parentRole", selectedNode.data.name);
              }
       }, [selectedNode, form]);

       const handleAddChildRole = async (values) => {
              if (!selectedNode) return;

              try {
                     await dispatch(
                            createRole({
                                   name: values.childName,
                                   parentRole: selectedNode.data.name,
                                   permissions: values.permissions,
                            })
                     ).unwrap();

                     dispatch(fetchRoles());
                     form.reset();
                     setSelectedNode(null);
                     setOpenDialog(false);
                     toast.success("Role created successfully!");
              } catch (err) {
                     toast.error(err.message || "Failed to create role");
              }
       };

       const handleDeleteRole = async (roleId) => {
              try {
                     const response = await dispatch(deleteRole(roleId));
                     if (response) {
                            dispatch(fetchRoles());
                            toast.success(response.payload.message);
                            setOpenDeleteDialog(false);
                     } else {
                            toast.error(response.payload.message);
                     }
              } catch (err) {
                     toast.error(err.message || "Failed to delete role");
                     setOpenDeleteDialog(false);
              }
       };

       if (loadingRoles)
              return (
                     <div className="flex items-center justify-center w-full h-full">
                            <Loader className="animate-spin text-white h-10 w-10 m-auto" />
                     </div>
              );

       return (
              <div className="p-4 text-white">
                     <h1 className="text-3xl font-bold mb-6 text-[#EC981A] font-display">Role Hierarchy</h1>

                     <div style={{ height: 500 }}>
                            {roles?.length > 0 ? (
                                   <Tree
                                          initialData={roles}
                                          width="100%"
                                          rowHeight={50}
                                          paddingLeft={24}
                                          indent={24}
                                   >
                                          {({ node, style, dragHandle }) => (
                                                 <Card
                                                        style={style}
                                                        className="flex px-3 py-2 bg-[#1F2233] hover:bg-[#2A2E44] transition-colors duration-200 cursor-pointer border-none shadow-sm rounded-none"
                                                 >
                                                        <div className="flex items-center gap-2 px-2 text-white text-lg w-full justify-between">
                                                               <div className="flex items-center gap-2">
                                                                      <span {...dragHandle} className="cursor-grab text-gray-400 hover:text-gray-200">
                                                                             <GripVertical size={18} />
                                                                      </span>

                                                                      {node.isLeaf ? (
                                                                             <Folder size={18} className="text-gray-400" />
                                                                      ) : node.isOpen ? (
                                                                             <FolderOpen size={18} className="text-[#EC981A]" />
                                                                      ) : (
                                                                             <Folder size={18} className="text-gray-400" />
                                                                      )}

                                                                      <span className="font-medium">{node.data.name}</span>
                                                               </div>

                                                               <div className="flex gap-5">
                                                                      <Eye
                                                                             size={18}
                                                                             className="cursor-pointer text-gray-400 hover:text-gray-200"
                                                                             onClick={() => {
                                                                                    setSelectedRoleId(node.data.id);
                                                                                    setSheetOpen(true);
                                                                             }}
                                                                      />
                                                                      <Trash2
                                                                             size={18}
                                                                             className="cursor-pointer text-gray-400 hover:text-gray-200"
                                                                             onClick={() => {
                                                                                    setSelectedRoleId(node.data.id);
                                                                                    setOpenDeleteDialog(true);
                                                                             }}
                                                                      />
                                                                      <PlusCircle
                                                                             size={18}
                                                                             className="cursor-pointer text-gray-400 hover:text-gray-200"
                                                                             onClick={() => {
                                                                                    setSelectedNode(node);
                                                                                    setOpenDialog(true);
                                                                             }}
                                                                      />
                                                               </div>
                                                        </div>
                                                 </Card>
                                          )}
                                   </Tree>
                            ) : (
                                   <p className="text-white">No roles found.</p>
                            )}
                     </div>

                     {/* RoleSheet */}
                     {selectedRoleId && (
                            <RoleSheet
                                   roleId={selectedRoleId}
                                   open={sheetOpen}
                                   onOpenChange={setSheetOpen}
                            />
                     )}

                     {/* Add Child Role Dialog */}
                     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogContent className="bg-[#1F2233] text-white border border-gray-700 font-display">
                                   <DialogHeader>
                                          <DialogTitle>Add Child Role</DialogTitle>
                                   </DialogHeader>

                                   <Form {...form}>
                                          <form
                                                 onSubmit={form.handleSubmit(handleAddChildRole)}
                                                 className="grid gap-4 py-4"
                                          >
                                                 <FloatingLabelInput
                                                        label="Parent Role"
                                                        fieldProps={{ control: form.control, name: "parentRole" }}
                                                        type="text"
                                                        disabled
                                                 />

                                                 <FloatingLabelInput
                                                        label="Child Role"
                                                        fieldProps={{ control: form.control, name: "childName" }}
                                                        type="text"
                                                 />

                                                 <MultiSelect
                                                        options={Permissions}
                                                        label="Permissions"
                                                        fieldProps={{ control: form.control, name: "permissions" }}
                                                 />

                                                 <DialogFooter className="flex justify-end gap-2">
                                                        <Button
                                                               type="button"
                                                               variant="ghost"
                                                               onClick={() => setOpenDialog(false)}
                                                               className="cursor-pointer bg-white text-black"
                                                        >
                                                               Cancel
                                                        </Button>
                                                        <Button
                                                               type="submit"
                                                               className="bg-[#EC981A] font-semibold cursor-pointer"
                                                               variant="ghost"
                                                        >
                                                               Add
                                                        </Button>
                                                 </DialogFooter>
                                          </form>
                                   </Form>
                            </DialogContent>
                     </Dialog>

                     {/* RoleDeleteAlert Component */}
                     <RoleDeleteAlert
                            open={openDeleteDialog}
                            onClose={() => setOpenDeleteDialog(false)}
                            onDelete={handleDeleteRole}
                            roleId={selectedRoleId}
                     />
              </div>
       );
}

import { useState } from "react"
import { Tree } from "react-arborist"
import { Card } from "@/components/ui/card"
import { PlusCircle, GripVertical, Folder, FolderOpen, Eye } from "lucide-react"
import {
       Dialog,
       DialogContent,
       DialogHeader,
       DialogTitle,
       DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
       Form,
       FormField,
       FormItem,
       FormLabel,
       FormControl,
       FormMessage,
} from "@/components/ui/form"
import { MultiSelect } from "../../../components/common/form/MultiSelect"
import { Permissions } from "../../../data/permissions"
import { FloatingLabelInput } from "../../../components/common/form/FloatingLabels"

const childSchema = z.object({
       childName: z.string().min(1, "Child name is required"),
       permissions: z.array(z.string()).min(1, "Select at least 1 permission."),
})

export default function RolesTree() {
       const [roles, setRoles] = useState([
              {
                     id: "admin",
                     name: "Admin",
                     children: [
                            { id: "manager", name: "Manager" },
                            { id: "user", name: "User" },
                     ],
              },
       ])

       const [openDialog, setOpenDialog] = useState(false)
       const [selectedNode, setSelectedNode] = useState(null)

       const form = useForm({
              resolver: zodResolver(childSchema),
              defaultValues: { childName: "", permissions: [] },
       })

       const handleAddChildRole = (values) => {
              if (!selectedNode) return
              selectedNode.addChild({
                     id: values.childName.toLowerCase(),
                     name: values.childName,
              })
              form.reset()
              setSelectedNode(null)
              setOpenDialog(false)
       }

       return (
              <div className="p-4 text-white">
                     <h1 className="text-3xl font-bold mb-6 text-[#EC981A] font-display">Role Hierarchy</h1>

                     <div style={{ height: 500 }}>
                            <Tree
                                   initialData={roles}
                                   width="100%"
                                   rowHeight={50}
                                   paddingLeft={24}
                                   indent={24}
                                   onChange={setRoles}
                            >
                                   {({ node, style, dragHandle }) => (
                                          <Card
                                                 style={style}
                                                 className="flex px-3 py-2 bg-[#1F2233] hover:bg-[#2A2E44] transition-colors duration-200 cursor-pointer border-none shadow-sm rounded-none"
                                          >
                                                 <div className="flex items-center gap-2 px-2 text-white text-lg w-full justify-between">
                                                        <div className="flex items-center gap-2">
                                                               {/* Drag handle */}
                                                               <span {...dragHandle} className="cursor-grab text-gray-400 hover:text-gray-200">
                                                                      <GripVertical size={18} />
                                                               </span>

                                                               {/* Expand / Collapse */}
                                                               {node.isLeaf ? (
                                                                      <Folder size={18} className="text-gray-400" />
                                                               ) : node.isOpen ? (
                                                                      <FolderOpen size={18} className="text-[#EC981A]" />
                                                               ) : (
                                                                      <Folder size={18} className="text-gray-400" />
                                                               )}

                                                               {/* Role name */}
                                                               <span className="font-medium">{node.data.name}</span>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-5">
                                                               <Eye size={18} className="cursor-pointer text-gray-400 hover:text-gray-200" />
                                                               <PlusCircle
                                                                      size={18}
                                                                      className="cursor-pointer text-gray-400 hover:text-gray-200"
                                                                      onClick={() => {
                                                                             setSelectedNode(node)
                                                                             setOpenDialog(true)
                                                                      }}
                                                               />
                                                        </div>
                                                 </div>
                                          </Card>
                                   )}
                            </Tree>
                     </div>

                     {/* Add Child Dialog */}
                     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogContent className="bg-[#1F2233] text-white border border-gray-700 font-display">
                                   <DialogHeader>
                                          <DialogTitle>Add Child Role</DialogTitle>
                                   </DialogHeader>

                                   <Form {...form}>
                                          <form onSubmit={form.handleSubmit(handleAddChildRole)} className="grid gap-4 py-4">
                                                 {/* Parent (disabled) */}
                                                 <FloatingLabelInput
                                                        label="Parent Role"
                                                        fieldProps={{ control: form.control, name: "parentRole" }}
                                                        type="text"
                                                        defaultValue={selectedNode?.data?.name || ""}
                                                        disabled
                                                 />

                                                 {/* Child Role */}
                                                 <FloatingLabelInput
                                                        label={"Child Role"}
                                                        fieldProps={{ control: form.control, name: "childName" }}
                                                        type="text"
                                                 />

                                                 {/* Permissions */}
                                                 <MultiSelect
                                                        options={Permissions}
                                                        label="Permissions"
                                                        fieldProps={{ control: form.control, name: "permissions" }}
                                                 />

                                                 <DialogFooter>
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
              </div>
       )
}

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
       Sheet,
       SheetContent,
       SheetHeader,
       SheetTitle,
       SheetTrigger,
       SheetFooter,
} from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import { FloatingLabelInput } from "../../../components/common/form/FloatingLabels"
import { MultiSelect } from "../../../components/common/form/MultiSelect"
import { RoleSelect } from "../../../components/common/form/RoleSelect"
import { Permissions } from "../../../data/permissions"
import { Switch } from "@/components/ui/switch"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchRoles } from "../../../store/slices/roleSlice"

// ✅ Validation schema
const formSchema = z.object({
       firstname: z.string().min(2, "Name must be at least 2 characters."),
       lastname: z.string().min(2, "Name must be at least 2 characters."),
       username: z.string().min(2, "Username must be at least 2 characters."),
       email: z.string().email("Enter a valid email."),
       password: z.string().min(6, "Password must be at least 6 characters."),
       tokens: z.string().min(2, "Tokens is required."),
       role: z.string().min(2, "Role is required."),
       permissions: z.array(z.string()).min(1, "Select at least 1 permission."),
       enabled: z.boolean(),
})

export default function AddUserSheet() {
       const dispatch = useDispatch();
       const { list: roles, loading } = useSelector(state => state.roles)
       const form = useForm({
              resolver: zodResolver(formSchema),
              defaultValues: {
                     firstname: "",
                     lastname: "",
                     username: "",
                     email: "",
                     password: "",
                     tokens: "",
                     role: "",
                     permissions: [],
                     enabled: true,
              },

       })

       // Fetch Roles
       useEffect(() => {
              dispatch(fetchRoles());
       }, [dispatch]);


       const onSubmit = (data) => {
              console.log("New User:", data)
              // 🔥 You can call API here
       }

       return (
              <Sheet>
                     <SheetTrigger asChild>
                            <Button className="bg-[#EC981A] text-black font-semibold cursor-pointer" variant="ghost">
                                   Add <Plus className="ml-2 h-4 w-4" />
                            </Button>
                     </SheetTrigger>

                     <SheetContent className="bg-[#181A27] text-white p-4 font-display w-full sm:max-w-md md:max-w-xl lg:max-w-2xl">
                            <SheetHeader className="p-0">
                                   <SheetTitle className="text-lg font-bold text-[#EC981A]">Create New User</SheetTitle>
                            </SheetHeader>

                            <Form {...form}>
                                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-3">

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


                                          {/* first name */}
                                          <FloatingLabelInput
                                                 label={"First Name"}
                                                 fieldProps={{ control: form.control, name: "firstname" }}
                                                 type="text"
                                          />

                                          {/* last name */}
                                          <FloatingLabelInput
                                                 label={"Last Name"}
                                                 fieldProps={{ control: form.control, name: "lastname" }}
                                                 type="text"
                                          />

                                          {/* username */}
                                          <FloatingLabelInput
                                                 label={"Username"}
                                                 fieldProps={{ control: form.control, name: "username" }}
                                                 type="text"
                                          />

                                          {/* email */}
                                          <FloatingLabelInput
                                                 label={"Email"}
                                                 fieldProps={{ control: form.control, name: "email" }}
                                                 type="email"
                                          />

                                          {/* password */}
                                          <FloatingLabelInput
                                                 label={"Password"}
                                                 fieldProps={{ control: form.control, name: "password" }}
                                                 type="password"
                                          />

                                          {/* tokens */}
                                          <FloatingLabelInput
                                                 label={"Tokens"}
                                                 fieldProps={{ control: form.control, name: "tokens" }}
                                                 type="text"
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

                                          <SheetFooter className="px-0">
                                                 <Button type="submit" className="bg-[#EC981A] text-black font-semibold cursor-pointer" variant="ghost">
                                                        Create
                                                 </Button>
                                          </SheetFooter>
                                   </form>
                            </Form>
                     </SheetContent>
              </Sheet>
       )
}

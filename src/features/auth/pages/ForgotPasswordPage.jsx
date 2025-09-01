import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
       Form,
       FormField,
       FormItem,
       FormControl,
       FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import http from "../../../services/http";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Layout from "../../../components/common/Layout"

// ----------------------
// Validation Schema
// ----------------------
const forgotPasswordSchema = z.object({
       oldPassword: z.string().min(1, "Old password is required"),
       newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

const ForgotPasswordPage = () => {
       const [loading, setLoading] = useState(false);
       const [showOldPassword, setShowOldPassword] = useState(false);
       const [showNewPassword, setShowNewPassword] = useState(false);

       const form = useForm({
              resolver: zodResolver(forgotPasswordSchema),
              defaultValues: {
                     oldPassword: "",
                     newPassword: "",
              },
       });

       // ----------------------
       // Handle password change
       // ----------------------
       const handleForgotPassword = async (values) => {
              try {
                     setLoading(true);

                     const response = await http.post("/forgot-password", {
                            oldPassword: values.oldPassword,
                            newPassword: values.newPassword,
                     });

                     toast.success(response.data.message || "Password changed successfully");
                     form.reset();
              } catch (err) {
                     toast.error(err?.response?.data?.message || "Failed to update password");
              } finally {
                     setLoading(false);
              }
       };

       return (
              <Layout>
                     <div className="flex justify-center items-center h-full font-display">
                            <div className="w-full max-w-md p-6 bg-gray-800 rounded-md shadow-lg">
                                   <h1 className="text-2xl font-semibold text-white mb-6">Change Password</h1>

                                   <Form {...form}>
                                          <form
                                                 onSubmit={form.handleSubmit(handleForgotPassword)}
                                                 className="space-y-5"
                                          >
                                                 {/* Old Password */}
                                                 <FormField
                                                        control={form.control}
                                                        name="oldPassword"
                                                        render={({ field }) => (
                                                               <FormItem>
                                                                      <div className="relative">
                                                                             <FormControl>
                                                                                    <Input
                                                                                           {...field}
                                                                                           type={showOldPassword ? "text" : "password"}
                                                                                           placeholder="Old Password"
                                                                                           className="bg-gray-700 text-white border-0 rounded focus:ring-2 focus:ring-yellow-400 p-4 pr-12"
                                                                                    />
                                                                             </FormControl>
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={() => setShowOldPassword((prev) => !prev)}
                                                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-yellow-400"
                                                                             >
                                                                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                                             </button>
                                                                      </div>
                                                                      <FormMessage className="text-yellow-400" />
                                                               </FormItem>
                                                        )}
                                                 />

                                                 {/* New Password */}
                                                 <FormField
                                                        control={form.control}
                                                        name="newPassword"
                                                        render={({ field }) => (
                                                               <FormItem>
                                                                      <div className="relative">
                                                                             <FormControl>
                                                                                    <Input
                                                                                           {...field}
                                                                                           type={showNewPassword ? "text" : "password"}
                                                                                           placeholder="New Password"
                                                                                           className="bg-gray-700 text-white border-0 rounded focus:ring-2 focus:ring-yellow-400 p-4 pr-12"
                                                                                    />
                                                                             </FormControl>
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-yellow-400"
                                                                             >
                                                                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                                             </button>
                                                                      </div>
                                                                      <FormMessage className="text-yellow-400" />
                                                               </FormItem>
                                                        )}
                                                 />

                                                 {/* Submit Button */}
                                                 <Button
                                                        type="submit"
                                                        className="w-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
                                                 >
                                                        {loading ? <Loader className="animate-spin mx-auto" /> : "Change Password"}
                                                 </Button>
                                          </form>
                                   </Form>
                            </div>
                     </div>
              </Layout>
       );
};

export default ForgotPasswordPage;

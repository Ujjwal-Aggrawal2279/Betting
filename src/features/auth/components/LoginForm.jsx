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
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../store/slices/authSlice";
import http from "../../../services/http";
import { Loader } from 'lucide-react';
import { toast } from "sonner"
import { useState } from "react";

const loginSchema = z.object({
       username: z.string().min(1, "Username is required"),
       password: z.string().min(1, "Password is required"),
});

const LoginForm = () => {
       const dispatch = useDispatch();
       const [loading, setLoading] = useState(false);
       const loginForm = useForm({
              resolver: zodResolver(loginSchema),
              defaultValues: { username: "", password: "" },
       });

       // handle login
       const handleLogin = async (values) => {
              try {
                     setLoading(true);
                     const { data } = await http.post("/login", {
                            username: values?.username,
                            password: values?.password,
                     });

                     if (data?.token) {
                            toast.success("Login successful");
                            dispatch(setCredentials({ token: data?.token }));
                     } else {
                            toast.error("Login failed");
                            setLoading(false);
                     }
              } catch (error) {
                     toast.error(error?.message);
                     setLoading(false);
              }
       };


       return (
              <section className="flex justify-between h-full">
                     {/* Left image only for large screens */}
                     <div className="hidden lg:flex items-end w-1/2">
                            <img src="/images/auth.svg" alt="Login Auth" />
                     </div>

                     {/* Right/Form section */}
                     <div className="flex items-center lg:w-1/2 w-full">
                            {/* Mobile layout with image as background */}
                            <div className="lg:hidden relative w-full h-full flex items-center justify-center">
                                   <img
                                          src="/images/auth.svg"
                                          alt="Auth Background"
                                          className="absolute inset-0 w-full h-full object-cover opacity-40 object-top"
                                   />
                                   <div className="relative z-10 flex flex-col items-center w-full px-6 font-display">
                                          <h1 className="text-4xl text-white font-semibold">Hello !</h1>
                                          <h2 className="text-4xl text-white font-semibold capitalize mt-2 mb-5">
                                                 welcome back
                                          </h2>

                                          <Form key="login" {...loginForm}>
                                                 <form className="space-y-5 xl:w-1/2 md:w-8/10 w-full" onSubmit={loginForm.handleSubmit(handleLogin)}>
                                                        <FormField
                                                               control={loginForm.control}
                                                               name="username"
                                                               render={({ field }) => (
                                                                      <FormItem>
                                                                             <FormControl>
                                                                                    <Input
                                                                                           {...field}
                                                                                           placeholder="Username"
                                                                                           className="bg-white/90 border-0 rounded focus:ring-2 focus:ring-yellow-400 p-5"
                                                                                    />
                                                                             </FormControl>
                                                                             <FormMessage className="text-yellow-300" />
                                                                      </FormItem>
                                                               )}
                                                        />
                                                        <FormField
                                                               control={loginForm.control}
                                                               name="password"
                                                               render={({ field }) => (
                                                                      <FormItem>
                                                                             <FormControl>
                                                                                    <Input
                                                                                           {...field}
                                                                                           placeholder="Password"
                                                                                           type="password"
                                                                                           className="bg-white/90 border-0 rounded focus:ring-2 focus:ring-yellow-400 p-5"
                                                                                    />
                                                                             </FormControl>
                                                                             <FormMessage className="text-yellow-300" />
                                                                      </FormItem>
                                                               )}
                                                        />
                                                        <p className="text-white capitalize text-sm text-right">
                                                               forgot password ?
                                                        </p>
                                                        <Button
                                                               className="bg-white text-black w-full font-semibold cursor-pointer"
                                                               variant="ghost"
                                                        >
                                                               {loading ? <Loader className="animate-spin" /> : "Login"}
                                                        </Button>
                                                 </form>
                                          </Form>
                                   </div>
                            </div>

                            {/* Desktop form (right side) */}
                            <div className="hidden lg:flex flex-col flex-1 items-center font-display">
                                   <h1 className="text-4xl text-white font-semibold">Hello !</h1>
                                   <h2 className="text-4xl text-white font-semibold capitalize mt-2 mb-5">welcome back</h2>
                                   <Form key="login" {...loginForm}>
                                          <form className="space-y-5 xl:w-2/3 w-8/10 font-display" onSubmit={loginForm.handleSubmit(handleLogin)}>
                                                 {/* Username */}
                                                 <FormField
                                                        control={loginForm.control}
                                                        name="username"
                                                        render={({ field }) => (
                                                               <FormItem>
                                                                      <FormControl>
                                                                             <Input
                                                                                    {...field}
                                                                                    placeholder="Username"
                                                                                    className="bg-white/90 border-0 rounded focus:ring-2 focus:ring-yellow-400 p-5"
                                                                             />
                                                                      </FormControl>
                                                                      <FormMessage className="text-yellow-300" />
                                                               </FormItem>
                                                        )}
                                                 />
                                                 {/* Password */}
                                                 <FormField
                                                        control={loginForm.control}
                                                        name="password"
                                                        render={({ field }) => (
                                                               <FormItem>
                                                                      <FormControl>
                                                                             <Input
                                                                                    {...field}
                                                                                    placeholder="Password"
                                                                                    type="password"
                                                                                    className="bg-white/90 border-0 rounded focus:ring-2 focus:ring-yellow-400 p-5"
                                                                             />
                                                                      </FormControl>
                                                                      <FormMessage className="text-yellow-300" />
                                                               </FormItem>
                                                        )}
                                                 />
                                          </form>
                                   </Form>
                                   <p className="text-white py-3 capitalize text-sm">forgot password ?</p>
                                   <Button className="bg-white text-black xl:w-2/3 w-8/10 font-semibold cursor-pointer" variant="ghost">{loading ? <Loader className="animate-spin" /> : "Login"}</Button>
                            </div>
                     </div>
              </section>
       );
};


export default LoginForm;

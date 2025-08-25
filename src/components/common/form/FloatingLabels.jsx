import {
       FormControl,
       FormField,
       FormItem,
       FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export const FloatingLabelInput = ({ label, fieldProps, type = "text", defaultValue, disabled }) => {
       return (
              <FormField
                     control={fieldProps.control}
                     name={fieldProps.name}
                     rules={{ required: `${label} is required` }}
                     render={({ field }) => (
                            <FormItem className="relative w-full mb-6">
                                   <FormControl>
                                          <div className="relative font-display">
                                                 <Input
                                                        type={type}
                                                        {...field}
                                                        value={field.value ?? defaultValue ?? ""}   // 👈 fallback to defaultValue
                                                        disabled={disabled}
                                                        placeholder=" "
                                                        className="peer w-full rounded-none p-4 text-lg 
                           !focus:outline-none !focus:ring-0 !focus:shadow-none
                           focus:border-none focus-visible:ring-none"
                                                 />
                                                 <label
                                                        className="absolute left-4 top-2.5 text-gray-500 transition-all
                  peer-placeholder-shown:top-2
                  peer-placeholder-shown:text-base
                  peer-focus:-top-4
                  peer-focus:text-xl
                  peer-focus:text-gray-700
                  peer-focus:bg-white
                  peer-focus:px-4
                  peer-[&:not(:placeholder-shown)]:-top-4
                  peer-[&:not(:placeholder-shown)]:text-xl
                  peer-[&:not(:placeholder-shown)]:text-gray-700
                  peer-[&:not(:placeholder-shown)]:bg-white
                  peer-[&:not(:placeholder-shown)]:px-4
                  !text-sm pointer-events-none"
                                                 >
                                                        {label}
                                                 </label>
                                          </div>
                                   </FormControl>
                                   <FormMessage />
                            </FormItem>
                     )}
              />
       )
}

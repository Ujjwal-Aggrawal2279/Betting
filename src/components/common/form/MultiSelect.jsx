import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import {
       Command,
       CommandEmpty,
       CommandGroup,
       CommandInput,
       CommandItem,
       CommandList,
} from "@/components/ui/command"
import {
       Popover,
       PopoverContent,
       PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"

export function MultiSelect({ options, label, fieldProps }) {
       const userPermissions = useSelector((state) => state.auth.permissions);
       const canEdit = userPermissions.includes("role_permissions_manager");
       const [open, setOpen] = useState(false);

       return (
              <FormField
                     control={fieldProps.control}
                     name={fieldProps.name}
                     render={({ field }) => {

                            const toggleOption = (option) => {
                                   if (!canEdit) return;
                                   let newValue;
                                   if (field.value?.includes(option.value)) {
                                          newValue = field.value.filter((v) => v !== option.value);
                                   } else {
                                          newValue = [...(field.value || []), option.value];
                                   }
                                   field.onChange(newValue);
                            };

                            return (
                                   <FormItem>
                                          <FormLabel>{label}</FormLabel>
                                          <Popover open={open} onOpenChange={setOpen}>
                                                 <PopoverTrigger asChild>
                                                        <Button
                                                               variant="outline"
                                                               role="combobox"
                                                               className={`w-full justify-between rounded-none ${canEdit
                                                                      ? "text-white bg-[#131620] hover:bg-[#131620] hover:text-white cursor-pointer"
                                                                      : "text-gray-400 bg-gray-800 cursor-not-allowed"
                                                                      }`}
                                                        >
                                                               {field.value?.length > 0 ? `${field.value.length} selected` : "Select..."}
                                                               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                 </PopoverTrigger>
                                                 <PopoverContent align="start" className="w-full p-0">
                                                        <Command>
                                                               <CommandInput placeholder="Search..." disabled={!canEdit} />
                                                               <CommandList>
                                                                      <CommandEmpty>No results found.</CommandEmpty>
                                                                      <CommandGroup className="font-display font-medium">
                                                                             {options.map((option) => (
                                                                                    <CommandItem
                                                                                           key={option.value}
                                                                                           onSelect={() => toggleOption(option)}
                                                                                    >
                                                                                           <Check
                                                                                                  className={cn(
                                                                                                         "mr-2 h-4 w-4",
                                                                                                         field.value?.includes(option.value) ? "opacity-100" : "opacity-0"
                                                                                                  )}
                                                                                           />
                                                                                           {option.label}
                                                                                    </CommandItem>
                                                                             ))}
                                                                      </CommandGroup>
                                                               </CommandList>
                                                        </Command>
                                                 </PopoverContent>
                                          </Popover>
                                          <FormMessage />
                                   </FormItem>
                            );
                     }}
              />
       );
}


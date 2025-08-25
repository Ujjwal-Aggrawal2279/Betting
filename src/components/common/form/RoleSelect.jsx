import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
       Command,
       CommandEmpty,
       CommandGroup,
       CommandInput,
       CommandItem,
       CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function RoleSelect({ options, label, fieldProps, createRolePath }) {
       console.log(options)
       const [open, setOpen] = useState(false)
       const navigate = useNavigate()

       return (
              <FormField
                     control={fieldProps.control}
                     name={fieldProps.name}
                     render={({ field }) => (
                            <FormItem>
                                   <FormLabel>{label}</FormLabel>
                                   <Popover open={open} onOpenChange={setOpen}>
                                          <PopoverTrigger asChild>
                                                 <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between text-white bg-[#131620] rounded-none hover:bg-[#131620] hover:text-white hover:cursor-pointer"
                                                 >
                                                        {field.value
                                                               ? options.find((o) => o.value === field.value)?.label
                                                               : "Select role..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                 </Button>
                                          </PopoverTrigger>
                                          <PopoverContent align="start" className="w-full p-0">
                                                 <Command>
                                                        <CommandInput placeholder="Search roles..." />
                                                        <CommandList>
                                                               <CommandEmpty>No results found.</CommandEmpty>
                                                               <CommandGroup>
                                                                      {options.map((option) => (
                                                                             <CommandItem
                                                                                    key={option.value}
                                                                                    onSelect={() => {
                                                                                           field.onChange(option.value)
                                                                                           setOpen(false)
                                                                                    }}
                                                                             >
                                                                                    {option.label}
                                                                             </CommandItem>
                                                                      ))}

                                                                      <CommandItem
                                                                             className="text-orange-400 font-semibold"
                                                                             onSelect={() => {
                                                                                    setOpen(false)
                                                                                    navigate(createRolePath)
                                                                             }}
                                                                      >
                                                                             + Create new role...
                                                                      </CommandItem>
                                                               </CommandGroup>
                                                        </CommandList>
                                                 </Command>
                                          </PopoverContent>
                                   </Popover>
                                   <FormMessage />
                            </FormItem>
                     )}
              />
       )
}

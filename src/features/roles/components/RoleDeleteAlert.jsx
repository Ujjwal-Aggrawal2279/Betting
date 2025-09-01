import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const RoleDeleteAlert = ({ open, onClose, onDelete, roleId }) => {
       return (
              <AlertDialog open={open} onOpenChange={onClose}>
                     <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="hidden"></Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent className="font-display">
                            <AlertDialogHeader>
                                   <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                   <AlertDialogDescription>
                                          Are you sure you want to delete the role and all its related users? This action cannot be undone.
                                   </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                   <AlertDialogCancel onClick={() => onClose()}>Cancel</AlertDialogCancel>
                                   <AlertDialogAction
                                          className="bg-[#EC981A] hover:bg-[#d58210]"
                                          onClick={() => {
                                                 onDelete(roleId);
                                                 onClose();
                                          }}
                                   >
                                          Yes, Delete
                                   </AlertDialogAction>
                            </AlertDialogFooter>
                     </AlertDialogContent>
              </AlertDialog>
       );
};

export default RoleDeleteAlert;

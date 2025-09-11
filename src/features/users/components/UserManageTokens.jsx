import React, { useState } from "react";
import {
       Dialog,
       DialogContent,
       DialogHeader,
       DialogTitle,
       DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchUsers, manageUserTokens } from "../../../store/slices/userSlice";

const UserManageTokens = ({ userId, isOpen, onClose }) => {
       const dispatch = useDispatch();
       const [action, setAction] = useState("deposit");
       const [amount, setAmount] = useState("");
       const [loading, setLoading] = useState(false);

       const handleSubmit = async () => {
              if (!amount || parseInt(amount) <= 0) {
                     toast.error("Please enter a valid token amount");
                     return;
              }

              setLoading(true);

              try {
                     const response = await dispatch(
                            manageUserTokens({
                                   userId,
                                   action,
                                   amount: parseInt(amount),
                            })
                     );

                     if (response.error) {
                            toast.error(response.error.message || "Failed to update tokens");
                     } else {
                            toast.success(response.payload.message || "Tokens updated successfully");
                            // Refresh users list
                            dispatch(fetchUsers());
                            onClose();
                     }
              } catch (err) {
                     toast.error(err.message || "Something went wrong");
              } finally {
                     setLoading(false);
                     setAmount("");
                     setAction("deposit");
              }
       };

       return (
              <Dialog open={isOpen} onOpenChange={onClose}>
                     <DialogContent className="bg-[rgba(31,33,51,0.9)] backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-[400px] p-6 font-display">
                            <DialogHeader>
                                   <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                                          Manage Tokens
                                   </DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-col gap-4 py-4">
                                   {/* Action select */}
                                   <div>
                                          <label className="block mb-1 text-sm font-medium text-gray-300">Action</label>
                                          <Select value={action} onValueChange={(val) => setAction(val)}>
                                                 <SelectTrigger>
                                                        <SelectValue placeholder="Select action" />
                                                 </SelectTrigger>
                                                 <SelectContent>
                                                        <SelectItem value="deposit">Deposit</SelectItem>
                                                        <SelectItem value="withdraw">Withdraw</SelectItem>
                                                 </SelectContent>
                                          </Select>
                                   </div>

                                   {/* Token Amount input */}
                                   <div>
                                          <label className="block mb-1 text-sm font-medium text-gray-300">Token Amount</label>
                                          <Input
                                                 type="number"
                                                 placeholder="Enter token amount"
                                                 value={amount}
                                                 onChange={(e) => setAmount(e.target.value)}
                                                 min="1"
                                          />
                                   </div>
                            </div>

                            <DialogFooter className="flex justify-end gap-2">
                                   <Button variant="outline" onClick={onClose} disabled={loading}>
                                          Cancel
                                   </Button>
                                   <Button onClick={handleSubmit} disabled={loading}>
                                          {loading ? "Processing..." : action === "deposit" ? "deposit" : "withdraw"}
                                   </Button>
                            </DialogFooter>
                     </DialogContent>
              </Dialog>
       );
};

export default UserManageTokens;

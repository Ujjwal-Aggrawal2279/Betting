// RequestTokenDialog.jsx
import { useState, useEffect } from "react";
import {
       Dialog,
       DialogContent,
       DialogHeader,
       DialogTitle,
       DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle } from "lucide-react";
import { clearRequestState, requestToken } from "../../../store/slices/tokenSlice";

const RequestTokenDialog = ({ open, setOpen }) => {
       const [tokenAmount, setTokenAmount] = useState("");
       const dispatch = useDispatch();
       const { requesting, requestError, requestSuccess } = useSelector((state) => state.tokens);

       const handleSubmit = () => {
              if (!tokenAmount) return;
              dispatch(requestToken(tokenAmount));
       };

       // Close dialog on success
       useEffect(() => {
              if (requestSuccess) {
                     setTokenAmount("");
                     setOpen(false);
                     dispatch(clearRequestState());
              }
       }, [requestSuccess, setOpen, dispatch]);

       return (
              <Dialog open={open} onOpenChange={setOpen}>
                     <DialogContent className="bg-[rgba(31,33,51,0.9)] backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-[400px] p-6">
                            <DialogHeader>
                                   <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                                          Request Tokens
                                   </DialogTitle>
                            </DialogHeader>

                            <div className="mt-4 space-y-4">
                                   {/* Token Amount */}
                                   <div>
                                          <label className="block text-sm font-medium text-gray-300 mb-1">
                                                 Token Amount
                                          </label>
                                          <Input
                                                 type="text"
                                                 placeholder="Enter amount"
                                                 value={tokenAmount}
                                                 onChange={(e) => setTokenAmount(e.target.value)}
                                                 className="bg-[rgba(39,43,66,0.8)] border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-lg"
                                          />
                                   </div>

                                   {/* Error Message */}
                                   {requestError && (
                                          <div className="flex items-center text-red-400 text-sm gap-2">
                                                 <AlertCircle size={16} />
                                                 {requestError}
                                          </div>
                                   )}
                            </div>

                            <DialogFooter className="mt-6 flex justify-end">
                                   <Button
                                          disabled={requesting || !tokenAmount}
                                          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                          onClick={handleSubmit}
                                   >
                                          {requesting ? "Requesting..." : "Submit"}
                                   </Button>
                            </DialogFooter>
                     </DialogContent>
              </Dialog>
       );
};

export default RequestTokenDialog;

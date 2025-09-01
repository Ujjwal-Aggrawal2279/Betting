import {
       Sheet,
       SheetContent,
       SheetHeader,
       SheetTitle,
       SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingLabelInput } from "../../../components/common/form/FloatingLabels";
import { useDispatch } from "react-redux";
import { createMatchOdds, fetchMatchOdds } from "../../../store/slices/matchSlice";
import { toast } from "sonner";

// Zod schema for validation
const oddsSchema = z.object({
       teama: z.object({
              back: z.coerce.number().min(0.01, "Back must be at least 0.01"),
              lay: z.coerce.number().min(0.01, "Lay must be at least 0.01"),
       }),
       teamb: z.object({
              back: z.coerce.number().min(0.01, "Back must be at least 0.01"),
              lay: z.coerce.number().min(0.01, "Lay must be at least 0.01"),
       }),
});

const OddsSheet = ({ open, onOpenChange, odds }) => {
       const dispatch = useDispatch();

       const methods = useForm({
              resolver: zodResolver(oddsSchema),
              defaultValues: odds || {
                     teama: { back: 0, lay: 0 },
                     teamb: { back: 0, lay: 0 },
              },
       });

       const {
              handleSubmit,
              formState: { isSubmitting },
              reset,
       } = methods;

       const onSubmit = async (data) => {
              const payload = {
                     matchId: odds.matchId,
                     type: odds.type,
                     source: odds.source || "APP",
                     odds: {
                            teama: { back: data.teama.back, lay: data.teama.lay },
                            teamb: { back: data.teamb.back, lay: data.teamb.lay },
                     },
              };

              try {
                     const response = await dispatch(createMatchOdds(payload));

                     if (response.meta.requestStatus === "fulfilled") {
                            toast.success(response.payload?.message || "Odds created successfully");
                            dispatch(fetchMatchOdds());
                     } else if (response.meta.requestStatus === "rejected") {
                            const msg = response.payload?.message || response.error?.message || "Failed to save odds";
                            toast.warning(msg);
                     }
              } catch (err) {
                     toast.error(err?.message || "Failed to save odds");
              } finally {
                     onOpenChange(false);
                     reset(data);
              }
       };

       if (!odds) return null;

       return (
              <Sheet open={open} onOpenChange={onOpenChange}>
                     <SheetContent
                            side="right"
                            className="w-full sm:max-w-md bg-[#1F2436] text-white border-l border-white/10 px-3 font-display"
                     >
                            <SheetHeader className="p-0 mt-5">
                                   <SheetTitle className="text-xl font-bold text-[#EC981A]">
                                          Edit Match Odds
                                   </SheetTitle>
                                   <SheetDescription className="text-white/70">
                                          Configure and adjust the odds for{" "}
                                          <span className="font-semibold text-white">{odds.matchName}</span>
                                   </SheetDescription>
                            </SheetHeader>

                            <FormProvider {...methods}>
                                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                                          {/* Team A Card */}
                                          <Card className="bg-[#141826] border border-white/10 rounded-xl shadow-md">
                                                 <CardContent className="p-5 space-y-4 text-white">
                                                        <h3 className="text-lg font-semibold text-green-400">🟢 Team A</h3>
                                                        <div className="space-y-3">
                                                               <FloatingLabelInput
                                                                      label="Back"
                                                                      fieldProps={{ control: methods.control, name: "teama.back" }}
                                                                      type="number"
                                                                      step="0.01"
                                                               />
                                                               <FloatingLabelInput
                                                                      label="Lay"
                                                                      fieldProps={{ control: methods.control, name: "teama.lay" }}
                                                                      type="number"
                                                                      step="0.01"
                                                               />
                                                        </div>
                                                 </CardContent>
                                          </Card>

                                          {/* Team B Card */}
                                          <Card className="bg-[#141826] border border-white/10 rounded-xl shadow-md">
                                                 <CardContent className="p-5 space-y-4 text-white">
                                                        <h3 className="text-lg font-semibold text-blue-400">🔵 Team B</h3>
                                                        <div className="space-y-3">
                                                               <FloatingLabelInput
                                                                      label="Back"
                                                                      fieldProps={{ control: methods.control, name: "teamb.back" }}
                                                                      type="number"
                                                                      step="0.01"
                                                               />
                                                               <FloatingLabelInput
                                                                      label="Lay"
                                                                      fieldProps={{ control: methods.control, name: "teamb.lay" }}
                                                                      type="number"
                                                                      step="0.01"
                                                               />
                                                        </div>
                                                 </CardContent>
                                          </Card>

                                          {/* Save Button */}
                                          <div>
                                                 <Button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="w-full bg-[#EC981A] hover:bg-[#d78510] text-black font-semibold px-6 py-2 rounded-lg shadow-md"
                                                 >
                                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                                 </Button>
                                          </div>
                                   </form>
                            </FormProvider>
                     </SheetContent>
              </Sheet>
       );
};

export default OddsSheet;

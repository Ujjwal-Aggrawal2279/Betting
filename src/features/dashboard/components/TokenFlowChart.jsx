import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// dummy data (30 days)
const data = Array.from({ length: 30 }, (_, i) => ({
       day: i + 1,
       requested: Math.floor(Math.random() * 20) + 10,
       approved: Math.floor(Math.random() * 15) + 5,
       pending: Math.floor(Math.random() * 5),
       rejected: Math.floor(Math.random() * 5),
}))

export default function TokensFlowChart() {
       return (
              <Card className="shadow-md bg-[#1E2130] border-none mx-4 rounded-sm font-display">
                     <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white">
                                   Tokens Flow (Current Month)
                            </CardTitle>
                     </CardHeader>
                     <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                   <LineChart data={data}>
                                          <CartesianGrid stroke="#2A2D3D" strokeDasharray="3 3" />
                                          <XAxis dataKey="day" stroke="#C8CBD9" />
                                          <YAxis stroke="#C8CBD9" />
                                          <Tooltip
                                                 contentStyle={{
                                                        backgroundColor: "#2A2D3D",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        color: "#fff",
                                                 }}
                                          />
                                          <Legend wrapperStyle={{ color: "#C8CBD9" }} />
                                          <Line type="monotone" dataKey="requested" stroke="#4F9DFF" strokeWidth={2} dot={false} />
                                          <Line type="monotone" dataKey="approved" stroke="#4ADE80" strokeWidth={2} dot={false} />
                                          <Line type="monotone" dataKey="pending" stroke="#FACC15" strokeWidth={2} dot={false} />
                                          <Line type="monotone" dataKey="rejected" stroke="#FB7185" strokeWidth={2} dot={false} />
                                   </LineChart>
                            </ResponsiveContainer>
                     </CardContent>
              </Card>
       )
}

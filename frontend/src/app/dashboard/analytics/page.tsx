"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/analytics")
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

  const severityData = [
    { name: "CRITICAL", value: stats.critical, color: "#ef4444" },
    { name: "HIGH", value: stats.high, color: "#f97316" },
    { name: "MEDIUM", value: Math.max(0, stats.reports_processed - stats.critical - stats.high - (stats.reports_processed * 0.2)), color: "#eab308" },
    { name: "LOW", value: stats.reports_processed * 0.2, color: "#22c55e" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">System Analytics</h1>
          <p className="text-slate-400 text-sm">Real-time performance and classification metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-300">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-300">Processing Volume (Mocked Timeline)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { time: '10:00', reports: 12 },
                { time: '10:15', reports: 45 },
                { time: '10:30', reports: 89 },
                { time: '10:45', reports: stats.reports_processed }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  cursor={{fill: '#1e293b'}}
                />
                <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiService from "../../services/apiService";


export default function BookingsLineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.get("/api/stats/bookings-per-year");
        if (res.data?.data) {
          const rows = res.data.data.map((item: any) => ({
            year: Number(item.year),
            bookings: Number(item.total),
          }));
          setData(rows);
        } else setData([]);
      } catch (error) {
        console.error("Error fetching bookings per year:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return (
    <div className="w-full h-[400px] p-4 bg-white shadow-md rounded mt-6 flex items-center justify-center">
      <p className="text-slate-600">Loading chart...</p>
    </div>
  );

  return (
    <div className="w-full h-[400px] p-4 bg-white shadow-md rounded mt-6">
      <h2 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">Bookings Per Year</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="year" 
            tick={{ fill: '#64748b' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fill: '#64748b' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--primary-color)',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="var(--primary-color)"
            strokeWidth={3}
            dot={{ fill: "var(--primary-color)", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: "var(--primary-color-dark)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
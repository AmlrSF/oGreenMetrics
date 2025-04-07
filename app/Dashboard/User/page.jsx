"use client"

import React, { useState, useEffect } from "react";
import { Line } from "recharts";
import { Truck, Factory, Lightbulb } from "lucide-react";

const TIME_RANGES = ["7 Days", "30 Days", "3 Months"];
const COLORS = ["#206bc4", "#4299e1", "#748ffc"];



const CompanyDash = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7 Days");
  const [emissionData, setEmissionData] = useState(null);
 
  useEffect(() => {
    const initializeData = async () => {
      const id = await fetchUser();
      if (id) {
        fetchCompanyData(id);
      }
    };
    initializeData();
  }, [timeRange]); // Re-run the fetch when time range changes

  const fetchUser = async () => {
    try {
      const userResponse = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });
      const userData = await userResponse.json();

      if (userData?.user) {
        const companyResponse = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userData.user._id}`,
          {
            method: "GET",
          }
        );
        const companyData = await companyResponse.json();
        
        return companyData?.data?._id;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const fetchCompanyData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/report/full/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data?.data);

      setEmissionData(data?.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Emissions Dashboard</h2>
        <p className="text-gray-600">Monitor your company's carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emissionData && (
          <>
            <EmissionCard
              title="Scope 1 Emissions"
              icon={Factory}
              value={10}
              color={COLORS[0]}
              data={emissionData.scope1.data}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
            <EmissionCard
              title="Scope 2 Emissions"
              icon={Lightbulb}
              value={10}
              color={COLORS[1]}
              data={emissionData.scope2.data}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
            <EmissionCard
              title="Scope 3 Emissions"
              icon={Truck}
              value={10}
              color={COLORS[2]}
              data={emissionData.scope3.data}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </>
        )}
      </div>
    </div>
  );
};


const EmissionCard = ({ title, icon: Icon, value, color, data, timeRange, onTimeRangeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <select
          className="border rounded-md px-2 py-1 text-sm"
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
        >
          {TIME_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      <div className="text-3xl font-bold mb-4">{value} tCO₂e</div>

      <div className="h-48">
        <Line
          data={data}
          width={500}
          height={200}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            fill={`${color}20`}
          />
        </Line>
      </div>
    </div>
  );
};


export default CompanyDash;
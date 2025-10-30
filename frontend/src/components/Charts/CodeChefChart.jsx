import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import processContestData from "../../utils/fetchFromDB/fetchCodeChef"; // Ensure correct import

// Function to remove brackets and text inside them
const cleanContestName = (name) => name.replace(/\s*\(.*?\)\s*/g, "").trim();

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 shadow-md rounded-md text-sm">
                <p className="font-semibold">{payload[0].payload.contestName}</p>
                <p>Date: {payload[0].payload.formattedDate}</p>
                <p>Rating: {payload[0].payload.rating}</p>
                <p>Problems Solved: {payload[0].payload.problemsSolved}</p>
            </div>
        );
    }
    return null;
};

const CodeChefContestChart = ({ username }) => {
    const [contestData, setContestData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await processContestData(username);
            if (data.length > 0) {
                // Convert "DD/MM/YYYY" to "YYYY-MM-DD" for correct sorting
                const parsedData = data.map(contest => {
                    const [day, month, year] = contest.date.split("/").map(Number);
                    const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    });

                    return {
                        ...contest,
                        contestName: cleanContestName(contest.contestName), // Clean contest name
                        dateObj: new Date(year, month - 1, day),
                        formattedDate, // Use this for X-axis
                    };
                });

                // Sort by dateObj in ascending order
                const sortedData = parsedData.sort((a, b) => a.dateObj - b.dateObj);
                console.log("Sorted Data:", sortedData);

                setContestData(sortedData);
            }
        };
        fetchData();
    }, [username]);

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg w-full">
            <h2 className="text-xl font-semibold text-center mb-4">CodeChef Contest Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={contestData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* X-Axis: Display contest date */}
                    <XAxis 
                        dataKey="formattedDate" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80} 
                        dy={10} 
                    />
                    
                    {/* Y-Axis: Rating */}
                    <YAxis 
                        label={{ value: "Rating", angle: -90, position: "insideLeft" }} 
                        domain={[
                            Math.min(...contestData.map(c => c.rating)) - 50, 
                            Math.max(...contestData.map(c => c.rating)) + 50
                        ]}
                    />
                    
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Line Chart for Rating */}
                    <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="#FF5733" 
                        strokeWidth={2} 
                        dot={{ r: 3 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CodeChefContestChart;

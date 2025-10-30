import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import fetchLeetCodeData from "../../utils/fetchFromDB/fetchLeetcode";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 shadow-md rounded-md text-sm">
                <p className="font-semibold">{payload[0].payload.contestName}</p>
                <p>Date: {payload[0].payload.formattedDate}</p>
                <p>Ranking: {payload[0].payload.ranking}</p>
                <p>Problems Solved: {payload[0].payload.problemsSolved}</p>
            </div>
        );
    }
    return null;
};

const LeetCodeContestChart = ({ username }) => {
    const [contestData, setContestData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchLeetCodeData(username);
            if (data && data.contests) {
                // Convert "DD/MM/YYYY" to "YYYY-MM-DD" for correct sorting
                const parsedData = data.contests.map(contest => {
                    const [day, month, year] = contest.contestDate.split("/").map(Number);
                    const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    });

                    return {
                        ...contest,
                        dateObj: new Date(year, month - 1, day), // Correct JS Date format
                        formattedDate, // Use this for X-axis
                        ranking: contest.rating, // Assuming rating represents ranking
                    };
                });

                // Sort by dateObj in ascending order
                const sortedData = parsedData.sort((a, b) => a.dateObj - b.dateObj);

                setContestData(sortedData);
            }
        };
        fetchData();
    }, [username]);

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg w-full">
            <h2 className="text-xl font-semibold text-center mb-4">LeetCode Contest Performance</h2>
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
                    
                    {/* Y-Axis: Set a proper range */}
                    <YAxis domain={[
                        Math.min(...contestData.map(c => c.ranking)) - 50, 
                        Math.max(...contestData.map(c => c.ranking)) + 50
                    ]} />
                    
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="ranking" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeetCodeContestChart;

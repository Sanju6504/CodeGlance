import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LeetCodeContestChart from "../components/Charts/leetcodeChart";
import CodeChefContestChart from "../components/Charts/CodeChefChart";

const CPReport = () => {
  const [name, setName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [platforms, setPlatforms] = useState({
    codechef: false,
    leetcode: false,
    codeforces: false,
  });
  const [usernames, setUsernames] = useState({
    codechef: "",
    leetcode: "",
    codeforces: "",
  });
  const [data, setData] = useState({
    codechef: null,
    leetcode: null,
    codeforces: null,
  });
  const [loading, setLoading] = useState(false);
  const [isformSub, setisformSub] = useState(false);

  // Use VITE_API_BASE_URL in production; fallback to localhost in dev
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // e.g., https://your-backend.onrender.com

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) => {
      let newSelection;

      if (platform === "All") {
        newSelection = prev.includes("All")
          ? []
          : ["All", "Codechef", "Leetcode", "Codeforces"];
      } else {
        newSelection = prev.includes(platform)
          ? prev.filter((p) => p !== platform)
          : [...prev.filter((p) => p !== "All"), platform];

        if (newSelection.length === 3) {
          newSelection = ["All"];
        }
      }

      setPlatforms({
        codechef:
          newSelection.includes("All") || newSelection.includes("Codechef"),
        leetcode:
          newSelection.includes("All") || newSelection.includes("Leetcode"),
        codeforces:
          newSelection.includes("All") || newSelection.includes("Codeforces"),
      });

      return newSelection;
    });
  };

  const handleInputChange = (e, platform) => {
    setUsernames((prev) => ({ ...prev, [platform]: e.target.value }));
  };

  const fetchCPData = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        platforms.codechef && usernames.codechef
          ? axios
              .get(`${API_BASE}/api/codechef/${usernames.codechef}`)
              .catch(() => null)
          : null,
        platforms.leetcode && usernames.leetcode
          ? axios
              .get(`${API_BASE}/api/leetcode/${usernames.leetcode}`)
              .catch(() => null)
          : null,
        platforms.codeforces && usernames.codeforces
          ? axios
              .get(
                `${API_BASE}/api/codeforces/${usernames.codeforces}`
              )
              .catch(() => null)
          : null,
      ]);

      const codechefData = responses[0]?.data
        ? Number(responses[0].data.problemsSolved)
        : null;

      // Fetch LeetCode total problems solved
      const leetcodeData =
        responses[1]?.data?.data?.matchedUser?.submitStatsGlobal
          ?.acSubmissionNum?.[0]?.count || null;

      const codeforcesData = responses[2]?.data
        ? Number(responses[2].data.problemsSolved)
        : null;

      setData({
        codechef: codechefData,
        leetcode: leetcodeData,
        codeforces: codeforcesData,
      });
      
      setisformSub(true);
      console.log(isformSub);

      toast.success("Data fetched successfully!");
    } catch (err) {
      toast.error("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const problemData = [];
  if (data.codechef !== null)
    problemData.push({
      platform: "CodeChef",
      problems: data.codechef,
    });
  if (data.leetcode !== null)
    problemData.push({
      platform: "LeetCode",
      problems: data.leetcode,
    });
  if (data.codeforces !== null)
    problemData.push({
      platform: "Codeforces",
      problems: data.codeforces,
    });

  return (
    <div className="w-full h-full bg-gray-50">
      <ToastContainer />
      <div className="mx-auto max-w-6xl p-6">
        {/* === FORM SECTION === */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-black mb-4">
            Competitive Programming Report
          </h2>

          <label className="mb-2 block text-sm font-medium text-gray-600">
            Your Name
          </label>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[50%] px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Platform Selection */}
          <div className="mt-4">
            <label className="mb-3 block text-sm font-medium text-gray-600">
              Select Platform
            </label>
            <div className="flex flex-wrap gap-2 ">
              {["All", "Codechef", "Codeforces", "Leetcode"].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformToggle(platform)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors hover:cursor-pointer ${
                    selectedPlatforms.includes(platform)
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Username Inputs */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            {platforms.codechef && (
              <div>
                <label className="font-semibold block mb-1">
                  CodeChef Username
                </label>
                <input
                  type="text"
                  placeholder="Enter CodeChef Username"
                  value={usernames.codechef}
                  onChange={(e) => handleInputChange(e, "codechef")}
                  className="w-[50%] px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            {platforms.leetcode && (
              <div>
                <label className="font-semibold block mb-1">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  placeholder="Enter LeetCode Username"
                  value={usernames.leetcode}
                  onChange={(e) => handleInputChange(e, "leetcode")}
                  className="w-[50%] px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            {platforms.codeforces && (
              <div>
                <label className="font-semibold block mb-1">
                  Codeforces Username
                </label>
                <input
                  type="text"
                  placeholder="Enter Codeforces Username"
                  value={usernames.codeforces}
                  onChange={(e) => handleInputChange(e, "codeforces")}
                  className="w-[50%] px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

          <button
            onClick={fetchCPData}
            className="w-[20%] mt-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white hover:cursor-pointer transition"
          >
            {loading ? "Fetching Data..." : "Generate Report"}
          </button>
        </div>
        {/* Visualization Section */}
        {problemData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <h2 className="text-2xl font-bold text-black mb-4">
              Problem Solving Statistics
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={problemData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="problems" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {platforms.leetcode && usernames.leetcode && isformSub && (
          <div className="bg-white w-full rounded-2xl shadow-sm p-6 mt-6">
            <LeetCodeContestChart username={usernames.leetcode} />
          </div>
        )}
        {platforms.codechef && usernames.codechef && isformSub && (
             <div className="bg-white w-full rounded-2xl shadow-sm p-6 mt-6">
             <CodeChefContestChart username={usernames.codechef} />
         </div>      
        )
          
        }


      </div>
        
    </div>
  );
};

export default CPReport;

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  fetchLeetcode,
  fetchCodechef,
  fetchCodeforces,
} from "../utils/filters/filterSR";
import BatchTable from "../components/Tables/DataTable";

const BatchReport = ({ batchData, isFetched }) => {
  const [rollNo, setRollNo] = useState("22501a1201");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["All"]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [isFormSub, setIsFormSub] = useState(false);
  const [rawData, setRawData] = useState([]);

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) => {
      if (platform === "All") return ["All"];
      const newSelection = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev.filter((p) => p !== "All"), platform];
      return newSelection.length === 3 ? ["All"] : newSelection;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rollNo) {
      toast.error("Roll number is required!");
      return;
    }

    try {
      let studentsData = batchData;
      setRawData(studentsData);

      // Case-insensitive match for alphanumeric roll numbers
      let student = studentsData.find(
        (student) => (student.rollno || "").toLowerCase() === rollNo.trim().toLowerCase()
      );

      if (!student) {
        toast.error("Student not found with this Roll Number!");
        setFilteredContests([]);
        setIsFormSub(true);
        return;
      }

      let fetchedData = {
        student,
        contests: {
          leetcode: fetchLeetcode(
            student.leetcode?.data?.userContestRankingHistory || []
          ),
          codechef: fetchCodechef(student.codechef.contests || []),
          codeforces: fetchCodeforces(
            student.codeforces?.attendedContests || []
          ),
        },
      };

      setFilteredContests([fetchedData]);

      const hasContests =
        fetchedData.contests.leetcode.length > 0 ||
        fetchedData.contests.codechef.length > 0 ||
        fetchedData.contests.codeforces.length > 0;

      if (!hasContests) {
        toast.success("No contests found for this student!");
      } else {
        toast.success("Report generated successfully!");
      }

      setIsFormSub(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-4xl bg-white p-6 shadow-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-800">Student Report</h1>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Roll Number
            </label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="rounded-md border p-2 text-sm w-[50%]"
              placeholder="Enter Roll Number"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Select Platform
            </label>
            <div className="flex flex-wrap gap-2">
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

          <div className="flex w-[40%]">
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 hover:cursor-pointer"
            >
              Get Report
            </button>
          </div>
        </div>
      </form>

      {isFormSub && (
        <BatchTable
          data={filteredContests}
          filter={
            selectedPlatforms.includes("All") || selectedPlatforms.length !== 1
              ? "all"
              : selectedPlatforms[0].toLowerCase()
          }
        />
      )}
    </div>
  );
};

export default BatchReport;

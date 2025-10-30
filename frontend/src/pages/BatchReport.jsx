import { useState } from "react";
import { toast } from "react-hot-toast";
// import { fetchFromDB } from "../utils/fetchFromDB/fetchDB";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  filterLeetcode,
  filterCodechef,
  filterCodeforces,
} from "../utils/filters/filterData";
import BatchTable from "../components/Tables/DataTable";

const BatchReport = ({ batchData, isFetched }) => {
  // const [selectedBatch, setSelectedBatch] = useState("22");
  const [fromRollNo, setFromRollNo] = useState("22501A1201");
  const [toRollNo, setToRollNo] = useState("22501A1266");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["All"]);

  const todayDate = new Date();
  const tenDaysAgoDate = new Date(todayDate);
  tenDaysAgoDate.setDate(todayDate.getDate() - 10);

  const todayFormatted = todayDate.toISOString().split("T")[0];
  const tenDaysAgoFormatted = tenDaysAgoDate.toISOString().split("T")[0];

  // Use a wide default range so historical contests appear
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(todayFormatted);

  const [filteredContests, setfilteredContests] = useState([]);
  const [isformSub, setisformSub] = useState(false);
  const [rawData, setRawData] = useState([]);

  const [isLeet, setisLeet] = useState(false);
  const [isChef, setisChef] = useState(false)
  const [isCode, setisCode] = useState(false)

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) => {
      if (platform === "All") {
        return ["All"];
      }

      if(platform === "Codechef") {
        setisChef(true);
      }

      if(platform === "Leetcode") {
        setisLeet(true);
      }
      
      if(platform == "Codeforces") {
        setisCode(true);
      }

      const newSelection = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev.filter((p) => p !== "All"), platform];

      return newSelection.length === 3 ? ["All"] : newSelection;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Date range is required!");
      return;
    }

    // If both roll numbers provided, validate lexicographically (case-insensitive)
    if (fromRollNo.trim() && toRollNo.trim()) {
      const f = fromRollNo.trim().toUpperCase();
      const t = toRollNo.trim().toUpperCase();
      if (f > t) {
        toast.error("Enter a valid Roll Number range!");
        return;
      }
    }

    try {
      let studentsData = batchData;

      console.log("Raw Students Data:", studentsData);
      setRawData(studentsData);

      // Normalize roll numbers for comparison
      const normalizedRolls = studentsData
        .map((s) => (s.rollno || "").trim().toUpperCase())
        .filter((r) => r.length > 0);

      // Determine dataset min/max (lexicographic) to cover entire batch
      const datasetMin = normalizedRolls.reduce((a, b) => (a < b ? a : b), normalizedRolls[0] || "");
      const datasetMax = normalizedRolls.reduce((a, b) => (a > b ? a : b), normalizedRolls[0] || "");

      // Use provided range if present; otherwise fall back to dataset min/max
      const from = ((fromRollNo || "").trim().length ? fromRollNo : datasetMin).toUpperCase();
      const to = ((toRollNo || "").trim().length ? toRollNo : datasetMax).toUpperCase();

      // If from > to (user typo), swap to avoid empty results
      const rangeFrom = from <= to ? from : to;
      const rangeTo = from <= to ? to : from;

      // Filter students within the computed range
      let students = studentsData.filter((student) => {
        const roll = (student.rollno || "").trim().toUpperCase();
        return roll >= rangeFrom && roll <= rangeTo;
      });


    //   let students = studentsData.filter((student) => {
    //     let roll = student.roll;
    //     let fromRollFormatted = fromRollNo.toUpperCase();
    //     let toRollFormatted = toRollNo.toUpperCase();
    //     return roll >= fromRollFormatted && roll <= toRollFormatted;
    // });

      console.log("Filtered Students:", students);
      console.log("Roll Number Range:", fromRollNo, "to", toRollNo);

      let filteredContests = await students.map(async (student) => {
        console.log("student: ", student);

        console.log("data", student.codechef?.newAllRating);
        return {
          student,
          contests: {
            leetcode: filterLeetcode(
              startDate,
              endDate,
              student.leetcode?.data?.userContestRankingHistory || []
            ),
            codechef: filterCodechef(
              startDate,
              endDate,
              student.codechef?.contests || []
            ),
            codeforces: filterCodeforces(
              startDate,
              endDate,
              student.codeforces?.contests || []
            ),
          },
        };
      });
      filteredContests = await Promise.all(filteredContests);

      console.log("Filtered Contests:", filteredContests);
      setfilteredContests(filteredContests);

      // Check if at least one contest exists
      const hasContests = filteredContests.some(
        (contest) =>
          contest.contests.leetcode.length > 0 ||
          contest.contests.codechef.length > 0 ||
          contest.contests.codeforces.length > 0
      );

      if (!hasContests) {
        toast.success("No contests found in the selected range!");
      } else {
        toast.success("Report generated successfully!");
      }
      setisformSub(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Something went wrong!");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="">
        <div className="mx-auto max-w-6xl bg-white p-6 shadow-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-800">
            Batch Report
          </h1>

          <div className="mb-8 rounded-lg ">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Date Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-md border p-2 text-sm"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-md border p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Select Batch
                </label>
                <select
                  // value={selectedBatch}
                  // onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full rounded-md border p-2 text-sm"
                >
                  <option value="22">22 Batch</option>
                  <option value="23">23 Batch</option>
                  <option value="24">24 Batch</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Roll Number Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={fromRollNo}
                  onChange={(e) => setFromRollNo(e.target.value)}
                  className="rounded-md border p-2 text-sm"
                />
                <span>-</span>
                <input
                  type="text"
                  value={toRollNo}
                  onChange={(e) => setToRollNo(e.target.value)}
                  className="rounded-md border p-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Select Platform
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Codechef", "Codeforces", "Leetcode"].map(
                  (platform) => (
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
                  )
                )}
              </div>
            </div>

            {/* ✅ Submit Button for Data Submission */}
            <div className="flex mt-6 w-[50%] gap-4">
              <button type="submit" className="w-1/2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 hover:cursor-pointer">Get Report</button>
              {/* {isformSub && (
                <button type="button" onClick={downloadExcel} className="w-1/2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Download Excel</button>
              )} */}
            </div>
          </div>
        </div>
      </form>
      {isformSub && (
        <BatchTable
          data={filteredContests}
          filter={
            selectedPlatforms.includes("All") || selectedPlatforms.length !== 1
              ? "all"
              : selectedPlatforms[0].toLowerCase()
          }
          isLeet={isLeet}
          isCode={isCode}
          isChef={isChef}
        />
      )}
    </div>
  );
};

export default BatchReport;

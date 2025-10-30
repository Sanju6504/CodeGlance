import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DataTable = ({ data, isStudentReport = false, filter = "all",  }) => {
  const [hasContests, setHasContests] = useState(false);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString?.split("-") || [];
    return day && month && year ? `${day}/${month}/${year}` : "-";
  };

  useEffect(() => {
    // Render table as long as there is student data
    setHasContests(Array.isArray(data) && data.length > 0);
  }, [data, filter]);
  

  const getPlatformColumns = (platform) => [
    "Contest Name",
    "Rank",
    "Problems Solved",
    "Date",
  ];

  return hasContests ? (
    <div className="max-h-[90vh] w-full overflow-auto border border-gray-300 rounded-lg shadow-sm mt-5">
      <table className="w-full border-collapse bg-white text-sm">
        <thead className="bg-gray-200 border border-gray-300 sticky top-0 z-20">
          <tr>
            {!isStudentReport && (
              <>
                <th
                  className="p-10 font-semibold border border-gray-300"
                  rowSpan="2"
                >
                  Roll.No
                </th>
                <th
                  className="p-20 font-semibold border border-gray-300"
                  rowSpan="2"
                >
                  Name
                </th>
              </>
            )}

            {(filter === "leetcode" || filter === "all") && (
              <th
                className="p-4 font-semibold border border-gray-300 text-center"
                colSpan="5"
              >
                Leetcode
              </th>
            )}
            {(filter === "codechef" || filter === "all") && (
              <th
                className="p-4 font-semibold border border-gray-300 text-center"
                colSpan="5"
              >
                Codechef
              </th>
            )}
            {(filter === "codeforces" || filter === "all") && (
              <th
                className="p-4 font-semibold border border-gray-300 text-center"
                colSpan="5"
              >
                Codeforces
              </th>
            )}
          </tr>
          <tr>
            {(filter === "leetcode" || filter === "all") &&
              getPlatformColumns("leetcode").map((header) =>
                header === "Contest Name" ? (
                  <th
                    key={header}
                    colSpan="2"
                    className="p-3 font-medium border border-gray-300"
                  >
                    {header}
                  </th>
                ) : (
                  <th
                    key={header}
                    className="p-3 font-medium border border-gray-300"
                  >
                    {header}
                  </th>
                )
              )}

            {(filter === "codechef" || filter === "all") &&
              getPlatformColumns("codechef").map((header) =>
                header === "Contest Name" ? (
                  <th
                    key={header}
                    colSpan="2"
                    className="p-3 font-medium border border-gray-300"
                  >
                    {header}
                  </th>
                ) : (
                  <th
                    key={header}
                    className="p-3 font-medium border border-gray-300"
                  >
                    {header}
                  </th>
                )
              )}

            {(filter === "codeforces" || filter === "all") &&
              getPlatformColumns("codeforces").map((header) =>
                header === "Contest Name" ? (
                  <th
                    key={header}
                    colSpan="2"
                    className="p-3 font-medium border border-gray-300"
                  >
                    {header}
                  </th>
                ) : (
                  <th
                    key={header}
                    className="p-3 font-medium border border-gray-300"
                  >
                    {header}
                  </th>
                )
              )}
          </tr>
        </thead>
        <tbody className="z-10">
          {data.map(({ student, contests }, studentIndex) => {
            const platformContests = {
              leetcode: contests.leetcode,
              codechef: contests.codechef,
              codeforces: contests.codeforces,
            };

            // Determine arrays included based on current filter
            const includedArrays =
              filter === "all"
                ? [platformContests.leetcode, platformContests.codechef, platformContests.codeforces]
                : [platformContests[filter]];

            // Render at least one row per student so users don't disappear when they have 0 contests
            const maxRows = Math.max(1, ...includedArrays.map((arr) => arr.length));

            return Array.from({ length: maxRows }).map((_, rowIndex) => (
              <tr
                key={`${student.rollno}-${rowIndex}`}
                className={studentIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {rowIndex === 0 && !isStudentReport && (
                  <>
                    <td
                      className="p-4 border text-center align-middle border-gray-300"
                      rowSpan={maxRows}
                    >
                      {student.rollno}
                    </td>
                    <td
                      className="p-4 border text-center align-middle border-gray-300"
                      rowSpan={maxRows}
                    >
                      {student.name}
                    </td>
                  </>
                )}

                {(filter === "leetcode" || filter === "all") && (
                  <>
                    <td colSpan="2" className="p-3 border border-gray-300">
                      {platformContests.leetcode[rowIndex]?.contest?.title || "-"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {platformContests.leetcode[rowIndex]?.ranking || "-"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {platformContests.leetcode[rowIndex]?.problemsSolved || "-"}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {platformContests.leetcode[rowIndex]?.contest?.startTime
                        ? new Date(
                            platformContests.leetcode[rowIndex].contest.startTime *
                              1000
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </>
                )}

                {(filter === "codechef" || filter === "all") && (
                  <>
                    <td colSpan="2" className="p-3 border border-gray-300">
                      {platformContests.codechef[rowIndex]?.name || "-"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {platformContests.codechef[rowIndex]?.rank || "-"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {platformContests.codechef[rowIndex]?.noOfProblems || "-"}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {platformContests.codechef[rowIndex]?.end_date
                        ? formatDate(
                            platformContests.codechef[rowIndex].end_date
                          ).split(" ")[1].split(":")[2]
                        : "-"}
                    </td>
                  </>
                )}

                {(filter === "codeforces" || filter === "all") && (
                  <>
                    <td colSpan="2" className="p-3 border border-gray-300">
                      {platformContests.codeforces[rowIndex]?.contestName || "-"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {platformContests.codeforces[rowIndex]?.rank || "-"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {platformContests.codeforces[rowIndex]?.problemsSolved || "-"}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {platformContests.codeforces[rowIndex]?.ratingUpdateTimeSeconds
                        ? new Date(
                            platformContests.codeforces[rowIndex]
                              .ratingUpdateTimeSeconds * 1000
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </>
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  ) : null;
};

export default DataTable;
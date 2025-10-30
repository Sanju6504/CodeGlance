import React, { useState } from "react";
import fetchData from "../utils/fetchFromDB/fetchingIndviual";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompareForm = () => {
  const [persons, setPersons] = useState({
    person1: {
      name: "",
      platforms: { codechef: true, leetcode: true, codeforces: true },
      usernames: { codechef: "", leetcode: "", codeforces: "" },
    },
    person2: {
      name: "",
      platforms: { codechef: true, leetcode: true, codeforces: true },
      usernames: { codechef: "", leetcode: "", codeforces: "" },
    },
  });

  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);

  const handlePlatformChange = (personKey, platform) => {
    setPersons((prev) => ({
      ...prev,
      [personKey]: {
        ...prev[personKey],
        platforms: {
          ...prev[personKey].platforms,
          [platform]: !prev[personKey].platforms[platform],
        },
      },
    }));
  };

  const handleUsernameChange = (personKey, platform, value) => {
    setPersons((prev) => ({
      ...prev,
      [personKey]: {
        ...prev[personKey],
        usernames: { ...prev[personKey].usernames, [platform]: value },
      },
    }));
  };

  const handleNameChange = (personKey, value) => {
    setPersons((prev) => ({
      ...prev,
      [personKey]: { ...prev[personKey], name: value },
    }));
  };

  const handleSubmit = async () => {
    let valid = true;

    // Validate usernames for selected platforms
    Object.entries(persons).forEach(([personKey, personData]) => {
      Object.entries(personData.platforms).forEach(([platform, isSelected]) => {
        if (isSelected && !personData.usernames[platform]) {
          toast.error(`${platform} username missing for ${personKey === "person1" ? "User 1" : "User 2"}`, { autoClose: 3000 });
          valid = false;
        }
      });
    });

    if (!valid) return;

    setLoading(true);
    try {
      const data = await fetchData(persons);
      setComparisonData(data);
      toast.success("Comparison data fetched successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Error fetching data. Please try again.", { autoClose: 3000 });
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Metrics where lower values are better
  const lowerIsBetterMetrics = new Set(["topPercentage", "GlobalRank", "countryRank"]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer />
      <div className="bg-gray-100 p-6 shadow-sm max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Compare</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {["person1", "person2"].map((personKey) => (
            <div key={personKey} className="flex-1 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{personKey === "person1" ? "User 1" : "User 2"}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={persons[personKey].name}
                    onChange={(e) => handleNameChange(personKey, e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Platforms</label>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(persons[personKey].platforms).map(([platform, checked]) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handlePlatformChange(personKey, platform)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {["codechef", "leetcode", "codeforces"].map(
                  (platform) =>
                    persons[personKey].platforms[platform] && (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {platform} Username
                        </label>
                        <input
                          type="text"
                          value={persons[personKey].usernames[platform]}
                          onChange={(e) => handleUsernameChange(personKey, platform, e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-8 hover:cursor-pointer rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "Compare"}
          </button>
        </div>

        {comparisonData && (
          <div className="mt-8 p-6 bg-white rounded-lg">
            <h2 className="text-xl font-bold mb-4">Comparison Results</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Metric</th>
                  <th className="p-2 border">{persons.person1.name || "Person 1"}</th>
                  <th className="p-2 border">{persons.person2.name || "Person 2"}</th>
                </tr>
              </thead>
              <tbody>
                {["leetcode", "codechef", "codeforces"].map((platform) =>
                  comparisonData.person1[platform] || comparisonData.person2[platform] ? (
                    <React.Fragment key={platform}>
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan="3" className="p-2 border text-center">{platform.toUpperCase()}</td>
                      </tr>
                      {Object.keys(comparisonData.person1[platform] || {}).map((metric) => {
                        const value1 = comparisonData.person1[platform]?.[metric] ?? 0;
                        const value2 = comparisonData.person2[platform]?.[metric] ?? 0;

                        const person1Wins = lowerIsBetterMetrics.has(metric) ? value1 < value2 : value1 > value2;
                        const person2Wins = lowerIsBetterMetrics.has(metric) ? value2 < value1 : value2 > value1;

                        return (
                          <tr key={`${platform}-${metric}`} className="border">
                            <td className="p-2 border capitalize">{metric.replace(/([A-Z])/g, " $1")}</td>
                            <td className="p-2 border">{value1}{person1Wins ? " 🏅" : ""}</td>
                            <td className="p-2 border">{value2}{person2Wins ? " 🏅" : ""}</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareForm;

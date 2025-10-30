const fs = require("fs");
const path = require("path");

// fetching leetcode data

async function fetchLeetCodeContestsData(username) {
  const url = "https://leetcode.com/graphql";
  const query = `
        query getUserContestRanking ($username: String!) {
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
                totalParticipants
                topPercentage
                badge {
                    name
                }
            }
            userContestRankingHistory(username: $username) {
                attended
                rating
                ranking
                trendDirection
                problemsSolved
                totalProblems
                finishTimeInSeconds
                contest {
                    title
                    startTime
                }
            }
                            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                problemsSolvedBeatsStats {
                    difficulty
                    percentage
                }
                submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
    `;
  const variables = { username };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json",
        Referer: "https://leetcode.com/",
        Origin: "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.errors) {
      return {
        username: username,
        error: `${username} does not exist`,
      };
    }
    if (data.data.userContestRanking === null) {
      return {
        username: username,
        error: `${username} did not participate in any contest`,
      };
    }
    if (data.data && data.data.userContestRankingHistory) {
      data.data.userContestRankingHistory =
        data.data.userContestRankingHistory.filter(
          (contest) => contest.attended
        );
      data.data.userContestRankingHistory.reverse();
    }
    return { username, data: data.data };
  } catch (error) {
    console.error(`Failed to fetch data for ${username}:`, error);
    return { username, error: error.message };
  }
}

// fetching codeforces data

const fetchCodeforcesData = async (username) => {
  try {
    const url = `https://codeforces.com/api/user.status?handle=${username}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    let data = await response.json();
    console.log("Codeforces Submissions Data:", data);

    if (data.status !== "OK") {
      return { username, message: "User not found or invalid handle" };
    }

    // Filter only successful submissions
    const successfulSubmissions = data.result.filter(
      (submission) => submission.verdict === "OK"
    );

    return {
      username,
      submissions: successfulSubmissions,
    };
  } catch (error) {
    console.error("Error fetching Codeforces submissions:", error.message);
    return { username, error: error.message };
  }
};

const fetchCodeforcesContest = async (username) => {
  try {
    const url = `https://codeforces.com/api/user.rating?handle=${username}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    let data = await response.json();
    console.log("Codeforces Contest Data:", data);

    if (data.status !== "OK") {
      return { username, message: "User not found or invalid handle" };
    }

    // Reverse for chronological order
    const contestData = data.result.reverse();

    return {
      username,
      contests: contestData,
    };
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error.message);
    return { username, error: error.message };
  }
};

const { scrapeCodeChef } = require("./scrapeCodeChef");

const fetchAllUsersData = async () => {
  // Read users fresh each call to avoid stale data and ensure correct path resolution
  const usersFile = path.join(__dirname, "../Data/testusers.json");
  const USERS = JSON.parse(fs.readFileSync(usersFile, "utf8"));

  return Promise.all(
    USERS.map(async (user) => {
      const [codechefData, leetcodeData, codeforcesData] = await Promise.all([
        scrapeCodeChef(user.codechef),
        fetchLeetCodeContestsData(user.leetcode),
        fetchCodeforcesData(user.codeforces),
      ]);

      return {
        rollno: user.rollno,
        name: user.name,
        leetcode: leetcodeData,
        codeforces: codeforcesData,
        codechef: codechefData,
      };
    })
  );
};

module.exports = {
  fetchLeetCodeContestsData,
  fetchCodeforcesData,
  fetchCodeforcesContest,
  fetchAllUsersData,
};

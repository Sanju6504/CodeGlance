const fetchLeetCodeData = async (username) => {
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/leetcode/${username}`);
        const leetcodeData = await response.json();

        if (!leetcodeData || !leetcodeData.data) {
            console.error("LeetCode data not found");
            return null;
        }

        const userInfo = leetcodeData.data.matchedUser;
        const contestHistory = leetcodeData.data.userContestRankingHistory || [];

        // Get total problems solved globally
        const totalProblemsSolved = userInfo?.submitStatsGlobal?.acSubmissionNum[0]?.count || 0;

        // Prepare contest data for graph plotting
        const contests = contestHistory.map((contest) => {
            return {
                contestName: contest.contest.title,
                rating: contest.rating,
                ranking: contest.ranking,
                problemsSolved: contest.problemsSolved,
                contestDate: new Date(contest.contest.startTime * 1000).toLocaleDateString(), // Converts epoch to readable date
            };
        });

        console.log("contets: ", contests);

        return {
            username: userInfo?.username || username,
            totalProblemsSolved,
            contests
        };

    } catch (error) {
        console.error("Error fetching LeetCode data:", error);
        return null;
    }
};

// Example Usage
// (async () => {
//     const data = await fetchLeetCodeData("your_leetcode_username");
//     console.log(data);
// })();

export default fetchLeetCodeData;

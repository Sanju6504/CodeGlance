const getUserStats = (submissions) => {
    if (!submissions || submissions.length === 0) {
        return {
            contestParticipated: 0,
            contestProblems: 0
        };
    }

    const contestIds = new Set();
    const solvedProblems = new Set();

    submissions.forEach((submission) => {
        if (submission.verdict === "OK") {
            solvedProblems.add(submission.problem.name);
            if (submission.contestId) {
                contestIds.add(submission.contestId);
            }
        }
    });

    return {
        contestParticipated: contestIds.size,
        contestProblems: solvedProblems.size
    };
};




const fetchData = async (persons) => {
    const { person1, person2 } = persons;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const fetchAndProcess = async (platform, url, isCodeforces = false) => {
        try {
            let response = await fetch(url);
            let data = await response.json();

            if (isCodeforces) {
                return getUserStats(data.result);
            }
            return data;
        } catch (error) {
            console.error(`Error fetching data from ${platform}:`, error);
            return null;
        }
    };

    let person1Data = {};
    let person2Data = {};

    // Fetch Data for Person 1
    if (person1.platforms.leetcode) {
        let leetcodeData = await fetchAndProcess("LeetCode", `${baseUrl}/api/leetcode/${person1.usernames.leetcode}`);
        if (leetcodeData) {
            person1Data.leetcode = {
                noOfProblemsSolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[0]?.count || 0,
                contestParticipated: leetcodeData?.data?.userContestRanking?.attendedContestsCount || 0,
                rating: leetcodeData?.data?.userContestRanking?.rating || 0,
                topPercentage: leetcodeData?.data?.userContestRanking?.topPercentage || 0,
                easySolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[1]?.count || 0, 
                medSolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[2]?.count || 0, 
                hardSolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[3]?.count || 0, 
            };
        }
    }

    if (person1.platforms.codechef) {
        let codechefData = await fetchAndProcess("CodeChef", `https://codechef-api.vercel.app/handle/${person1.usernames.codechef}`);
        let codechefContestData = await fetchAndProcess("CodeChef", `${baseUrl}/api/codechef/${person1.usernames.codechef}`);
        if (codechefData) {
            person1Data.codechef = {
                currRating: codechefData?.currentRating || 0,
                highRating: codechefData?.highestRating || 0,
                GlobalRank: codechefData?.globalRank || 0,
                countryRank: codechefData?.countryRank || 0,
                star: codechefData?.stars || 0,
                problemsSolved: codechefContestData?.problemsSolved || 0,
                contestParticipated: codechefContestData?.contests?.length || 0
            };
        }
    }

    if (person1.platforms.codeforces) {
        let codeforcesData = await fetchAndProcess("Codeforces", `https://codeforces.com/api/user.status?handle=${person1.usernames.codeforces}`, true);
        let codeforcesRating = await fetchAndProcess("Codeforces", `https://codeforces.com/api/user.info?handles=${person1.usernames.codeforces}`);
        if (codeforcesData && codeforcesRating) {
            person1Data.codeforces = {
                contestParticipated: codeforcesData?.contestParticipated || 0,
                contestProblems: codeforcesData?.contestProblems || 0,
                rating: codeforcesRating?.result?.[0]?.rating || 0,
                maxRating: codeforcesRating?.result?.[0]?.maxRating || 0
            };
        }
    }

    // Fetch Data for Person 2
    if (person2.platforms.leetcode) {
        let leetcodeData = await fetchAndProcess("LeetCode", `${baseUrl}/api/leetcode/${person2.usernames.leetcode}`);
        if (leetcodeData) {
            person2Data.leetcode = {
                noOfProblemsSolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[0]?.count || 0,
                contestParticipated: leetcodeData?.data?.userContestRanking?.attendedContestsCount || 0,
                rating: leetcodeData?.data?.userContestRanking?.rating || 0,
                topPercentage: leetcodeData?.data?.userContestRanking?.topPercentage || 0,
                easySolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[1]?.count || 0, 
                medSolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[2]?.count || 0, 
                hardSolved: leetcodeData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum[3]?.count || 0, 
            };
        }
    }

    if (person2.platforms.codechef) {
        let codechefData = await fetchAndProcess("CodeChef", `https://codechef-api.vercel.app/handle/${person2.usernames.codechef}`);
        let codechefContestData = await fetchAndProcess("CodeChef", `${baseUrl}/api/codechef/${person2.usernames.codechef}`);
        if (codechefData) {
            person2Data.codechef = {
                currRating: codechefData?.currentRating || 0,
                highRating: codechefData?.highestRating || 0,
                GlobalRank: codechefData?.globalRank || 0,
                countryRank: codechefData?.countryRank || 0,
                star: codechefData?.stars || 0,
                problemsSolved: codechefContestData?.problemsSolved || 0,
                contestParticipated: codechefContestData?.contests?.length || 0
            };
        }
    }

    if (person2.platforms.codeforces) {
        let codeforcesData = await fetchAndProcess("Codeforces", `https://codeforces.com/api/user.status?handle=${person2.usernames.codeforces}`, true);
        let codeforcesRating = await fetchAndProcess("Codeforces", `https://codeforces.com/api/user.info?handles=${person2.usernames.codeforces}`);
        if (codeforcesData && codeforcesRating) {
            person2Data.codeforces = {
                contestParticipated: codeforcesData?.contestParticipated || 0,
                contestProblems: codeforcesData?.contestProblems || 0,
                rating: codeforcesRating?.result?.[0]?.rating || 0,
                maxRating: codeforcesRating?.result?.[0]?.maxRating || 0
            };
        }
    }

    console.log("Person 1 Data:", person1Data);
    console.log("Person 2 Data:", person2Data);

    // Return the collected data
    return { person1: person1Data, person2: person2Data };
};

export default fetchData;

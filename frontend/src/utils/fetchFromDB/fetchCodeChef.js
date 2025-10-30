const processContestData = async (username) => {
    if (!username) {
        return [];
    }

    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/codechef/${username}`);
        const apiResponse = await response.json(); // Convert response to JSON

        if (!apiResponse || !apiResponse.contests) {
            return [];
        }

        console.log(apiResponse);
        return apiResponse.contests.map(contest => ({
            contestName: contest.name,
            contestCode: contest.code,
            date: `${contest.getday}/${contest.getmonth}/${contest.getyear}`, // Format as DD/MM/YYYY
            rank: parseInt(contest.rank, 10), // Convert rank to number
            rating: parseInt(contest.rating, 10), // Convert rating to number
            problemsSolved: contest.noOfProblems, // Store number of problems solved
        }));
    } catch (error) {
        console.error("Error fetching contest data:", error);
        return [];
    }
};

export default processContestData


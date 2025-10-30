const axios = require('axios');
const cheerio = require('cheerio');


const scrapeCodeChef = async (username) => {
    try {
        const res = await axios.get(`https://www.codechef.com/users/${username}`);
        // console.log(res.data);
        const text = res.data;
        const $ = cheerio.load(text);

        // Extracting Rating Data
        const ratingRegex = /var all_rating = (\[.*?\]);/;
        const ratingMatch = text.match(ratingRegex);
        let ratingData = [];

        if (ratingMatch) {
            try {
                ratingData = JSON.parse(ratingMatch[1]);
            } catch (error) {
                console.log('Error parsing rating data:', error);
            }
        }

        // If user is not found
        if (!ratingMatch) {
            return {
                username: username,
                contests: [],
                problemsSolved: null,
                message: 'Username does not exist'
            };
        }

        console.log('Rating Data:', ratingData);

        // Extracting Contest Problems
        const contentData = [];
        $('div.content').each((index, element) => {
            const name = $(element).find('h5 > span').text();
            const problems = [];

            $(element).find('p > span > span').each((i, el) => {
                problems.push($(el).text());
            });

            if (name) {
                contentData.push({
                    name: name,
                    problems: problems,
                    noOfProblems: problems.length
                });
            }
        });

        // Extract Problems Solved Count
        const problemsSolvedText = $('section.rating-data-section.problems-solved > h3').text().trim();
        const match = problemsSolvedText.match(/Total Problems Solved:\s*(\d+)/);
        const problemsSolved = match ? match[1] : "0";


        // Merge Contest Data with Rating Data
        let fullContestData = ratingData.map(contest => {
            let contestDetails = contentData.find(data => data.name === contest.name);
            return {
                ...contest,
                problems: contestDetails ? contestDetails.problems : [],
                noOfProblems: contestDetails ? contestDetails.noOfProblems : 0
            };
        });

        fullContestData.reverse(); // Reverse for chronological order
        console.log('Full Contest Data:', fullContestData);

        return {
            username: username,
            contests: fullContestData,
            problemsSolved: problemsSolved
        };
    } catch (err) {
        console.error('Error fetching CodeChef data:', err.message);
        return {
            username: username,
            contests: [],
            problemsSolved: null,
            message: 'Error fetching data'
        };
    }
};


module.exports = { scrapeCodeChef };

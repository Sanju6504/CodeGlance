function fetchLeetcode(contestsData) {
    console.log('Leetcode contestsData: ', contestsData);
    if (contestsData === undefined) {
        return [];
    }
    return contestsData;
}

function fetchCodechef(contestsData) {
    console.log('Codechef contestsData: ', contestsData);
    if (!contestsData) return [];
    return contestsData;
}

function fetchCodeforces(contestsData) {
    console.log('Codeforces contestsData: ', contestsData);
    if (!contestsData) return [];
    return contestsData;
}

export { fetchLeetcode, fetchCodechef, fetchCodeforces };

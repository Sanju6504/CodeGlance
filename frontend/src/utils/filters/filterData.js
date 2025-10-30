function filterLeetcode(fromDate, toDate, contestsData) {
    const list = Array.isArray(contestsData) ? contestsData : [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    // Make end date inclusive by setting to end of day
    endDate.setHours(23, 59, 59, 999);
    return list.filter((contest) => {
        if (!contest?.contest?.startTime) return false;
        const date = new Date(contest.contest.startTime * 1000);
        return date >= startDate && date <= endDate;
    });
}

function filterCodechef(fromDate, toDate, contestsData) {
    const list = Array.isArray(contestsData) ? contestsData : [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);
    return list.filter((contest) => {
        if (!contest || contest.end_date == null) return false;
        // CodeChef end_date often like "YYYY-MM-DD HH:MM:SS"
        const isoPart = String(contest.end_date).split(" ")[0];
        const date = new Date(isoPart);
        return date >= startDate && date <= endDate;
    });
}

function filterCodeforces(fromDate, toDate, contestsData) {
    const list = Array.isArray(contestsData) ? contestsData : [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);
    return list.filter((contest) => {
        if (!contest?.ratingUpdateTimeSeconds) return false;
        const date = new Date(contest.ratingUpdateTimeSeconds * 1000);
        return date >= startDate && date <= endDate;
    });
}

export { filterLeetcode, filterCodechef, filterCodeforces };
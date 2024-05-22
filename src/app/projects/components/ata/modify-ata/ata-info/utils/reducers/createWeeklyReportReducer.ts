const createWeeklyReportReducer = {

    createWeeklyReportStructure: function (weeklyReports) {
        const data = {};

        for (let weeklyReport of weeklyReports) {
            if (weeklyReport.parent == 0) {
                data[weeklyReport.id] = {
                    parent: weeklyReport,
                    children: [],
                    activeChildIndex: -1,
                    isMax: true,
                    isMin: false
                };
            } else if (weeklyReport.parent != 0 && data[weeklyReport.parent]) {
                data[weeklyReport.parent].children.push(weeklyReport);
                const children = data[weeklyReport.parent].children;
                const activeIndex = children.length - 1;
                data[weeklyReport.parent] = {
                    ...data[weeklyReport.parent],
                    isMax: children[activeIndex + 1] === undefined,
                    isMin: children[activeIndex - 1] === undefined
                }
                if (data[weeklyReport.parent].children.length == 1) {

                }
            }
        }

        const reportKeys = Object.keys(data);

        let reportsData = {
            activeReport: 0,
            activeReportIndex: -1,
            keys: reportKeys,
            data: data,
            isMax: true,
            isMin: true
        };
        return reportsData;
    }
};

export default createWeeklyReportReducer;
const activeReportReducer = {
    
    resolveParentActiveIndexBoundaries: function (value, reportsData, max) {
        const index = reportsData.activeReportIndex;
    
        if ((index === 0 && value === -1) || (index === max && value === +1)) return index;
        return index + value;
    },

    getActiveReportId: function (newIndex, reportsData) {
        return reportsData.keys[newIndex];
    },

    setActiveReport: function (reportId, index, reportsData) {

        const keys = reportsData.keys;
        const isMax = keys[index + 1] === undefined;
        const isMin = keys[index - 1] === undefined;
        const { isChildMax, isChildMin, activeChildIndex } = this.setMinMax(reportsData, reportId);

        return { 
            ...reportsData, 
            data: {
                ...reportsData.data,
                [reportId]: {
                    ...reportsData.data[reportId],
                    activeChildIndex: activeChildIndex,
                    isMax: isChildMax,
                    isMin: isChildMin
                } 
            },
            activeReport: reportId, 
            activeReportIndex: index,
            isMax: isMax,
            isMin: isMin
        };
    },

    setActiveReportByValue: function (value, reportsData) {

        const keys = reportsData.keys;
        const max = keys.length - 1;
        const newIndex = this.resolveParentActiveIndexBoundaries(value, reportsData, max);
        const newReportId = this.getActiveReportId(newIndex, reportsData);
        const {  isChildMax, isChildMin, activeChildIndex } = this.setMinMax(reportsData, newReportId);

        return {  
            ...reportsData, 
            data: { 
            ...reportsData.data,
            [newReportId]: {
                ...reportsData.data[newReportId],
                activeChildIndex: activeChildIndex,
                isMin: isChildMin,
                isMax: isChildMax
            }
            },
            activeReportIndex:  newIndex,
            activeReport: newReportId,
            isMin: keys[newIndex - 1] === undefined,
            isMax: keys[newIndex + 1] === undefined
        };
    },

    setMinMax: function (reportsData, reportId) {

        const children =  reportsData.data[reportId].children;
        const childLength = children.length;
        const activeChildIndex = childLength - 1;
        const isChildMax = children[activeChildIndex + 1] === undefined;
        const isChildMin = children[activeChildIndex - 1] === undefined;

        return { isChildMax, isChildMin, activeChildIndex }
    }

};

export default activeReportReducer;
const activeChildKsReducer = {

    resolveChildActiveIndexBoundaries: function (value, reportsData, max) {
        const index = reportsData.data[reportsData.activeReport].activeChildIndex;
        if ((index === 0 && value === -1) || (index > max && value === +1)) return index;
        return index + value;
    },

    setActiveChildKsReport: function (value, reportsData) {

        const children = reportsData.data[reportsData.activeReport].children;
        const max = children.length - 1;
        const newIndex = this.resolveChildActiveIndexBoundaries(value, reportsData, max);
        return { 
            ...reportsData, 
            data: {
            ...reportsData.data,
            [reportsData.activeReport]: {
                ...reportsData.data[reportsData.activeReport],
                activeChildIndex: newIndex,
                isMin: children[newIndex - 1] === undefined, 
                isMax: children[newIndex + 1] === undefined
            }
            },
        };
    },
};

export default activeChildKsReducer;
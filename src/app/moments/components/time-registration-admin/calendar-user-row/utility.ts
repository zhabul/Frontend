export const addEmptyLockedMoment = (date) => {
  return {
    Id: "804",
    time: "00:00",
    time_qty: "0",
    time_qty_hours: "",
    Date: date,
    ProjectID: null,
    ProjectName: "",
    mileage: null,
    mileageType: null,
    AtestStatus: 0,
    Type: "userRaportStatus",
    raportedDayHaveMomentsAndLocked: true,
    attested_by_full_name: null,
    visible: true,
    needAtest: "",
  };
};

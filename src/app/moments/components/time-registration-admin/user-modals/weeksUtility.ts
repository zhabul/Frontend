export const findConnectedWeeks = ({ absences, days, user, index }) => {
  const todayAbsence = absences[0];
  const daysToOpen = [];
  let today = index;
  let flag = true;

  while (flag) {
    const tomorrow = days[today + 1];

    if (!tomorrow) {
      flag = false;
      break;
    }

    if (!todayAbsence) {
      flag = false;
      break;
    }

    const dayName = tomorrow.dayName;

    if (dayName === "Sat") {
      today = today + 2;
      continue;
    }

    const date = tomorrow.date;
    const tomAbsence = user.absences[date];

    if (!tomAbsence || (tomAbsence && tomAbsence.length === 0)) {
      flag = false;
      break;
    }

    if (tomAbsence.length === 0) {
      flag = false;
      break;
    }

    if (tomAbsence[0].AbsenceType !== todayAbsence.AbsenceType) {
      flag = false;
      break;
    }

    if (tomAbsence[0].AbsenceType === todayAbsence.AbsenceType) {
      if (dayName === "Mon") {
        daysToOpen.push(tomorrow);
      }
      today = today + 1;
      continue;
    }
  }

  return daysToOpen;
};

export const findConnectedWeeksReverse = ({ absences, days, user, index }) => {
  const todayAbsence = absences[0];
  const daysToOpen = [];
  let today = index;
  let flag = true;

  while (flag) {
    const yesterday = days[today - 1];

    if (!yesterday) {
      flag = false;
      break;
    }

    if (!todayAbsence) {
      flag = false;
      break;
    }

    const dayName = yesterday.dayName;

    if (dayName === "Sun") {
      today = today - 2;
      continue;
    }

    const date = yesterday.date;
    const tomAbsence = user.absences[date];

    if (!tomAbsence || (tomAbsence && tomAbsence.length === 0)) {
      flag = false;
      break;
    }

    if (tomAbsence.length === 0) {
      flag = false;
      break;
    }

    if (tomAbsence[0].AbsenceType !== todayAbsence.AbsenceType) {
      flag = false;
      break;
    }

    if (tomAbsence[0].AbsenceType === todayAbsence.AbsenceType) {
      if (dayName === "Fri") {
        daysToOpen.push(yesterday);
      }
      today = today - 1;
      continue;
    }
  }

  return daysToOpen;
};

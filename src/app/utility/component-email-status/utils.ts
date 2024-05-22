


export const resolveEmailLogStatus = (emailLog, table = false) => {

  let color = '';
  let statusText = '';

  if (!emailLog) {
    color = table ? '#F7F3D1' :'#fff335';
    statusText = 'Draft';
    return {
      color: color,
      statusText: statusText,
      date: ''
    };
  }

  const status = emailLog.Status;
  if (status == 1) {
    color = table ? '#DEFBFF' : '#82A7E2';
    statusText = 'Sent';
  } else if (status == 2) {
    color = table ? '#E3E9DD' : '#03d156';
    statusText = 'Accepted';
  } else if (status == 3) {
    color = table ? '#fae4ec' : 'rgb(253, 68, 68)';
    statusText = 'Declined';
  } else if (status == 6) {
    color = table ? '#F7F3D1' :'#F0E264';
    statusText = 'Question';
  } else if (status == 5) {
    color = '#b8b8b8';
    statusText = 'Aborted';
  } else if(status == 7) {
    color = '#b8b8b8';
    statusText = 'Canceled';
  }

  return {
      color: color,
      statusText: statusText,
      date: emailLog.date,
      status: status
  };
};

export const setEmailStatus = (emailLogs, table = false) => {
  // if (emailLogs && emailLogs.length > 0) {
  //   emailLogs = emailLogs.filter(log=>log.Status != 7);
  // }
  const emailLog = emailLogs ? emailLogs[0] : emailLogs;
  return resolveEmailLogStatus(emailLog, table);
}

const dayLastWeek = (days = -7) => {
  const dayOfLastWeek = new Date();
  dayOfLastWeek.setDate(dayOfLastWeek.getDate() + days);
  return dayOfLastWeek;
};

const lastTddate = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  if (dayOfWeek === 0) {
    return dayLastWeek(-2);
  } else {
    return dayLastWeek(-1);
  }
};

const formatDate = (date: Date, splitChar: any = '') => {
  let month: any = date.getMonth() + 1;
  let day: any = date.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${date.getFullYear()}${splitChar || ''}${month}${splitChar || ''}${day}`;
};

function jsonpToJson (jsonpData: string) {
  let jsonData = null;
  if (typeof jsonpData === 'string') {            
    const reg = /^\w+\((\{[^()]+\})\)$/;
    const matches = jsonpData.match(reg);
    console.log('matches', matches);
    
    if (matches) {
      jsonData = JSON.parse(matches[1]);
    }
  }
  return jsonData;
}

export default {
  lastTddate,
  formatDate,
  jsonpToJson
};

import axios from "axios";

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type SubDetails = {
  subid: number;
  milkids: number[];
  sub_start: Date;
  sub_end: Date;
  days: Day[];
  pause_date: Date | null;
  resume_date: Date | null;
  delivered: Date[];
  not_delivered: Date[];
  active: boolean;
  houseid: number;
};

type MilkDetails = {
  milkid: number;
  company: string;
  type: string;
  qty_kg: number;
  price: number;
};

const urls = {
  iitgn: "http://10.7.17.177:8000",
  home: "http://192.168.1.10:8000",
  local: "http://127.0.0.1:8000",
};

export const images = {
  amul_full_cream:
    "data:image/jpeg;base64,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",
};

export const milk_types = {
  FULL_CREAM: "Full Cream",
};

// export const url = urls.iitgn;
// export const url = urls.home;
export const url = urls.local;

export const days = new Map<
  Day,
  { full: string; short: string; avatar: string }
>([
  [0, { full: "Sunday", short: "Sun", avatar: "S" }],
  [1, { full: "Monday", short: "Mon", avatar: "M" }],
  [2, { full: "Tuesday", short: "Tue", avatar: "T" }],
  [3, { full: "Wednesday", short: "Wed", avatar: "W" }],
  [4, { full: "Thursday", short: "Thu", avatar: "Th" }],
  [5, { full: "Friday", short: "Fri", avatar: "F" }],
  [6, { full: "Saturday", short: "Sat", avatar: "S" }],
]);

export const prettyDate = (date: Date): string => {
  const dateString: string = date.toDateString();
  return `
    ${dateString.slice(8, 10)} ${dateString.slice(4, 7)}, ${dateString.slice(
    11
  )} (${dateString.slice(0, 3)})`;
};

export const dateToQueryString = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const subIsPaused = (sub: SubDetails): boolean => {
  if (sub.pause_date && sub.resume_date) {
    const datetime = new Date();
    const year = datetime.getFullYear();
    const month = datetime.getMonth();
    const day = datetime.getDate();

    const todayDate = new Date(year, month, day);
    const pause_datetime = sub.pause_date;
    const resume_datetime = sub.resume_date;

    const pause_year = pause_datetime?.getFullYear();
    const pause_month = pause_datetime?.getMonth();
    const pause_day = pause_datetime?.getDate();
    const pause_date = new Date(pause_year, pause_month, pause_day);

    const resume_year = resume_datetime?.getFullYear();
    const resume_month = resume_datetime?.getMonth();
    const resume_day = resume_datetime?.getDate();
    const resume_date = new Date(resume_year, resume_month, resume_day);

    if (todayDate >= pause_date && todayDate < resume_date) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const calculateNetAmountForSub = async (
  sub: SubDetails
): Promise<number> => {
  const {
    milkids,
    delivered: { length: daysDelivered },
  } = sub;

  let amount = 0;
  for (let i = 0; i < milkids.length; i++) {
    await axios({
      method: "GET",
      url: `${url}/misc/milk-details/${milkids[i]}`,
      // eslint-disable-next-line no-loop-func
    }).then((res) => {
      const milk: MilkDetails = res.data;
      amount += milk.price * daysDelivered;
    });
  }

  return amount;
};

export const dateTimeFromString = (dateTime: string): Date => {
  const [date, time] = dateTime.split(" ");
  const dateArr = date.split("-");
  const timeArr = time.split(":");

  const dateIntArr: number[] = [];
  const timeIntArr: number[] = [];
  for (let i = 0; i < dateArr.length; i++) {
    dateIntArr.push(parseInt(dateArr[i]));
    timeIntArr.push(parseInt(timeArr[i]));
  }

  const [year, month, day] = dateIntArr;
  const [hours, minutes, seconds] = timeIntArr;

  return new Date(year, month, day, hours, minutes, seconds);
};

export const prettyDateTime = (date: Date): string => {
  const dateString = prettyDate(date);
  const timeString = date.toString().slice(16, 21);
  return timeString + " @ " + dateString;
};

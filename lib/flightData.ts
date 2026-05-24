export type AirportCode = "NZNE" | "YSSY" | "NZRO" | "NZGB" | "NZCI" | "NZTL";

export type Airport = {
  code: AirportCode;
  name: string;
  timezone: string;
};

export type Aircraft = {
  type: string;
  capacity: number;
};

export type FlightTemplate = {
  flightNo: string;
  origin: AirportCode;
  destination: AirportCode;
  aircraft: Aircraft;
  departureTime: string;
  durationMinutes: number;
  operatingDays: number[];
  price: number;
};

// 1 = Monday
// 2 = Tuesday
// 3 = Wednesday
// 4 = Thursday
// 5 = Friday
// 6 = Saturday
// 7 = Sunday

export const airports: Record<AirportCode, Airport> = {
  NZNE: {
    code: "NZNE",
    name: "Dairy Flat Airport",
    timezone: "Pacific/Auckland",
  },
  YSSY: {
    code: "YSSY",
    name: "Sydney Airport",
    timezone: "Australia/Sydney",
  },
  NZRO: {
    code: "NZRO",
    name: "Rotorua Airport",
    timezone: "Pacific/Auckland",
  },
  NZGB: {
    code: "NZGB",
    name: "Claris Airport, Great Barrier Island",
    timezone: "Pacific/Auckland",
  },
  NZCI: {
    code: "NZCI",
    name: "Tuuta Airport, Chatham Islands",
    timezone: "Pacific/Chatham",
  },
  NZTL: {
    code: "NZTL",
    name: "Lake Tekapo Airport",
    timezone: "Pacific/Auckland",
  },
};

export const aircraft = {
  syberJet: {
    type: "SyberJet SJ30i",
    capacity: 6,
  },
  cirrus: {
    type: "Cirrus SF50",
    capacity: 4,
  },
  hondaJet: {
    type: "HondaJet Elite",
    capacity: 5,
  },
};

export const flightTemplates: FlightTemplate[] = [
  {
    flightNo: "DF101",
    origin: "NZNE",
    destination: "YSSY",
    aircraft: aircraft.syberJet,
    departureTime: "10:30",
    durationMinutes: 210,
    operatingDays: [5],
    price: 950,
  },
  {
    flightNo: "DF102",
    origin: "YSSY",
    destination: "NZNE",
    aircraft: aircraft.syberJet,
    departureTime: "15:00",
    durationMinutes: 230,
    operatingDays: [7],
    price: 950,
  },

  {
    flightNo: "DF201",
    origin: "NZNE",
    destination: "NZRO",
    aircraft: aircraft.cirrus,
    departureTime: "06:30",
    durationMinutes: 45,
    operatingDays: [1, 2, 3, 4, 5],
    price: 180,
  },
  {
    flightNo: "DF202",
    origin: "NZRO",
    destination: "NZNE",
    aircraft: aircraft.cirrus,
    departureTime: "07:40",
    durationMinutes: 50,
    operatingDays: [1, 2, 3, 4, 5],
    price: 180,
  },
  {
    flightNo: "DF203",
    origin: "NZNE",
    destination: "NZRO",
    aircraft: aircraft.cirrus,
    departureTime: "16:30",
    durationMinutes: 45,
    operatingDays: [1, 2, 3, 4, 5],
    price: 180,
  },
  {
    flightNo: "DF204",
    origin: "NZRO",
    destination: "NZNE",
    aircraft: aircraft.cirrus,
    departureTime: "18:00",
    durationMinutes: 50,
    operatingDays: [1, 2, 3, 4, 5],
    price: 180,
  },

  {
    flightNo: "DF301",
    origin: "NZNE",
    destination: "NZGB",
    aircraft: aircraft.cirrus,
    departureTime: "09:00",
    durationMinutes: 40,
    operatingDays: [1, 3, 5],
    price: 220,
  },
  {
    flightNo: "DF302",
    origin: "NZGB",
    destination: "NZNE",
    aircraft: aircraft.cirrus,
    departureTime: "09:00",
    durationMinutes: 45,
    operatingDays: [2, 4, 6],
    price: 220,
  },

  {
    flightNo: "DF401",
    origin: "NZNE",
    destination: "NZCI",
    aircraft: aircraft.hondaJet,
    departureTime: "10:00",
    durationMinutes: 150,
    operatingDays: [2, 5],
    price: 650,
  },
  {
    flightNo: "DF402",
    origin: "NZCI",
    destination: "NZNE",
    aircraft: aircraft.hondaJet,
    departureTime: "10:00",
    durationMinutes: 165,
    operatingDays: [3, 6],
    price: 650,
  },

  {
    flightNo: "DF501",
    origin: "NZNE",
    destination: "NZTL",
    aircraft: aircraft.hondaJet,
    departureTime: "11:00",
    durationMinutes: 95,
    operatingDays: [1],
    price: 420,
  },
  {
    flightNo: "DF502",
    origin: "NZTL",
    destination: "NZNE",
    aircraft: aircraft.hondaJet,
    departureTime: "10:00",
    durationMinutes: 105,
    operatingDays: [2],
    price: 420,
  },
];
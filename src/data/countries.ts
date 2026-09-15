export type CountryCode = "in" | "ae" | "gb" | "us" | "global";

export type Country = {
  code: CountryCode;
  name: string;
  short: string;
  /** Where the globe should face when this country is selected: [lat, lng]. */
  focus: [number, number];
  /** Client cities shown as markers on the globe. */
  markers: { label: string; location: [number, number] }[];
  blurb: string;
};

export const countries: Country[] = [
  {
    code: "in",
    name: "India",
    short: "IN",
    focus: [18, 80],
    markers: [
      { label: "Brahmapur", location: [19.31, 84.79] },
      { label: "Bengaluru", location: [12.97, 77.59] },
    ],
    blurb: "Home base. Retail, wholesale, pharma, construction and education brands from Odisha to Bengaluru.",
  },
  {
    code: "ae",
    name: "United Arab Emirates",
    short: "UAE",
    focus: [24.5, 54.5],
    markers: [{ label: "Dubai", location: [25.2, 55.27] }],
    blurb: "A photography studio and a global food trading house, both run out of the Emirates.",
  },
  {
    code: "gb",
    name: "United Kingdom",
    short: "UK",
    focus: [52.5, -1.5],
    markers: [{ label: "London", location: [51.51, -0.13] }],
    blurb: "A restaurant chain and a career platform for international students.",
  },
  {
    code: "us",
    name: "United States",
    short: "USA",
    focus: [33, -85],
    markers: [
      { label: "Tampa", location: [27.95, -82.46] },
      { label: "Atlanta", location: [33.75, -84.39] },
    ],
    blurb: "Hospitality, enterprise IT and property management clients from Florida to Georgia.",
  },
  {
    code: "global",
    name: "Global products",
    short: "WW",
    focus: [20, 20],
    markers: [],
    blurb: "Software we designed and shipped as products for teams anywhere.",
  },
];

export const countryByCode = Object.fromEntries(countries.map((c) => [c.code, c])) as Record<
  CountryCode,
  Country
>;

import { icons } from "./icons";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
  { name: "insights", title: "Insights", icon: icons.activity },
  { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
  name: "Husnain | HA-Solutions",
};

export const HOME_BALANCE = {
  amount: 2489.48,
  nextRenewalDate: "2026-03-18T09:00:00.000Z",
};

export const UPCOMING_SUBSCRIPTIONS: UpcomingSubscription[] = [
  {
    id: "spotify",
    icon: icons.spotify,
    name: "Spotify",
    price: 5.99,
    currency: "USD",
    daysLeft: 2,
  },
  {
    id: "notion",
    icon: icons.notion,
    name: "Notion",
    price: 12.0,
    currency: "USD",
    daysLeft: 4,
  },
  {
    id: "figma",
    icon: icons.figma,
    name: "Figma",
    price: 15.0,
    currency: "USD",
    daysLeft: 6,
  },
];

export const HOME_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "adobe-creative-cloud",
    icon: icons.adobe,
    name: "Adobe Creative Cloud",
    plan: "Teams Plan",
    category: "Design",
    paymentMethod: "Visa ending in 8530",
    status: "active",
    startDate: "2025-03-20T10:00:00.000Z",
    price: 77.49,
    currency: "USD",
    billing: "Monthly",
    renewalDate: "2026-03-20T10:00:00.000Z",
    color: "#f5c542",
  },
  {
    id: "github-pro",
    icon: icons.github,
    name: "GitHub Pro",
    plan: "Developer",
    category: "Developer Tools",
    paymentMethod: "Mastercard ending in 2408",
    status: "active",
    startDate: "2024-11-24T10:00:00.000Z",
    price: 9.99,
    currency: "USD",
    billing: "Monthly",
    renewalDate: "2026-03-24T10:00:00.000Z",
    color: "#e8def8",
  },
  {
    id: "claude-pro",
    icon: icons.claude,
    name: "Claude Pro",
    plan: "Pro Plan",
    category: "AI Tools",
    paymentMethod: "Amex ending in 1010",
    status: "paused",
    startDate: "2025-06-27T10:00:00.000Z",
    price: 20.0,
    currency: "USD",
    billing: "Monthly",
    renewalDate: "2026-03-27T10:00:00.000Z",
    color: "#b8d4e3",
  },
  {
    id: "canva-pro",
    icon: icons.canva,
    name: "Canva Pro",
    plan: "Yearly Access",
    category: "Design",
    paymentMethod: "Visa ending in 7784",
    status: "cancelled",
    startDate: "2024-04-02T10:00:00.000Z",
    price: 119.99,
    currency: "USD",
    billing: "Yearly",
    renewalDate: "2026-04-02T10:00:00.000Z",
    color: "#b8e8d0",
  },
];

// Insights Chart Data
export const MONTHLY_SPENDING_DATA = {
  labels: ["Apr", "", "Jun", "", "Aug", "", "Oct", "", "Dec", "", "Feb", ""],
  datasets: [
    {
      data: [
        245.3, 268.5, 287.4, 295.2, 312.8, 325.1, 318.9, 335.6, 348.2, 342.7,
        356.4, 372.1,
      ],
      strokeWidth: 2,
      color: () => "#ea7a53",
    },
  ],
};

export const CATEGORY_SPENDING_DATA = {
  data: [
    {
      name: "Entertainment",
      population: 35,
      color: "#ea7a53",
      legendFontColor: "#081126",
    },
    {
      name: "Productivity",
      population: 28,
      color: "#8fd1bd",
      legendFontColor: "#081126",
    },
    {
      name: "Health",
      population: 20,
      color: "#f5c542",
      legendFontColor: "#081126",
    },
    {
      name: "Others",
      population: 17,
      color: "#b8d4e3",
      legendFontColor: "#081126",
    },
  ],
};

export const LAST_6_MONTHS_DATA = {
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  datasets: [
    {
      data: [318.9, 335.6, 348.2, 342.7, 356.4, 372.1],
      color: () => "#8fd1bd",
      strokeWidth: 2,
    },
  ],
};

export const BUDGET_VS_ACTUAL = {
  labels: ["Budget", "Actual"],
  datasets: [
    {
      data: [400, 372.1],
      color: () => "#081126",
    },
  ],
};

export const SUBSCRIPTION_WISE_SPENDING = {
  labels: [
    "Netflix",
    "Spotify",
    "Adobe",
    "GitHub",
    "Claude",
    "Figma",
    "Notion",
    "Others",
  ],
  data: [79.99, 14.99, 77.49, 9.99, 20.0, 15.0, 12.0, 143.15],
  colors: [
    "#ea7a53",
    "#1DB954",
    "#FF0000",
    "#1f6feb",
    "#b8d4e3",
    "#a259ff",
    "#00d4ff",
    "#c0c0c0",
  ],
};

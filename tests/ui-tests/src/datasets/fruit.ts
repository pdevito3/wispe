export const fruits = [
  {
    value: "apple",
    label: "🍎 Apple",
    color: "red",
    taste: "sweet",
    season: "fall",
    type: "pome",
  },
  {
    value: "banana",
    label: "🍌 Banana",
    color: "yellow",
    taste: "sweet",
    season: "year-round",
    type: "berry",
  },
  {
    value: "orange",
    label: "🍊 Orange",
    color: "orange",
    taste: "citrus",
    season: "winter",
    type: "citrus",
  },
  {
    value: "strawberry",
    label: "🍓 Strawberry",
    color: "red",
    taste: "sweet",
    season: "spring",
    type: "berry",
  },
  {
    value: "grape",
    label: "🍇 Grape",
    color: "purple",
    taste: "sweet",
    season: "fall",
    type: "berry",
  },
  {
    value: "watermelon",
    label: "🍉 Watermelon",
    color: "green",
    taste: "sweet",
    season: "summer",
    type: "melon",
  },
  {
    value: "pineapple",
    label: "🍍 Pineapple",
    color: "yellow",
    taste: "sweet-tart",
    season: "summer",
    type: "tropical",
  },
  {
    value: "kiwi",
    label: "🥝 Kiwi",
    color: "green",
    taste: "tart",
    season: "winter",
    type: "berry",
  },
  {
    value: "mango",
    label: "🥭 Mango",
    color: "yellow",
    taste: "sweet",
    season: "summer",
    type: "tropical",
  },
  {
    value: "cherry",
    label: "🍒 Cherry",
    color: "red",
    taste: "sweet",
    season: "summer",
    type: "stone",
  },
  {
    value: "pear",
    label: "🍐 Pear",
    color: "green",
    taste: "sweet",
    season: "fall",
    type: "pome",
  },
  {
    value: "peach",
    label: "🍑 Peach",
    color: "orange",
    taste: "sweet",
    season: "summer",
    type: "stone",
  },
  {
    value: "lemon",
    label: "🍋 Lemon",
    color: "yellow",
    taste: "sour",
    season: "year-round",
    type: "citrus",
  },
];
type GroupedFruits = {
  [key: string]: Fruit[];
};

export const getGroupedByColor = (): GroupedFruits => {
  const grouped: GroupedFruits = {};
  fruits.forEach((fruit) => {
    if (!grouped[fruit.color]) {
      grouped[fruit.color] = [];
    }
    grouped[fruit.color].push(fruit);
  });
  return grouped;
};

export const getGroupedByTaste = (): GroupedFruits => {
  const grouped: GroupedFruits = {};
  fruits.forEach((fruit) => {
    if (!grouped[fruit.taste]) {
      grouped[fruit.taste] = [];
    }
    grouped[fruit.taste].push(fruit);
  });
  return grouped;
};

export const getGroupedBySeason = (): GroupedFruits => {
  const grouped: GroupedFruits = {};
  fruits.forEach((fruit) => {
    if (!grouped[fruit.season]) {
      grouped[fruit.season] = [];
    }
    grouped[fruit.season].push(fruit);
  });
  return grouped;
};

export const getGroupedByType = (): GroupedFruits => {
  const grouped: GroupedFruits = {};
  fruits.forEach((fruit) => {
    if (!grouped[fruit.type]) {
      grouped[fruit.type] = [];
    }
    grouped[fruit.type].push(fruit);
  });
  return grouped;
};

export type Fruit = (typeof fruits)[number];

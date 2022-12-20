import { Categories } from "../services/categories.js";

export const categories = [];

for (let i = 0; i < Categories.length; i++) {
  categories.push({
    name: Categories[i],
    randomIndex: i,
  });
}

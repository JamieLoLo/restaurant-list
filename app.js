const express = require("express");
const app = express();
const port = 3000;

const exphbs = require("express-handlebars");

const restaurantList = require("./restaurant.json");
// const favoriteList = JSON.parse(localStorage.getItem("favorite")) || [];

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurantList.results });
});

// 使用餐廳的id當作params，並用此id找到餐廳在restaurant.json的詳細資訊。
app.get("/restaurants/:id", (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  );
  res.render("show", { restaurant });
});

// /search這個路由負責比對搜尋結果。
app.get("/search", (req, res) => {
  const filteredRestaurants = restaurantList.results.filter((restaurant) => {
    return (
      restaurant.name
        .toLocaleLowerCase()
        .includes(req.query.keyword.toLocaleLowerCase()) ||
      restaurant.category
        .toLowerCase()
        .includes(req.query.keyword.toLocaleLowerCase())
    );
  });
  // 若無符合搜尋條件的結果，導向noSearchResultPage。
  if (!filteredRestaurants || filteredRestaurants.length === 0) {
    return res.render("noSearchResultPage", { keyword: req.query.keyword });
  }
  // 若有符合的搜尋條件的結果，將篩選後的餐廳顯示。
  res.render("index", {
    restaurants: filteredRestaurants,
    keyword: req.query.keyword,
  });
});

app.listen(port, () => {
  console.log(`Server is listening on localhost:${port}`);
});

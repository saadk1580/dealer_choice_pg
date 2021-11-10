const { Sequelize } = require("sequelize");
var axios = require("axios").default;

const unicodedUrl = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/movies"
);

var options = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/auto-complete",
  params: { q: "Harry Potter" },
  headers: {
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
    "x-rapidapi-key": "a24c2adaa9msh4e35f50fd42ecebp15a3bbjsnb2a103b118fa",
  },
};

const data = async () => {
  let getData;
  await axios
    .request(options)
    .then(function (response) {
      getData = response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  return getData;
};

const Movie = unicodedUrl.define("Movie", {
  name: Sequelize.DataTypes.STRING,
  imgUrl: Sequelize.DataTypes.STRING,
  type: Sequelize.DataTypes.STRING,
  rank: Sequelize.DataTypes.STRING,
  year: Sequelize.DataTypes.INTEGER,
});

const syncAndSeed = async () => {
  await unicodedUrl.sync({ force: true });
  const dataArr = await data();
  dataArr.d.map((item) =>
    Movie.create({
      name: item.l,
      imgUrl: item.i.imageUrl,
      type: item.q,
      rank: item.rank,
      year: item.y,
    })
  );
};

module.exports = {
  unicodedUrl,
  syncAndSeed,
  models: { Movie },
};

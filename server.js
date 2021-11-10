const db = require("./db");
const express = require("express");
const morgan = require("morgan");
const { syncAndSeed, unicodedUrl } = db;
const { Movie } = db.models;
const app = express();

app.use(morgan("dev"));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res, next) => {
  res.redirect("/movies");
});

app.get(`/movies`, async (req, res, next) => {
  try {
    const movies = await Movie.findAll();
    res.send(
      // JSON.stringify(movies)
      `
              <!DOCTYPE html>
                <html>
                  <head>
                    <link rel="stylesheet" href="/style.css" />
                  </head>
                  <body>
                    <div class="movie-container">
                      ${movies
                        .map(
                          (movie, index) => `
                        <div class='movie'>
                          <a href="/movie/${index}">
                            <img class='movie-img' src='${movie.imgUrl}'/>
                            <h3 class='title'>${movie.name}</h3>
                          </a>
                        </div>
                      `
                        )
                        .join("")}
                    </div>
                  </body>
                </html>
       `
    );
  } catch (err) {
    next(err);
  }
});

app.get("/movie/:id", async (req, res, next) => {
  try {
    const movies = await Movie.findAll();
    const movie = await movies[req.params.id];
    res.send(`
        <!DOCTYPE html>
          <html>
            <head>
              <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
              <div class="backBtn">
                <a href="/"> Back 
                </a>
              </div>

              <div class="movie-container">
                  <div class='movie'>
                    <img class='movie-img' src='${movie.imgUrl}'/>
                    <h3 class='title'>${movie.name}</h3>
                    <p> Type: ${movie.type}
                    <p> Rank: ${movie.rank}</p>
                    <p> Release Year: ${movie.year}</p>
                  </div>
              </div>
            </body>
          </html>
      `);
  } catch (err) {
    next(err);
  }
});

const startApp = async () => {
  try {
    await unicodedUrl.authenticate();
    await syncAndSeed();
    console.log("App Starting");
    const port = process.env.PORT || 1337;
    app.listen(port, () => console.log(`Listening on PORT ${port}`));
  } catch (err) {
    next(err);
  }
};

startApp();

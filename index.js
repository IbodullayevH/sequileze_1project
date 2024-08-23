require(`dotenv`).config();
const express = require(`express`);
const app = express();
const { Sequelize, DataTypes } = require(`sequelize`);
app.use(express.json());

let sequelize = new Sequelize({
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  username: process.env.USER,
  port: process.env.PSQL_PORT,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("database connectd");
  })
  .catch((err) => console.log(err));



// PSQL TABLES
// categories
let categories = sequelize.define("categories_songs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  categorieName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// songs
let songs = sequelize.define("songs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  songName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  categorieId: {
    type: DataTypes.INTEGER,
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1950,
      max: Date.now(),
    },
  },
  author_id: {
    type: DataTypes.INTEGER,
  },
});

// authors
let authors = sequelize.define("author_songs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});




// Sinxronizatsiya
songs.sync({ force: false });
categories.sync({ force: false });
authors.sync({ force: false });



// Aloqalarni o'rnatish
categories.hasMany(songs, {
  foreignKey: "categorieId",
  onDelete: "CASCADE",
});
authors.hasMany(songs, {
  foreignKey: "author_id",
  onDelete: "CASCADE",
});
songs.belongsTo(categories, {
  foreignKey: "categorieId",
});
songs.belongsTo(authors, {
  foreignKey: "author_id",
});




// get categories
app.get("/categories/get", async (req, res) => {
  let categoriesAll = await categories.findAll();

  res.status(200).send({
    success: true,
    message: "data get categories all",
    data: categoriesAll,
  });
});

// create
app.post("/categories/new", async (req, res) => {
  let { categorieName } = req.body;

  let newCategories = await categories.create({ categorieName });

  res.status(200).send({
    success: true,
    message: "New Categories created",
    data: newCategories,
  });
});

// patch
app.patch("/categories/update/:id", async (req, res) => {
  let { id } = req.params;
  let { categorieName } = req.body;

  let updateCategorie = await categories.update(
    { categorieName },
    {
      where: {
        id,
      },
    }
  );

  res.status(200).send({
    success: true,
    message: "Successfully Categories updated",
    updated_categorie: updateCategorie,
  });
});

// delete
app.delete("/categories/delete/:id", async (req, res) => {
  let { id } = req.params;
  let deletedCategorie = await categories.destroy({
    where: {
      id,
    },
  });

  res.status(200).send({
    success: true,
    message: "Categories deleted",
    data: deletedCategorie,
  });
});





// songs get
app.get("/songs/get", async (req, res) => {
  let songsAll = await songs.findAll();

  res.status(200).send({
    success: true,
    message: "data get categories all",
    data: songsAll,
  });
});

// create
app.post("/songs/new", async (req, res) => {
  let { songName, categorieId, year, author_id } = req.body;

  let newsong = await songs.create({
    songName,
    categorieId,
    year,
    author_id,
  });

  res.status(200).send({
    success: true,
    message: "New song created",
    data: newsong,
  });
});

// patch
app.patch("/songs/update/:id", async (req, res) => {
  let { id } = req.params;
  let { songName, categorieId, year, author_id } = req.body;

  let updateSongs = await songs.update(
    { songName, categorieId, year, author_id },
    {
      where: {
        id,
      },
    }
  );

  res.status(200).send({
    success: true,
    message: "Successfully songs updated",
    updated_categorie: updateSongs,
  });
});

// delete
app.delete("/songs/delete/:id", async (req, res) => {
  let { id } = req.params;
  let deletedSongs = await songs.destroy({
    where: {
      id,
    },
  });

  res.status(200).send({
    success: true,
    message: "songs deleted",
    data: deletedSongs,
  });
});





// authors
app.get("/author/get", async (req, res) => {
  let authorsAll = await authors.findAll();

  res.status(200).send({
    success: true,
    message: "get all authors information",
    data: authorsAll,
  });
});

// create
app.post("/author/new", async (req, res) => {
  let { author } = req.body;

  let newauthor = await authors.create({ author });

  res.status(200).send({
    success: true,
    message: "New authors created",
    data: newauthor,
  });
});

// patch
app.patch("/author/update/:id", async (req, res) => {
  let { id } = req.params;
  let { author } = req.body;

  let updateAuthor = await authors.update(
    { author },
    {
      where: {
        id,
      },
    }
  );

  res.status(200).send({
    success: true,
    message: "Successfully author updated",
    updated_author: updateAuthor,
  });
});

// delete
app.delete("/author/delete/:id", async (req, res) => {
  let { id } = req.params;
  let deletedAuthor = await authors.destroy({
    where: {
      id,
    },
  });

  res.status(200).send({
    success: true,
    message: "Author deleted",
    data: deletedAuthor,
  });
});

//   app listen and port
const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`${port} ishladi`));

// THE END 
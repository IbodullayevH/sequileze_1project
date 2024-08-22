const express = require(`express`);
const app = express();
const { Sequelize } = require(`sequelize`);
app.use(express.json());

let sequelize = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: "postgres",
  port: 5432,
  password: "8077",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("database connectd");
  })
  .catch((err) => console.log(err));


//   app listen and port satrted
app.listen(9000, () => console.log("9000 ishladi"));

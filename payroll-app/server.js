const express = require("express");
const { readEmployees } = require("./modules/fileHandler");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const employees = await readEmployees();
  res.render("index", { employees });
});



async function startServer() {
  const employees = await readEmployees();
  console.log("Employee Data:", employees);

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

startServer();

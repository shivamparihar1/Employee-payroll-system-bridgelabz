const express = require("express");
const { readEmployees, writeEmployees } = require("./modules/fileHandler");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


// ================= DASHBOARD =================
app.get("/", async (req, res) => {
  const employees = await readEmployees();

  const totalEmployees = employees.length;

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const totalTax = totalSalary * 0.12;
  const totalNet = totalSalary - totalTax;

  const departments = [...new Set(employees.map(e => e.department))];
  const departmentCount = departments.length;

  const avgSalary = totalEmployees ? totalSalary / totalEmployees : 0;

  res.render("index", {
    employees,
    totalEmployees,
    totalSalary,
    totalTax,
    totalNet,
    departmentCount,
    avgSalary
  });
});


// ================= ADD =================
app.get("/add", (req, res) => res.render("add"));

app.post("/add", async (req, res) => {
  let employees = await readEmployees();

  employees.push({
    id: Date.now(),
    name: req.body.name,
    department: req.body.department,
    salary: Number(req.body.salary)
  });

  await writeEmployees(employees);
  res.redirect("/");
});


// ================= DELETE =================
app.get("/delete/:id", async (req, res) => {
  let employees = await readEmployees();
  employees = employees.filter(e => e.id != req.params.id);
  await writeEmployees(employees);
  res.redirect("/");
});


// ================= EDIT =================
app.get("/edit/:id", async (req, res) => {
  const employees = await readEmployees();
  const employee = employees.find(e => e.id == req.params.id);
  res.render("edit", { employee });
});

app.post("/edit/:id", async (req, res) => {
  let employees = await readEmployees();

  employees = employees.map(emp =>
    emp.id == req.params.id
      ? {
          id: emp.id,
          name: req.body.name,
          department: req.body.department,
          salary: Number(req.body.salary)
        }
      : emp
  );

  await writeEmployees(employees);
  res.redirect("/");
});


// ===== SERVER START =====
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

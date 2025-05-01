const express = require("express");
const path = require("path");
//const fs = require("fs");
const app = express();
const taskModel = require("./model/task");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.get("/", function (req, res) {
//   fs.readdir(`./files`, function (err, files) {
//     console.log(files);
//     if (err) {
//       console.error(err);
//     }
//     res.render("index", { files: files });
//   });
// });

app.get("/", async (req, res) => {
  try {
    const tasks = await taskModel.find();
    res.render("index", { tasks });
  } catch (error) {
    console.error("Error fetching tasks! ",error);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/create", function (req, res) {
//   fs.writeFile(
//     `./files/${req.body.taskTitle.split(" ").join("")}.txt`,
//     req.body.taskDesc,
//     function (err) {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("File created successfully");
//         res.redirect("/");
//       }
//     }
//   );
// });

app.post("/create", async (req, res) => {

  const {taskTitle, taskDesc} = req.body;

  let createdTask = await taskModel.create({
    title: taskTitle,
    description: taskDesc
  });

  res.redirect("/");
});

// app.get("/files/:fileName", function (req, res) {
//   fs.readFile(`./files/${req.params.fileName}`, "utf8", function (err, data) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("File read successfully");
//       res.render("show", { fileName: req.params.fileName, data: data });
//     }
//   });
// });

app.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await taskModel.findById(id);
    res.render("show", { tasks });
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/delete/:fileName", function (req, res) {
//   const filePath = `./files/${req.params.fileName}`;
//   fs.unlink(filePath, function (err) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`Deleted file: ${req.params.fileName}`);
//     }
//     res.redirect("/");
//   });
// });

app.post("/delete/:id", async (req, res) => {
  try {
    await taskModel.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Failed to delete task");
  }
});

// app.get("/edit/:fileName", function (req, res) {
//   res.render("edit", {
//     fileName: req.params.fileName,
//   });
// });

// app.post("/edit/:fileName", function (req, res) {
//   const oldFilePath = `./files/${req.params.fileName}`;
//   const newFileName = req.body.editTitle.trim().split(" ").join("")+ ".txt"; 
//   const newFilePath = `./files/${newFileName}`;

//   fs.rename(oldFilePath, newFilePath, function (err) {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Error renaming file.");
//     }
//     console.log("File renamed successfully");
//     res.redirect("/");
//   });
// });

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await taskModel.findById(id);
    res.render("edit", { task });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.render("edit", { task });
  } catch (err) {
    console.error("Error fetching task for edit:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/edit/:id", async (req, res) => {
  const { taskTitle, taskDesc } = req.body;
  try {
    await taskModel.findByIdAndUpdate(req.params.id, {
      title: taskTitle,
      description: taskDesc
    });
    res.redirect("/");
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Failed to update task");
  }
});
app.listen(3000);

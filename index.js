const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    console.log(files);
    if (err) {
      console.error(err);
    }
    res.render("index", { files: files });
  });
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.taskTitle.split(" ").join("")}.txt`,
    req.body.taskDesc,
    function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("File created successfully");
        res.redirect("/");
      }
    }
  );
});

app.get("/files/:fileName", function (req, res) {
  fs.readFile(`./files/${req.params.fileName}`, "utf8", function (err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log("File read successfully");
      res.render("show", { fileName: req.params.fileName, data: data });
    }
  });
});

app.post("/delete/:fileName", function (req, res) {
  const filePath = `./files/${req.params.fileName}`;
  fs.unlink(filePath, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log(`Deleted file: ${req.params.fileName}`);
    }
    res.redirect("/"); // after deleting, go back to home
  });
});

app.listen(3000);

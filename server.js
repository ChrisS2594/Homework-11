const fs = require("file-system");
const express = require("express");

const path = require("path");

let app = express();

//set port
let PORT = process.env.PORT || 8080;

fs.writeFile(path.join(__dirname, "db/db.json"), "[]", function (err) {
    if (err) {
        return console.log(err);
    }
    //console.log(complete);
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));

app.get("/"), function (req, res) {
    res.sendFile(path.join(__dirname, "public/index"));
}

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes"));
});
// writes to the db
app.get("api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function (err, data) {
        if (err) {
            console.log(err)
        }
        data = JSON.parse(data)
        res.send(data)
    })
});

app.post("api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function (err, data) {
        if (err) {
            return console.error;
        };
        data = JSON.parse(data)
        data.push(req.body)
        fs.writeFile(path.join(__dirname, "db/db/json"), JSON.stringify(data), function (err) {
            if (err) {
                return console.error;
            } res.send(data);
        })
    })
});


//deletes from database 
app.delete("/api/notes/:note", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function (err, data) {
        if (err) {
            return console.error
        } let remove = req.params.note;
        data = JSON.parse(data)
        let result = data.filter(data => data.title !== remove);
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(result), function (err) {
            if (err) {
                return console.error;
            }
        })
        res.send(data);
    });
})


app.listen(PORT, function () {
    console.log("application listening on " + PORT)
})
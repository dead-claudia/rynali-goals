"use strict"

const makeIndex = require("./make-html")
const fs = require("fs")
const path = require("path")

const write = (file, data) => {
    const target = path.resolve(__dirname, "../public", file)
    fs.mkdirSync(path.dirname(target), {recursive: true})
    fs.writeFileSync(target, data, "utf-8")
}

write("index.html", makeIndex().trim())

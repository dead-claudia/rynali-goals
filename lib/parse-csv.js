"use strict"

function parseCSV(csv) {
    const lines = []
    let row = []
    let field = ""
    let state = "start"

    for (let i = 0; i < csv.length; i++) {
        const ch = csv[i]
        if (ch === ",") {
            if (state === "quoted") {
                field += ","
            } else {
                row.push(field)
                field = ""
                state = "start"
            }
        } else if (ch === "\n") {
            if (state === "quoted") {
                field += "\n"
            } else {
                // Ignore empty lines
                if (row.length !== 0 || field !== "") {
                    row.push(field)
                    lines.push(row)
                }
                row = []
                field = ""
                state = "start"
            }
        } else if (ch === '"') {
            if (state === "quoted") {
                state = "quoted_quote"
            } else if (state === "start") {
                state = "quoted"
            } else if (state === "quoted_quote") {
                field += '"'
                state = "quoted"
            }
        } else {
            if (state === "quoted_quote") {
                field += '"'
                state = "raw"
            } else {
                field += ch
                if (state === "start") state = "raw"
            }
        }
    }

    // Ignore empty lines
    if (row.length !== 0 || field !== "") {
        row.push(field)
        lines.push(row)
    }

    const headers = lines.shift()

    return lines.map(line => Object.fromEntries(
        headers.map((header, i) => [header, line[i] || ""])
    ))
}

module.exports = parseCSV

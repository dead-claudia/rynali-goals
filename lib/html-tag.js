"use strict"

function escapeReplacer(ch) {
    switch (ch) {
        case "<": return "&lt;"
        case ">": return "&gt;"
        case "&": return "&#38;"
        case "'": return "&#39;"
        case '"': return "&#34;"
        default: return `&#${ch.charCodeAt(0)};`
    }
}

function escapeHTML(str) {
    return `${str}`.replace(/[&<>]/g, escapeReplacer)
}

function escapeAttribute(str) {
    return `${str}`.replace(/[&<>'"]/g, escapeReplacer)
}

class Trust {
    constructor(value) {
        this.value = value
    }
}

class Attribute {
    constructor(value) {
        this.value = value
    }
}

function html([first, ...strs], ...parts) {
    const result = [first]

    for (const [i, part] of parts.entries()) {
        if (part instanceof Trust) result.push(part.value)
        else if (part instanceof Attribute) result.push(escapeAttribute(part.value))
        else result.push(escapeHTML(part))

        result.push(strs[i])
    }

    return result.join("")
}

function trust(value) {
    return new Trust(`${value}`)
}

function attr(value) {
    return new Attribute(`${value}`)
}

module.exports = {html, trust, attr}

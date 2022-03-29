"use strict"

const path = require("path")
const fs = require("fs")
const parseCSV = require("./parse-csv")
const {html, trust, attr} = require("./html-tag")

// Normalize Windows line endings away
const read = file => fs.readFileSync(path.resolve(__dirname, file), "utf-8").replace(/\r\n?/g, "\n")

// Unicode hack to get certain symbols to render properly.
const EMOJIFY = "\uFE0F"
const TEXTIFY = "\uFE0E"
const NON_BREAKING_HYPHEN = "\u2011"

// Some simple color styles
const red = str => trust(html`<span class="red">${str}</span>`)
const green = str => trust(html`<span class="green">${str}</span>`)
const yellow = str => trust(html`<span class="yellow">${str}</span>`)

const rewardReplacements = new Map([
    ["Play horror game (Five Nights at Freddy's)",
        trust(html`Play horror game<br>(Five Nights at Freddy's)`)]
])

module.exports = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="A simple tracker for Rynali's stream goals.">
<style>
${normalizeCSS(read("../node_modules/normalize.css/normalize.css"))}

/* Internal page CSS */
${normalizeCSS(read("./style.css"))}
</style>
<title>Rynali Stream Goals Tracker</title>
</head>

<body>
<div class="page">
    <header>
        <div class="header-wrap">
            <div class="tv-cap" aria-hidden="true">⚡📺⚡</div>
            <h1>
                <span class="tv-wing" aria-hidden="true">⚡📺⚡</span>
                Rynali Stream Goals Tracker
                <span class="tv-wing" aria-hidden="true">⚡📺⚡</span>
            </h1>
            <div class="tv-cap" aria-hidden="true">⚡📺⚡</div>
        </div>
        <div class="disclaimer">
            <div class="disclaimer-header">
                <span aria-hidden="true">⚠${EMOJIFY}</span>
                Disclaimers
                <span aria-hidden="true">⚠${EMOJIFY}</span>
            </div>
            <ul>
                <li>All dates are relative to Rynali's local time, US Eastern time.</li>
                <li>Some data I wasn't able to confirm fully. This is reflected in the table accordingly.</li>
            </ul>
        </div>
    </header>

    <div class="scroll-notice" aria-hidden="true">
        Note: the table can be scrolled to the right to reveal hidden columns.
    </div>

    <div class="table">
        <table>
            <tr>
                <th scope="col">Reward</th>
                <th scope="col">Condition</th>
                <th scope="col">Date set</th>
                <th scope="col">Achieved</th>
                <th scope="col">Status</th>
            </tr>
            ${trust(parseCSV(read("../rynali-goals.csv")).sort(csvComparator).map((d, i) => html`
            <tr class="${attr(i % 2 === 0 ? "even" : "odd")}">
                <th scope="row">${rewardReplacements.get(d.reward) || d.reward}</th>
                <td>${goalCondition(d)}</td>
                <td>${range(d.date_set_min, d.date_set_max, yellow("unknown"))}</td>
                <td>${goalAchieved(d)}</td>
                <td>${statusRange(d)}</td>
            </tr>
`).join(""))}
        </table>
    </div>

    <footer>
        <p>A public service by Claudia. ❤${EMOJIFY}</p>
        <div class="socials">
            Discord: <a href="https://discordapp.com/users/667135548535603230">codergoth#7868</a> |
            GitHub: <a href="https://github.com/dead-claudia">@dead-claudia</a> |
            Twitter: <a href="https://twitter.com/dead_claudia">@dead_claudia</a>
        </div>
        <div class="source">
            This site is open source on GitHub, complete with
            <a href="https://github.com/dead-claudia/rynali-goals/blob/main/rynali-goals.csv">the underlying dataset</a>,
            so <a href="https://github.com/dead-claudia/rynali-goals">feel free to contribute</a>!
        </div>
    </footer>
</div>
</body>
</html>
`

const csvCollator = new Intl.Collator("en", {sensitivity: "base"})

function csvComparator(a, b) {
    let relA = a.date_set_max === "?" ? a.date_set_min : a.date_set_max
    let relB = b.date_set_max === "?" ? b.date_set_min : b.date_set_max
    // Sort in reverse order
    return csvCollator.compare(relB, relA)
}

function quantity(value) {
    return value === "?" ? yellow("unknown") : value
}

function date(value) {
    return quantity(value.replace(/-/g, NON_BREAKING_HYPHEN))
}

function range(min, max, onEmpty) {
    if (min === "" || max === "") return onEmpty
    if (min === "failed" || max === "failed") return red("failed")
    if (min === max) return date(min)
    return trust(html`${date(min)} to ${date(max)}`)
}

function goalAchieved(d) {
    if (d.single_stream === "true") {
        // The check has a non-color variant, and I've also seen the X rendered as non-color (in
        // violation of the Unicode spec).
        if (d.date_achieved_min === "") return ""
        if (d.date_achieved_min === "failed") return red(`❌${TEXTIFY}`)
        return green(`✔${TEXTIFY}`)
    }

    return range(d.date_achieved_min, d.date_achieved_max, red(`❌${TEXTIFY}`))
}

function statusRange(d) {
    const min = d.date_started
    const max = d.date_finished
    if (min === "") {
        if (d.reward === "") return ""
        return red("not started")
    }
    if (max === "") return yellow(trust(html`started ${date(min)}`))
    if (min === max) return date(min)
    return trust(html`${date(min)} to ${date(max)}`)
}

function goalCondition(d) {
    const suffix = d.single_stream === "true" ? trust(html`<br>by end of stream`) : ""
    if (d.goal_type === "subs") return trust(html`${quantity(d.goal_amount)} subs${suffix}`)
    if (d.goal_type === "follows") return trust(html`${quantity(d.goal_amount)} follows${suffix}`)
    if (d.goal_type === "donos") {
        if (d.goal_amount === "?") return trust(html`${yellow("unknown")} in tips${suffix}`)
        return trust(html`$${d.goal_amount} in tips${suffix}`)
    }
    return trust(html`${yellow("unknown")}${suffix}`)
}

function normalizeCSS(css) {
    // It's not loaded independently, so the @charset declaration can be removed
    css = css.replace(/^\s*@charset\s*(?:"[^"]*"|'[^']*')\s*;?\n/, "")
    return css
}

# Rynali stream goals tracker

This is an attempt to track Rynali's stream goals. You can see this live at https://rynali-goals.xyz. It's based on the data set at https://github.com/dead-claudia/rynali-goals/blob/main/rynali-goals.csv, and I've wired up GitHub Actions to ensure updates to that (and to the generator code) are immediately reflected in the live site.

The page itself is just built with a few Node scripts in lib/, and it's cobbled together a bit hackishly to generate a single static HTML file that's compatible with about everything on the planet (and doesn't require scripting). Not much thought was put into it, and I'm too lazy to set up a heavy-handed static site generator for this.

# Rynali stream goals tracker

This is an attempt to track [Rynali](https://www.twitch.tv/rynali)'s stream goals. You can see this live at https://rynali-goals.xyz. It's based on the data set at https://github.com/dead-claudia/rynali-goals/blob/main/rynali-goals.csv, and I've wired up GitHub Actions to ensure updates to that (and to the generator code) are immediately reflected in the live site.

The page itself is just built with a few Node scripts in lib/, and it's cobbled together a bit hackishly to generate a single static HTML file that's compatible with about everything on the planet (and doesn't require scripting). Not much thought was put into it, and I'm too lazy to set up a heavy-handed static site generator for this.

## Copyright and license

> Prepare for your eyes to glaze over.

Copyright (c) 2024 Claudia Meadows

All data set files (files whose names end with `.csv`) are under the [Creative Commons Attrbution 4.0 International](https://creativecommons.org/licenses/by/4.0/) license. A copy of that at the time of writing is provided [here](LICENSE.dataset.txt) for reference, but the Creative Commons' version in the prior link is authoritative.

Supporting source code (all other files) is under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0). A copy of that at the time of writing is provided [here](LICENSE.txt) for reference, but Apache's version in the prior link is authoritative.

You may not use any file in this repository except in compliance with their respective license. Unless required by applicable law or agreed to in writing, files in this repository are distributed on **an "as is" basis, without warranties or conditions of any kind, either express or implied**. See the file's corresponding license for the specific language governing permissions and limitations under their license.
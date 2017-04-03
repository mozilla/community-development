Community Development Team OKRs
====

This project tracks the Community Development Team OKRs in a dashboard.

Changing the progress/OKRs
---

All OKRs are saved in the ```okrs.json``` file. It's in JSON format, which can be quite picky about the format. Please make sure don't remove any commas, paranthesis, etc. A single Key Result has the following properties:

```
{
  "name": "Title of the Key Result",
  "description": "Description of the Key Result (shows in the info box)",
  "progress": 0.0, // progress from 0-100, shows as the label next to the title
  "score": "0.0", // score that was already achieved. This needs to map to a score below, for example "0.2"
  "scoring": {
    "0.2": "achievement milestone 1",
    "0.4": "achievement milestone 2",
    "0.6": "achievement milestone 3",
    "0.8": "achievement milestone 4",
    "1.0": "achievement milestone 5"
  }
}
```

Running it locally
---

Make sure you have node and npm installed before using the following commands:

```
$ npm install
$ npm start
```

Building it
---

To make it show up on the GitHub page, you need to build it and check the built sources in.

```
$ npm run build
```

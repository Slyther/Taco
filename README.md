# Basic Setup

API and Client are handled separately. Install node packages for each.

Both API and Client can be run from the project root folder at once by simply running ```yarn start```.

API requires a MongoDB connection. Connection information should be added under ```API/src/database.js```.

There's a bug where Firefox refuses to allow a connection between the client and the API. Use Chrome.
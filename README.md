#Basic Setup

API and Client are handled separately. Install node packages for each.

Both setups run with ```yarn start```.

API required a MongoDB connection. Connection information should be added under ```API/src/database.js```.

There's a bug where Firefox refuses to allow a connection between the client and the API. Use Chrome.
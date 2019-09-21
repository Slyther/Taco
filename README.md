# Basic Setup

API and Client are handled separately. Install node packages for each.

Both API and Client can be run from the project root directory at once by simply running ```yarn start```.

Only API has tests. Run the tests directly on the API directory with ```yarn test```

API requires a MongoDB connection. Connection information should be added under ```API/src/environments```.

There's a bug where Firefox refuses to allow a connection between the client and the API on localhost. Use Chrome for client or Postman to test the API.
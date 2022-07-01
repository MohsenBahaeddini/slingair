const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { flights, reservations } = require("./data");
const flightsNum = Object.keys(flights);
const flightsArray = flights[flightsNum[0]];

const batchImport = async () => {
  try {
    const client = new MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db("slingair");

    const insertData = await db
      .collection("data")
      .insertOne({ flight: flightsNum[0], seats: flightsArray });

    const insertReservations = await db
      .collection("reservations")
      .insertMany(reservations);
    console.log("SUCCESS");
    await client.close();
  } catch (err) {
    console.log("ERROR:", err);
  }
};
batchImport();

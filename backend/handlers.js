"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// use this data. Changes will persist until the server (backend) restarts.
const { flights, reservations } = require("./data");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// get all flight numbers
const getFlights = async (req, res) => {
  const allFlights = Object.keys(flights);
  res.status(200).json({
    status: 200,
    flights: allFlights,
  });
};

// get a specific flight
const getFlight = async (req, res) => {
  const flightNumber = req.params.id;
  // const allFlights = Object.keys(flights);
  console.log(flightNumber);
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("slingair");
    const allSeats = await db
      .collection("data")
      .findOne({ flight: flightNumber });
    console.log(allSeats);
    if (allSeats) {
      res.status(200).json({
        status: 200,
        seats: allSeats.seats,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "flight not found",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  } finally {
    await client.close();
  }
};

const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("slingair");
    const allReservations = await db
      .collection("reservations")
      .find()
      .toArray();
    res.status(200).json({
      status: 200,
      reservations: allReservations,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      Error: err.message,
    });
  } finally {
    await client.close();
  }
};

const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { seatId, firstName, lastName, email, flight } = req.body;

  const reservationId = uuidv4();
  if (!seatId || !firstName || !lastName || !email) {
    res.status(400).json({
      status: 400,
      error: "at least one info is missing",
    });
  }

  const query = { flight: flight, "seats.id": seatId };
  try {
    await client.connect();

    const db = client.db("slingair");

    const selectedFlight = await db
      .collection("data")
      .findOne({ flight: flight });

    const selectedSeat = selectedFlight.seats.find(
      (element) => element.id === seatId
    );
    console.log(selectedSeat);
    if (!selectedSeat.isAvailable) {
      return res.status(400).json({
        status: 400,
        error: "seat is not available",
      });
    }
    const newValues = {
      $set: { "seats.$.isAvailable": false },
    };
    const newReservation = {
      _id: reservationId,
      flight: flight,
      seat: seatId,
      givenName: firstName,
      surname: lastName,
      email: email,
    };
    const insertReservation = await db
      .collection("reservations")
      .insertOne(newReservation);
    const reservedNewSeat = await db
      .collection("data")
      .updateOne(query, newValues);
    // console.log(reservedNewSeat);
    res.status(200).json({
      status: 200,
      query: query,
      _id: reservationId,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      Error: err.message,
    });
  } finally {
    client.close();
  }
};

const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const reservationNumber = req.params.id;
  try {
    await client.connect();
    const db = client.db("slingair");
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: reservationNumber });
    res.status(200).json({
      status: 200,
      reservation: reservation,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      Error: err.message,
    });
  } finally {
    await client.close();
  }
};

const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const reservationId = req.params.id;
  try {
    await client.connect();
    const db = client.db("slingair");

    const deleteRes = await db
      .collection("reservations")
      .deleteOne({ _id: reservationId });
    console.log(deleteRes);
    res.status(200).json({
      status: 200,
      deleted: deleteRes.deletedCount,
      message: "reservation deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      Error: err.message,
    });
  } finally {
    await client.close();
  }
};

const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { firstName, lastName, email, seatId } = req.body;

  const reservationId = req.params.id;
  console.log("reservationId: ", reservationId);
  const query = { _id: reservationId };
  try {
    await client.connect();
    const db = client.db("slingair");
    const selectedRes = await db.collection("reservations").findOne(query);
    console.log("selectedRes : ", selectedRes);
    if (seatId && seatId !== selectedRes.seat) {
      const flight = selectedRes.flight;
      console.log("flight:", flight);
      // checking  new desired seat availability
      const flightInfo = await db
        .collection("data")
        .findOne({ flight: flight });
      console.log("flightInfo:", flightInfo.seats);
      console.log(seatId);
      const newDesiredSeat = flightInfo.seats.find(
        (element) => element.id === seatId
      );
      console.log("newDesiredSeat :", newDesiredSeat);
      if (!newDesiredSeat.isAvailable) {
        return res.status(400).json({
          status: 400,
          error: "slected seat is not available",
        });
      }

      // UPDATE DATA COLLECTION { OLDSEAT/NEWSEAT AVAILABILITY }
      const newSeatValues = { $set: { "seats.$.isAvailable": false } };
      const newSeatAvailability = await db
        .collection("data")
        .updateOne({ flight: flight, "seats.id": seatId }, newSeatValues);
      const oldSeatValues = { $set: { "seats.$.isAvailable": true } };
      const oldSeatAvailability = await db
        .collection("data")
        .updateOne(
          { flight: flight, "seats.id": selectedRes.seat },
          oldSeatValues
        );
    }

    const newValues = {
      $set: {
        givenName: firstName || selectedRes.givenName,
        surname: lastName || selectedRes.surname,
        email: email || selectedRes.email,
        seat: seatId || selectedRes.seat,
      },
    };
    const modifiedRes = await db
      .collection("reservations")
      .updateOne(query, newValues);
    console.log("modifiedRes:", modifiedRes);
    res.status(200).json({
      status: 200,
      updatedRes: modifiedRes,
      success: true,
    });
    console.log(selectedRes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      Error: err.message,
    });
  } finally {
    await client.close();
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};

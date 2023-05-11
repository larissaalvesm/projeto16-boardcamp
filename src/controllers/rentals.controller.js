import { db } from "../database/database.connection.js";

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);
        if (customerExists.rowCount === 0) return res.sendStatus(400);

        const gameExists = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        if (gameExists.rowCount === 0) return res.sendStatus(400);

        const openGameRentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" is null;`, [gameId]);
        if (openGameRentals.rowCount >= gameExists.rows[0].stockTotal) return res.sendStatus(400);

        const rentDate = new Date((new Date()).getTime() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        const returnDate = null;
        const originalPrice = daysRented * gameExists.rows[0].pricePerDay;
        const delayFee = null;

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        res.sendStatus(201);

    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
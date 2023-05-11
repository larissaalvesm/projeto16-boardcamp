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

export async function finalizeRental(req, res) {
    const { id } = req.params;

    try {
        const rentalExists = await db.query(`
        SELECT 
        rentals.*, games."pricePerDay"
        FROM rentals 
        JOIN games ON rentals."gameId" = games.id
        WHERE rentals."id"=$1;
        `, [id]);
        if (rentalExists.rowCount === 0) return res.sendStatus(404);

        if (rentalExists.rows[0].returnDate !== null) return res.sendStatus(400);

        const returnDate = new Date((new Date()).getTime() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        const rentDate = new Date(rentalExists.rows[0].rentDate).getTime();
        const days = rentDate + (rentalExists.rows[0].daysRented * 24 * 60 * 60 * 1000);
        const today = Date.now();
        const delayDays = Math.floor((today - days) / (24 * 60 * 60 * 1000));
        let delayFee;

        if (delayDays > 0) {
            delayFee = delayDays * rentalExists.rows[0].pricePerDay;
        } else {
            delayFee = null;
        }

        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE "id"=$3;`,
            [returnDate, delayFee, id]);

        res.sendStatus(200);

    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
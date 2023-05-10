import { db } from "../database/database.connection.js";

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);
        if (cpfExists.rowCount > 0) return res.sendStatus(409);

        await db.query(`INSERT INTO customers ("name", "phone", "cpf", "birthday") VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
        res.sendStatus(201);

    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`);
        res.send(customers.rows);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customers = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        if (customers.rowCount === 0) return res.sendStatus(404);
        res.send(customers.rows[0]);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomerById(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf=$1 AND id<>$2;`, [cpf, id]);
        if (cpfExists.rowCount > 0) return res.sendStatus(409);

        await db.query(`UPDATE customers SET "name"=$1, "phone"=$2, "cpf"=$3, "birthday"=$4 WHERE "id"=$5;`, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);

    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

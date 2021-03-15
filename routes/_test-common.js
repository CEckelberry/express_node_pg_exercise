/** code common to tests. */

const db = require("../db");


async function createData() {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  await db.query("SELECT setval('invoices_id_seq', 1, false)");

  await db.query(`INSERT INTO companies (code, name, description)
                    VALUES ('googl', 'Google', 'Worlds largest search engine and advertiser'),
                           ('tsla', 'Tesla', 'Large Electric Vehicle Manufacturer')`);

  const inv = await db.query(
        `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
           VALUES ('googl', 100, false, '2018-01-01', null),
                  ('googl', 200, true, '2018-02-01', '2018-02-02'), 
                  ('tsla', 300, false, '2018-03-01', null)
           RETURNING id`);
}


module.exports = { createData };
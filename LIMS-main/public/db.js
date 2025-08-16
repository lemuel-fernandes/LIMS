require('dotenv').config();
const postgres = require('postgres');
const fs = require('fs');

(async () => {
  try {
    const connectionString = process.env.DATABASE_URL;
    const sql = postgres(connectionString, { ssl: 'require' });

    const rawData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    const rows = rawData.slice(1); 
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS equipment (
        code_no TEXT PRIMARY KEY,
        equipment TEXT,
        details TEXT,
        range TEXT,
        no INTEGER,
        units INTEGER,
        condition TEXT,
        made TEXT,
        date_of_purchase TEXT,
        invoice_no TEXT,
        price_per_unit TEXT,
        total TEXT,
        remarks TEXT
      );
    `;
    console.log(' Table "equipment" ready.');

    // Prepare data for batch insert
    const values = rows.map((row) => ({
      code_no: row[4] || null,
      equipment: row[1] || null,
      details: row[2] || null,
      range: row[3] || null,
      no: row[0] || null,
      units: row[5] || null,
      condition: row[6] || null,
      made: row[7] || null,
      date_of_purchase: row[8] || null,
      invoice_no: row[9] || null,
      price_per_unit: row[10] || null,
      total: row[11] || null,
      remarks: row[12] || null,
    }));

    // Batch insert with conflict handling
    await sql`
      INSERT INTO equipment (
        code_no, equipment, details, range, no, units, condition,
        made, date_of_purchase, invoice_no, price_per_unit, total, remarks
      )
      VALUES ${sql(values)}
      ON CONFLICT (code_no) DO NOTHING;
    `;

    console.log(` Batch inserted ${values.length} rows.`);
    await sql.end();

  } catch (error) {
    console.error('Error:', error);
  }
})();
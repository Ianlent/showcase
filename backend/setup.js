import "dotenv/config";
import pool from "./db.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

const createAdmin = async () => {
	try {
		const admin = {
			user_name: "admin",
			user_role: "admin",
			phone_number: "0988888888",
			password: "password",
		};

		const salt = await bcrypt.genSalt(saltRounds);
		const password_hash = await bcrypt.hash(admin.password, salt);

		const result = await pool.query(
			`INSERT INTO local_users (user_name, user_role, user_phone, password_hash)
                VALUES ($1, $2, $3, $4)
			ON CONFLICT DO NOTHING
            RETURNING *`, // Shortened for clarity
			[
				admin.user_name,
				admin.user_role,
				admin.phone_number,
				password_hash,
			],
		);

		console.log("Admin created:", result.rows[0]);
		console.log("Login details:");
		console.log(
			`
{
	"user_phone": "${result.rows[0].user_phone}",
	"password": "${admin.password}"
}`,
		);
	} catch (err) {
		console.error("Error creating admin:", err);
	} finally {
		// Essential: Close the pool or the script will hang forever
		await pool.end();
	}
};

async function runSetup() {
	let retries = 10;
	while (retries > 0) {
		try {
			console.log("Attempting to connect to database...");
			// Test the connection
			await pool.query("SELECT 1");

			// If we reached here, DB is ready
			await createAdmin();
			console.log("✅ Admin user setup complete.");
			return;
		} catch (err) {
			retries -= 1;
			console.error(
				`❌ Connection failed (${err.code}). Database currently loading large dataset. Retrying in 20 seconds... (${retries} left)`,
			);
			await new Promise((res) => setTimeout(res, 20000));
		}
	}
	console.error(
		"Failed to connect to database after multiple retries. Exiting.",
	);
	process.exit(1);
}

runSetup();

import pool from "../db.js";
import { spendingRepository } from "../repositories/spendingRepository.js";
import { IdempotencyRepository } from "../repositories/idempotencyRepository.js";
import handleCursor from "../utils/handleCursor.js";

export const SpendingService = {
	async getAll(filters) {
		const { start, end, limit, ...otherFilters } = filters;
		if (start && end && start > end) {
			throw {
				type: "UNPROCESSABLE",
				message: "Start date cannot be after end date.",
			};
		}

		const tickets = await spendingRepository.fetchAll({
			start,
			end,
			limit: parseInt(limit) + 1,
			...otherFilters,
		});

		const hasMore = tickets.length > limit;
		const results = hasMore ? tickets.slice(0, limit) : tickets;

		let nextPageToken = null;
		if (hasMore) {
			const lastItem = results[results.length - 1];
			const value = lastItem.ticket_date;
			nextPageToken = handleCursor.encodeCursor(
				value,
				lastItem.ticket_id,
			);
		}
		return { results, next_page: nextPageToken };
	},

	async create(ticketData, idempotencyKey) {
		const client = await pool.connect();
		try {
			await client.query("BEGIN");
			const { user_id } = ticketData;
			const result = await spendingRepository.createTicket(
				client,
				ticketData,
			);

			await IdempotencyRepository.updateSuccess(client, {
				key: idempotencyKey,
				userId: user_id,
				code: 201,
				body: { success: true, data: result },
			});
			await client.query("COMMIT");
			return result;
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	},

	async update(id, ticketData) {
		const result = await spendingRepository.updateTicket(id, ticketData);
		if (!result) {
			throw { type: "NOT_FOUND", message: "Ticket not found" };
		}
		return result;
	},

	async remove(id) {
		const deleted = await spendingRepository.softDelete(id);
		if (!deleted) {
			throw { type: "NOT_FOUND", message: "Ticket not found" };
		}
	},
};

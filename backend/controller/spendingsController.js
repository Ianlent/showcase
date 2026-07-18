import responseHandler from "../utils/response.handler.js";
import handleCursor from "../utils/handleCursor.js";
import { SpendingService } from "../services/spendingService.js";

export const getAllTickets = async (req, res, next) => {
	try {
		const { start, end, next_page, limit = 5, ...otherFilters } = req.query;
		const { cursorValue, cursorId } = handleCursor.decodeCursor(next_page);
		const result = await SpendingService.getAll({
			cursorId,
			cursorValue,
			limit,
			start,
			end,
			...otherFilters,
		});
		return responseHandler.ok(res, result);
	} catch (err) {
		next(err);
	}
};

export const createTicket = async (req, res, next) => {
	try {
		const { amount, is_expense, reason, ticket_date } = req.body;
		const user_id = req.user.user_id;
		const idempotencyKey = req.idempotencyKey;
		const result = await SpendingService.create(
			{
				amount,
				is_expense,
				reason,
				ticket_date,
				user_id,
			},
			idempotencyKey,
		);
		return responseHandler.created(res, result);
	} catch (err) {
		next(err);
	}
};

export const updateTicketByID = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { amount, ticket_date, is_expense, reason } = req.body;
		const result = await SpendingService.update(id, {
			amount,
			ticket_date,
			is_expense,
			reason,
		});

		return responseHandler.ok(res, result);
	} catch (err) {
		next(err);
	}
};

export const deleteTicketByID = async (req, res, next) => {
	try {
		const { id } = req.params;
		await SpendingService.remove(id);
		return responseHandler.noContent(res);
	} catch (err) {
		next(err);
	}
};

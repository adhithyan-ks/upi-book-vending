import { fail } from '@sveltejs/kit';
import { razorpay } from '$lib/server/razorpay.js';
import { saveOrder } from '$lib/server/database.js';

/** @type {import('./$types').Actions} */
export const actions = {
	// Default action for the form
	default: async ({ request }) => {
		const data = await request.formData();
		const amount = Number(data.get('amount'));

		if (!amount || isNaN(amount) || amount <= 0) {
			return fail(400, { success: false, message: 'Please provide a valid amount.' });
		}

		const options = {
			amount: amount * 100, // Amount in paise
			currency: 'INR',
			receipt: `receipt_order_${new Date().getTime()}`
		};

		try {
			const order = await razorpay.orders.create(options);

			// Save the created order to our JSON "database"
			await saveOrder({
				order_id: order.id,
				amount: order.amount,
				currency: order.currency,
				receipt: order.receipt,
				status: 'created'
			});

			// Return the order details to the client
			return { success: true, order };
		} catch (error) {
			console.error('Razorpay order creation failed:', error);
			return fail(500, { success: false, message: 'Could not create the order.' });
		}
	}
};
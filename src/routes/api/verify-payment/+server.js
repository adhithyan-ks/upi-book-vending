import { json } from '@sveltejs/kit';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { RAZORPAY_KEY_SECRET } from '$env/static/private';
import { updateOrder, getOrder } from '$lib/server/database.js';
import { publishBlink } from '$lib/server/mqtt.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
	const body = `${razorpay_order_id}|${razorpay_payment_id}`;

	try {
		const isValid = validateWebhookSignature(body, razorpay_signature, RAZORPAY_KEY_SECRET);

		if (isValid) {
			// Update the order status in our database
			await updateOrder(razorpay_order_id, {
				status: 'paid',
				payment_id: razorpay_payment_id
			});

			console.log('Payment verification successful');
			console.log('Payment ID:', razorpay_payment_id);

			try {
				// Fetch the order to get the amount for MQTT hook
				const order = await getOrder(razorpay_order_id);
				if (order && order.amount) {
					// order.amount is in paise, so divide by 100 to get INR
					const amountInINR = order.amount / 100;
					publishBlink(amountInINR);
				}
			} catch (err) {
				console.error('Failed to trigger blink:', err);
			}

			return json({ status: 'ok' });
		} else {
			console.log('Payment verification failed');
			console.log('Payment ID:', razorpay_payment_id);
			return json({ status: 'verification_failed' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error verifying payment:', error);
		return json({ status: 'error', message: 'Internal server error' }, { status: 500 });
	}
}
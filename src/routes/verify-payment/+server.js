import { json } from '@sveltejs/kit';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { RAZORPAY_KEY_SECRET } from '$env/static/private';
import { updateOrder } from '$lib/server/database.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
	const body = `${razorpay_order_id}|${razorpay_payment_id}`;

	try {
		const isValid = validateWebhookSignature(body, razorpay_signature, RAZORPAY_KEY_SECRET);

		if (isValid) {
			// Update the order status in our database
			updateOrder(razorpay_order_id, {
				status: 'paid',
				payment_id: razorpay_payment_id
			});
			console.log('Payment verification successful');
			return json({ status: 'ok' });
		} else {
			console.log('Payment verification failed');
			return json({ status: 'verification_failed' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error verifying payment:', error);
		return json({ status: 'error', message: 'Internal server error' }, { status: 500 });
	}
}
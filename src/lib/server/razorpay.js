import Razorpay from 'razorpay';
import { RAZORPAY_KEY_SECRET } from '$env/static/private';
import { PUBLIC_RAZORPAY_KEY_ID } from '$env/static/public';

// Initialize the Razorpay instance for server-side use
export const razorpay = new Razorpay({
	key_id: PUBLIC_RAZORPAY_KEY_ID,
	key_secret: RAZORPAY_KEY_SECRET
});
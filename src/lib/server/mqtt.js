import mqtt from 'mqtt';
import { MQTT_URL, MQTT_USERNAME, MQTT_PASSWORD } from '$env/static/private';

const client = mqtt.connect(MQTT_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
});

client.on('connect', () => {
    console.log('MQTT connected');
});

client.on('error', (err) => {
    console.error('MQTT error:', err);
});

export function publishBlink(amount) {
    // calculate count based on amount in INR
    const count = Math.floor(amount / 55);

    client.publish('orders/blink', count.toString(), (err) => {
        if (err) {
            console.error('Failed to publish Blink:', err);
        } else {
            console.log('Blink published:', count);
        }
    });
}

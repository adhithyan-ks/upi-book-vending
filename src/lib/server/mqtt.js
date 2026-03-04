import mqtt from 'mqtt';

const client = mqtt.connect('mqtts://ba7b661ecd7b4b1f835b21527023b97a.s1.eu.hivemq.cloud:8883', {
    username: 'espclient',
    password: 'client@ESP8266'
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

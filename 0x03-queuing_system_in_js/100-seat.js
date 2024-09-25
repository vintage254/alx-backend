import express from 'express';
import { promisify } from 'util';
import redis from 'redis';
import kue from 'kue';

const app = express();
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const queue = kue.createQueue();

let reservationEnabled = true;

async function reserveSeat(number) {
	await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
	const seats = await getAsync('available_seats');
	return parseInt(seats) || 0;
}

// Initialize available seats to 50
reserveSeat(50);

app.get('/available_seats', async (req, res) => {
	const numberOfAvailableSeats = await getCurrentAvailableSeats();
	res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

app.get('/reserve_seat', (req, res) => {
	seats: 1
}).save((err) => {
	if (err) {
		return res.json({ status: "Reservation failed" });
	}
	res.json({ status: "Reservation in process" });
});
	job.on('complete', () => {
		console.log(`Seat reservation job ${job.id} completed`);
	});
	job.on('failed', (err) => {
		console.log(`Seat reservation job ${job.id} failed: ${err}`);
	});
});
app.get('/process', async (req, res) => {
	res.json({ status: "Queue processing" });
	
	queue.process('reserve_seat', async (job, done) => {
		const currentSeats = await getCurrentAvailableSeats();
		const newSeats = currentSeats - job.data.seats;
		
		if (newSeats >= 0) {
			await reserveSeat(newSeats);
			if (newSeats === 0) {
				reservationEnabled = false;
			}
			done();
		} else {
			done(new Error('Not enough seats available'));
		}
	});
});

const PORT = 1245;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;

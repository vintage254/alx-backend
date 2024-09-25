import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Create an object containing the Job data
const jobData = {
	phoneNumber: '4153518780',
	message: 'This is the code to verify your account'
};

// Create a job in the push_notification_code queue
const job = queue.create('push_notification_code', jobData)
	.save((err) => {
		if (!err) {
			console.log(`Notification job created: ${job.id}`);
		} else {
			console.error('Failed to create notification job:', err);
		}
	});

// Job completion handle 
job.on('complete', () => {
	console.log('Notification job completed');
	queue.shutdown(5000, (err) => {
		console.log('Kue shutdown:', err || 'Successful');
		process.exit(0);
	});
});

// Job failure handler
job.on('failed', () => {
	console.log('Notification job failed');
	queue.shutdown(5000, (err) => {
		console.log('Kue shutdown:', err || 'Successful');
		process.exit(1);
	});
});

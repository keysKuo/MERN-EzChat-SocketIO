function formatTimestamp(timestamp) {
	const now = new Date();
	const date = new Date(timestamp);

	const sameDay = now.toDateString() === date.toDateString();

	const options = { hour: "numeric", minute: "numeric", hour12: true };
	const timeString = new Intl.DateTimeFormat("en-US", options).format(date);

	if (sameDay) {
		return timeString;
	} else {
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 1
			? `${timeString} - ${diffDays} days ago`
			: `${timeString} - yesterday`;
	}
}

export { formatTimestamp };

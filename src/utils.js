export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();

    // Pad hours and minutes with leading zeros if they are less than two digits
    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');

    return `${hours}:${minutes}`;
}



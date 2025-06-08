export const formatDuration = (duration: string): string => {
    const parts = duration.split(':').map(Number);

    if (parts.length !== 3) return duration;

    const [hours, minutes, seconds] = parts;

    if (hours === 0) return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return duration;
};

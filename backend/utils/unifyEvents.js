// utils/unifyEvents.js
export const unifyEvents = (blasts, events) => {
    const unifiedBlasts = blasts.map(blast => ({
      id: blast._id,
      title: `Blast by ${blast.plannedBy}`,
      start: new Date(`${blast.expDate}T${blast.expStartTime}`),
      end: new Date(`${blast.expDate}T${blast.expEndTime}`),
      type: 'blast',
      details: blast,
    }));
  
    const unifiedEvents = events.map(event => {
      const eventStart = new Date(`${event.date.toISOString().split('T')[0]}T${event.time}`);
      const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // Assuming 1-hour duration
      return {
        id: event._id,
        title: event.name,
        start: eventStart,
        end: eventEnd,
        type: 'event',
        details: event,
      };
    });
  
    return [...unifiedBlasts, ...unifiedEvents];
  };
  
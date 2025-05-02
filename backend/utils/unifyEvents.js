// utils/unifyEvents.js

export const unifyEvents = (blasts, events) => {

  // Process blasts
  const unifiedBlasts = blasts.map(blast => {
    // Validate: expStartTime and expEndTime should exist
    if (!blast.expStartTime || !blast.expEndTime) {
      console.warn("Skipping blast due to missing start or end time:", blast);
      return null; // skip this blast
    }

    // Format expDate to YYYY-MM-DD
    const dateString = new Date(blast.expDate).toISOString().split('T')[0];

    return {
      id: blast._id,
      title: `Blast by ${blast.plannedBy}`,
      start: new Date(`${dateString}T${blast.expStartTime}`),
      end: new Date(`${dateString}T${blast.expEndTime}`),
      type: 'blast',
      details: blast,
    };
  }).filter(blast => blast !== null); // Remove nulls

  // Process events
  const unifiedEvents = events.map(event => {
    // Validate: time should exist
    if (!event.time) {
      console.warn("Skipping event due to missing time:", event);
      return null; // skip this event
    }

    // Format event date to YYYY-MM-DD
    const dateString = new Date(event.date).toISOString().split('T')[0];

    const eventStart = new Date(`${dateString}T${event.time}`);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // Add 1 hour for end time

    return {
      id: event._id,
      title: event.name,
      start: eventStart,
      end: eventEnd,
      type: 'event',
      details: event,
    };
  }).filter(event => event !== null); // Remove nulls

  // Combine blasts and events
  return [...unifiedBlasts, ...unifiedEvents];
};
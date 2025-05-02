// utils/checkConflicts.js
export const checkConflicts = (newEvent, existingEvents) => {
    return existingEvents.filter(event => {
      return (
        newEvent.start < event.end && newEvent.end > event.start
      );
    });
  };
  
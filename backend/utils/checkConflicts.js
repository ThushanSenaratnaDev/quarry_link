export const checkConflicts = (date, existingEvents) => {
  if (!date) {
    console.warn("No valid date provided for conflict check.");
    return [];
  }

  // Force input date string (assumed YYYY-MM-DD) to Date object
  const inputDate = new Date(date + "T00:00:00"); // Always valid format

  if (isNaN(inputDate.getTime())) {
    console.warn("Invalid date provided for conflict check:", date);
    return [];
  }

  const targetDate = inputDate.toISOString().split('T')[0]; // safe now

  return existingEvents.filter(event => {
    if (!event.start) return false;

    const eventDateObj = new Date(event.start);

    if (isNaN(eventDateObj.getTime())) {
      console.warn("Invalid event date detected:", event.start);
      return false;
    }

    const year = eventDateObj.getFullYear();
    const month = (eventDateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = eventDateObj.getDate().toString().padStart(2, '0');
    const formattedEventDate = `${year}-${month}-${day}`;

    return formattedEventDate === targetDate;
  });
};
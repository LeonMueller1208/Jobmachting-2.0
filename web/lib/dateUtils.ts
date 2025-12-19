/**
 * Formats a date in WhatsApp-style format
 * - Today: "Heute, HH:MM"
 * - Yesterday: "Gestern, HH:MM"
 * - This week: "DayName, HH:MM" (e.g., "Montag, 14:30")
 * - Older: "DD.MM.YYYY, HH:MM"
 */
export function formatLastMessageTime(date: Date | string): string {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
  const timeString = messageDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Today
  if (messageDay.getTime() === today.getTime()) {
    return `Heute, ${timeString}`;
  }
  
  // Yesterday
  if (messageDay.getTime() === yesterday.getTime()) {
    return `Gestern, ${timeString}`;
  }
  
  // This week (last 7 days)
  const daysDiff = Math.floor((today.getTime() - messageDay.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const dayName = dayNames[messageDate.getDay()];
    return `${dayName}, ${timeString}`;
  }
  
  // Older than a week
  const dateString = messageDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return `${dateString}, ${timeString}`;
}

/**
 * Formats a date for "Chat gestartet" display
 * Returns: "DD.MM.YYYY" or "DD.MM.YYYY, HH:MM" if same day
 */
export function formatChatStartDate(date: Date | string): string {
  const chatDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());
  
  // If chat was started today, show time too
  if (chatDay.getTime() === today.getTime()) {
    return chatDate.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Otherwise just date
  return chatDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}


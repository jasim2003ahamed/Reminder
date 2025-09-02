// utils/messageBuilder.js
const buildReminderMessage = ({ title, notes }) => {
  return `🔔 Reminder: ${title}\n📝 Notes: ${notes || 'No notes provided.'}`;
};

export default buildReminderMessage;

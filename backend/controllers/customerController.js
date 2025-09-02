import Customer from '../models/Customer.js';
import scheduleReminders from '../utils/scheduleReminder.js';

export const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updated.reminderDate) {
      scheduleReminders(updated);
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

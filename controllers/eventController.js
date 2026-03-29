const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    // Dynamically calculate slots left for each event
    const eventsWithSlots = await Promise.all(
      events.map(async (event) => {
        const approvedCount = await Registration.countDocuments({
          eventId: event._id,
          status: 'Approved',
        });
        const slotsLeft = event.capacity - approvedCount;
        
        // Dynamic Status Label
        let statusLabel = 'Open';
        if (slotsLeft <= 0) statusLabel = 'Full';
        else if (slotsLeft <= 5) statusLabel = 'Few Slots Left';

        return {
          ...event._doc,
          slotsLeft: slotsLeft < 0 ? 0 : slotsLeft,
          statusLabel,
          isFull: slotsLeft <= 0,
        };
      })
    );

    res.status(200).json({ status: 'success', results: events.length, data: { events: eventsWithSlots } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const approvedCount = await Registration.countDocuments({
      eventId: event._id,
      status: 'Approved',
    });
    const slotsLeft = event.capacity - approvedCount;

    res.status(200).json({
      status: 'success',
      data: {
        event: {
          ...event._doc,
          slotsLeft: slotsLeft < 0 ? 0 : slotsLeft,
          isFull: slotsLeft <= 0,
        },
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: 'Event not found' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({ status: 'success', data: { event: newEvent } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { event } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

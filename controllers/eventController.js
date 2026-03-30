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
        const slotsLeft = (event.capacity || 0) - approvedCount;
        
        // Handle backward compatibility in mapping fee to price if needed
        const eventData = event._doc;
        if (!eventData.price && eventData.fee) {
          eventData.price = eventData.fee;
        }

        return {
          ...eventData,
          slotsLeft: slotsLeft < 0 ? 0 : slotsLeft,
          isFull: slotsLeft <= 0,
        };
      })
    );

    res.status(200).json({ status: 'success', data: { events: eventsWithSlots } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new Error('Event not found');

    const approvedCount = await Registration.countDocuments({
      eventId: event._id,
      status: 'Approved',
    });
    const slotsLeft = (event.capacity || 0) - approvedCount;

    const eventData = event._doc;
    if (!eventData.price && eventData.fee) {
      eventData.price = eventData.fee;
    }

    res.status(200).json({
      status: 'success',
      data: {
        event: {
          ...eventData,
          slotsLeft: slotsLeft < 0 ? 0 : slotsLeft,
          isFull: slotsLeft <= 0,
        },
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ status: 'success', data: { event } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) throw new Error('Event not found');
    res.status(200).json({ status: 'success', data: { event } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) throw new Error('Event not found');
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

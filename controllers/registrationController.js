const Registration = require('../models/Registration');
const Event = require('../models/Event');
const axios = require('axios');

exports.createRegistration = async (req, res) => {
  try {
    const { eventId, age, emergencyContact, hasParticipatedBefore, medicalConditions } = req.body;

    // Check if slots are available
    const event = await Event.findById(eventId);
    const approvedCount = await Registration.countDocuments({ eventId, status: 'Approved' });
    const slotsLeft = event.capacity - approvedCount;

    if (slotsLeft <= 0) {
      return res.status(400).json({ status: 'fail', message: 'Sorry, slots are full for this event!' });
    }

    const newRegistration = await Registration.create({
      userId: req.user._id,
      eventId,
      formData: { age, emergencyContact, hasParticipatedBefore, medicalConditions },
      paymentProofUrl: req.file.path, // Cloudinary URL from multer
      status: 'Pending',
    });

    res.status(201).json({ status: 'success', data: { registration: newRegistration } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id }).populate('eventId');
    res.status(200).json({ status: 'success', data: { registrations } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Get all registrations with filtering
exports.getAllRegistrations = async (req, res) => {
  try {
    const { event, status, search } = req.query;
    let query = {};

    if (event) query.eventId = event;
    if (status) query.status = status;

    let registrations = await Registration.find(query).populate('userId').populate('eventId');

    if (search) {
      registrations = registrations.filter((reg) =>
        reg.userId.name.toLowerCase().includes(search.toLowerCase()) || 
        reg.userId.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({ status: 'success', results: registrations.length, data: { registrations } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Bulk update status
exports.bulkUpdateRegistrations = async (req, res) => {
  try {
    const { ids, status } = req.body;
    await Registration.updateMany({ _id: { $in: ids } }, { status });

    // Secondary logging: Sync with Google Sheets via Webhook
    if (status === 'Approved' && process.env.GOOGLE_SHEETS_WEBHOOK) {
      const approvedRegs = await Registration.find({ _id: { $in: ids }, status: 'Approved' })
        .populate('userId')
        .populate('eventId');
        
      for (const reg of approvedRegs) {
        try {
          await axios.post(process.env.GOOGLE_SHEETS_WEBHOOK, {
            name: reg.userId.name,
            email: reg.userId.email,
            event: reg.eventId.title,
            status: 'Approved',
            date: reg.createdAt,
          });
        } catch (webhookErr) {
          console.error('Webhook error:', webhookErr.message);
        }
      }
    }

    res.status(200).json({ status: 'success', message: `Bulk updated ${ids.length} registrations to ${status}` });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

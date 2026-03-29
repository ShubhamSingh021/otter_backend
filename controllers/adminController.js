const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'user' });
    const activeEvents = await Event.countDocuments({ date: { $gte: new Date() } });
    const pendingTasks = await Registration.countDocuments({ status: 'Pending' });

    res.status(200).json({
      status: 'success',
      data: {
        totalMembers,
        activeEvents,
        pendingTasks,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const members = await Registration.find(query)
      .populate('userId', 'name email')
      .populate('eventId', 'title')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: members.length,
      data: {
        members,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.updateMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const registration = await Registration.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({ status: "error", message: 'Registration not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        registration,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
    try {
      const { ids, status } = req.body;
  
      await Registration.updateMany(
        { _id: { $in: ids } },
        { status }
      );
  
      res.status(200).json({
        status: 'success',
        message: `Successfully updated ${ids.length} registrations to ${status}`,
      });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };

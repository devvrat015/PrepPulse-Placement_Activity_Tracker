const Activity = require('../models/Activity');

exports.createActivity = async (req, res) => {
  try {
    const { date, type, duration, confidenceLevel, notes } = req.body;

    if (!date || !type || duration === undefined || !confidenceLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const activity = new Activity({
      userId: req.userId,
      date,
      type,
      duration,
      confidenceLevel,
      notes: notes || '',
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId }).sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeeklyActivities = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activities = await Activity.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

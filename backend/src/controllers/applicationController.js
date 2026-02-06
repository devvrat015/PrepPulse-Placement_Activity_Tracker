const Application = require('../models/Application');

exports.createApplication = async (req, res) => {
  try {
    const { companyName, role, status, appliedDate } = req.body;

    if (!companyName || !role || !appliedDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const application = new Application({
      userId: req.userId,
      companyName,
      role,
      status: status || 'APPLIED',
      appliedDate,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({
      appliedDate: -1,
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { companyName, role, status, appliedDate } = req.body;

    if (companyName) application.companyName = companyName;
    if (role) application.role = role;
    if (status) application.status = status;
    if (appliedDate) application.appliedDate = appliedDate;

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const { FraudAlert, Transaction } = require('../models/associations');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await FraudAlert.findAll({ 
      where: { userId: req.user.id },
      include: [Transaction],
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.reviewAlert = async (req, res) => {
  try {
    const { status } = req.body;
    let alert = await FraudAlert.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.status = status;
    await alert.save();
    res.json(alert);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const Memdata = require('../models/memdataModel');
const DesignationCount = require('../models/designationCounts.Model');
const moment = require('moment');

const determineDesignation = (email) => {
  if (email.endsWith('@students.iitmandi.ac.in')) {
    return email.toLowerCase().startsWith('b') ? 'B-Tech' : 'PHD/M-Tech';
  } else if (email.endsWith('@iitmandi.ac.in') || email.endsWith('@projects.iitmandi.ac.in')) {
    return 'Faculty/Staff';
  } else {
    return 'Unknown';
  }
};

const updateDesignationCounts = async (req, res) => {
  try {
    const memtypePricing = {
      base: 100,
      silver: 200,
      gold: 300,
      diamond: 400
    };

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JS
    const currentYear = currentDate.getFullYear();

    // Fetch all users
    const users = await Memdata.find();

    // Initialize a map to store designation data
    const designationData = new Map();

    // Iterate over each user to determine designation and accumulate totals
    users.forEach((user) => {
      const designation = determineDesignation(user.email);
      const price = memtypePricing[user.memtype] || 0;

      // Parse the purchase date to get the month and year
      const purchaseDate = moment(user.purchasedate, 'DD-MM-YYYY');
      const purchaseMonth = purchaseDate.month() + 1;
      const purchaseYear = purchaseDate.year();

      // Key for storing month-wise data
      const key = `${designation}-${purchaseMonth}-${purchaseYear}`;

      if (designationData.has(key)) {
        const data = designationData.get(key);
        data.count += 1;
        data.totalAmount += price;
        data.memtypeCounts[user.memtype] = (data.memtypeCounts[user.memtype] || 0) + 1;
      } else {
        designationData.set(key, {
          designation,
          count: 1,
          totalAmount: price,
          memtypeCounts: {
            base: user.memtype === 'base' ? 1 : 0,
            silver: user.memtype === 'silver' ? 1 : 0,
            gold: user.memtype === 'gold' ? 1 : 0,
            diamond: user.memtype === 'diamond' ? 1 : 0
          },
          month: purchaseMonth,
          year: purchaseYear
        });
      }
    });

    // Reset the counts in the DesignationCount collection
    await DesignationCount.deleteMany({});

    // Convert the map to an array of bulk update operations
    const bulkOps = Array.from(designationData.entries()).map(([key, data]) => ({
      updateOne: {
        filter: { designation: data.designation, month: data.month, year: data.year },
        update: {
          $set: { 
            count: data.count,
            totalAmount: data.totalAmount,
            memtypeCounts: data.memtypeCounts
          }
        },
        upsert: true
      }
    }));

    // Execute bulk update
    await DesignationCount.bulkWrite(bulkOps);

    res.status(200).send('Monthly designation counts and total amounts updated successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getMonthlyDesignationCounts = async (req, res) => {
  try {
    const { month, year } = req.query;

    const counts = await DesignationCount.find({ month: parseInt(month), year: parseInt(year) });

    res.status(200).json(counts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  updateDesignationCounts,
  getMonthlyDesignationCounts
};

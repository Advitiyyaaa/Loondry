const cron = require("node-cron");
const Slip = require("../models/slip");

// Runs every day at 10:00 PM
cron.schedule("0 22 * * *", async () => {
  try {
    const result = await Slip.deleteMany({ status: "Slip-Created" });
    console.log(`Deleted ${result.deletedCount} stale slip/slips`);
  } catch (err) {
    console.error("Slip cleanup failed:", err.message);
  }
});

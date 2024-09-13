import User from "../models/user.model.js";
import cron from "node-cron";

cron.schedule("0 0 * * *", async () => {
  try {
    const thresholdDateForDeactivated = new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ); // 30 days ago
    const thresholdDateForUnverified = new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ); // 15 days ago

    const deletedDeactivatedUsers = await User.deleteMany({
      active: false,
      deActivatedAt: { $lte: thresholdDateForDeactivated },
    });

    console.log(
      `${deletedDeactivatedUsers.deletedCount} old deactivated accounts deleted successfully.`
    );

    const deletedUnverifiedUsers = await User.deleteMany({
      isVerified: false,
      createdAt: { $lte: thresholdDateForUnverified },
    });

    console.log(
      `${deletedUnverifiedUsers.deletedCount} unverified accounts deleted successfully.`
    );
  } catch (error) {
    console.error("Error deleting old deactivated accounts:", error);
  }
});

// cron.schedule("* * * * *", async () => {
//   try {
//     // const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
//     const thresholdDate = new Date(Date.now() - 60 * 1000); // 30 days ago

//     // Delete users who are deactivated and were deactivated more than 30 days ago
//     await User.deleteMany({
//       active: false,
//       deActivatedAt: { $lte: thresholdDate },
//     });

//     console.log("Old deactivated accounts deleted successfully.");
//   } catch (error) {
//     console.error("Error deleting old deactivated accounts:", error);
//   }
// });

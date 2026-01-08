import cron from "node-cron";
import emailService from "../service/emailService.js";
import { Task } from "../models/task.js";
import { HttpError } from "../helpers/HttpError.js";

cron.schedule("* * * * *", async () => {
  const nowDate = new Date();
  const tasks = await Task.find({
    notifications: { $exists: true, $ne: [] },
  }).populate("owner");
  if (!tasks) {
    throw HttpError(404);
  }

  for (const task of tasks) {
    for (let i = 0; i < task.notifications.length; i++) {
      const minutesBefore = task.notifications[i];
      const notifSent = task.notificationSent[i];
      const notifTime = new Date(
        task.date.getTime() - minutesBefore * 60 * 1000
      );
      console.log(notifTime);

      if (!notifSent && nowDate >= notifTime) {
        await emailService.terminNotifications(task.owner.email);
        await Task.findByIdAndUpdate(task.id, { notificationSent: notifSent });
      }
    }
  }
});

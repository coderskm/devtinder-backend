const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("0 8 * * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequestsOfYesterday = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequestsOfYesterday.map(req => req.toUserId.emailId))];

        for (const email of listOfEmails) {
           try {
             const res = await sendEmail.run(
               "New Friend Requests pending for " + email,
               "There are so many friend requests pending, please login to devvtinderr.com and accept or reject the requests."
             );
             console.log(res);
           } catch (err) {
             console.log(err);
           }

        }
    } catch (error) {
        console.log(err);
    }
})
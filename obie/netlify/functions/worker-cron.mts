import type { Config } from "@netlify/functions";

// Backup trigger for the task worker: every minute, run any tasks that are
// ready but weren't picked up (say the owner closed the app mid-plan). The
// app also triggers the worker after every change, so this is a safety net.
async function workerCron() {
  const site = Netlify.env.get("URL");
  const secret = Netlify.env.get("CRON_SECRET");
  if (!site || !secret) {
    console.log("worker-cron skipped: URL or CRON_SECRET missing");
    return;
  }
  const res = await fetch(`${site}/api/worker`, { headers: { authorization: `Bearer ${secret}` } });
  console.log("worker-cron", res.status, await res.text());
}

export default workerCron;

export const config: Config = {
  schedule: "* * * * *", // every minute (UTC)
};

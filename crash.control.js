const pm2 = require("pm2");
const { exec } = require("child_process");
const processIds = require("./config");

// Interval between checks in milliseconds (e.g., 30 seconds)
const CHECK_INTERVAL = 30000;

// Function to check PM2 processes and restart if necessary
function checkAndRestartPM2Processes() {
  pm2.connect((err) => {
    if (err) {
      console.error("Error connecting to PM2:", err);
      process.exit(2);
    }

    pm2.list((err, processList) => {
      if (err) {
        console.error("Error listing PM2 processes:", err);
        pm2.disconnect();
        return;
      }
      // console.log(processList)
      processList.forEach((proc) => {
        // console.log("ls", proc.pm_id);
        if (processIds.includes(proc.pm_id)) {
          console.log(proc.pm_id);
          if (proc.pm2_env.status == "online") {
            console.log(proc.pm2_env.status);
          }
          if (proc.pm2_env.status !== "online") {
            console.log(
              `Process ${proc.name} (ID: ${proc.pm_id}) is ${proc.pm2_env.status}. Restarting...`
            );
            // pm2.restart(proc.pm_id, (err) => {
            //   console.log("I am here")
            //   if (err) {
            //     console.log(
            //       `Failed to restart process ${proc.name} (ID: ${proc.pm_id}):`,
            //       err
            //     );
            //   } else {
            //     console.log(
            //       `Successfully restarted process ${proc.name} (ID: ${proc.pm_id})`
            //     );
            //   }
            // });
          restart(proc.pm_id)
          }
        }
      });

      pm2.disconnect();
    });
  });
}

// Continuous monitoring loop
console.log("I'm working");
setInterval(checkAndRestartPM2Processes, CHECK_INTERVAL);

// Initial check
checkAndRestartPM2Processes();
function restart(processId) {
  try {
    exec(`pm2 restart ${processId}`, (error) => {
      if (error) {
        console.log(error.message)
        return;
      }
      console.log(`Restated succesfully ${processId}`)
    });
  } catch (err) {
    console.log(err);
  }
}

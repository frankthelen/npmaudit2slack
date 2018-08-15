const intercept = require('intercept-stdout');
const npm = require('npm');
const Slack = require('slack-node');
const util = require('util');

const slack = new Slack();

module.exports = {
  npmaudit: async () => { // eslint-disable-line arrow-body-style
    return new Promise((resolve, reject) => {
      let result = '';
      const unhook = intercept((txt) => {
        result += txt;
      });
      npm.load({ json: true }, (err) => {
        if (err) {
          unhook();
          return reject(err);
        }
        npm.commands.audit([], (err2) => {
          unhook();
          if (err2) {
            return reject(err2);
          }
          try {
            const json = JSON.parse(result);
            return resolve(json);
          } catch (err3) {
            return reject(err3);
          }
        });
        // npm.on('log', (message) => {
        //   console.log(message);
        // });
        return true;
      });
    });
  },
  slack: async (webhookuri, message) => {
    slack.setWebhook(webhookuri);
    await util.promisify(slack.webhook)(message);
  },
};

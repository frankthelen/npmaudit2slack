const Promise = require('bluebird');
const service = require('./service');

const audit = async ({
  name, webhookuri, username, emoji, branch, reluctant,
}) => Promise.try(async () => {
  const result = await service.npmaudit();
  const { metadata = {}, advisories = {} } = result;
  const {
    vulnerabilities = {},
    // dependencies = 0,
    // devDependencies = 0,
    // optionalDependencies = 0,
    // totalDependencies = 0,
  } = metadata;
  const {
    // info = 0,
    low = 0,
    moderate = 0,
    high = 0,
    critical = 0,
  } = vulnerabilities;

  const list = Object.values(advisories);
  const line = (item) => {
    const { title, module_name: moduleName, findings } = item;
    const dev = findings.reduce((acc, f) => acc || f.dev, false);
    const prod = findings.reduce((acc, f) => acc || f.bundled, false);
    const suffix = [prod ? 'prod' : null, dev ? 'dev' : null].filter(n => n).join(', ');
    const suffix2 = suffix ? ` (${suffix})` : '';
    return `*${moduleName}*${suffix2} - ${title}`;
  };
  const text = severity => list
    .filter(item => item.severity === severity)
    .reduce((acc, item) => `${acc}${line(item)}\n`, '');
  const attachments = [];
  if (critical) {
    attachments.push({
      pretext: 'critical security vulnerabilities :fire:',
      text: text('critical'),
      color: 'danger',
    });
  }
  if (high) {
    attachments.push({
      pretext: 'high security vulnerabilities :scream:',
      text: text('high'),
      color: 'danger',
    });
  }
  if (moderate) {
    attachments.push({
      pretext: 'moderate security vulnerabilities :grimacing:',
      text: text('moderate'),
      color: 'warning',
    });
  }
  if (low) {
    attachments.push({
      pretext: 'low security vulnerabilities :smile:',
      text: text('low'),
      color: 'good',
    });
  }
  if (!attachments.length && !reluctant) {
    attachments.push({
      text: 'No security vulnerabilities. Very good! :heart:',
      color: 'good',
    });
  }
  if (!attachments.length) {
    return; // nothing to do
  }
  const branchText = branch ? ` [${branch}]` : '';
  await service.slack(webhookuri, {
    username,
    icon_emoji: emoji,
    text: `*${name}${branchText}* security status`,
    attachments,
  });
});

module.exports = audit;

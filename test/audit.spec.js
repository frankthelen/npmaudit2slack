const assert = require('assert');
const service = require('../src/service');
const audit = require('../src/audit');
require('./setupTests');

describe('audit / unmocked', () => {
  it('should fail if `name` is undefined', async () => {
    try {
      await audit();
      assert.fail('ooops');
    } catch (error) {
      expect(error.name).to.be.equal('TypeError');
    }
  });

  it('should fail if `webhookuri` is undefined', async () => {
    try {
      await audit({ name: 'test' });
      assert.fail('ooops');
    } catch (error) {
      expect(error.message).to.be.equal('options.uri is a required argument');
    }
  });

  xit('should fail if `webhookuri` is not valid', async () => {
    try {
      await audit({ name: 'test', webhookuri: 'test' });
      assert.fail('ooops');
    } catch (error) {
      expect(error.message).to.be.equal('Invalid URI "test"');
    }
  });

  xit('should succeed if `webhookuri` is valid', async function test() {
    this.timeout(10000);
    const webhookuri = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
    await audit({ name: 'test', webhookuri });
  });
});

describe('audit / mocked', () => {
  const webhookuri = 'http://localhost:9876';
  const testcase = {
    none: {},
  };

  beforeEach(function () { // eslint-disable-line func-names, prefer-arrow-callback
    const { title } = this.test.ctx.currentTest;
    const variant = title && title.match(/([^\s]+)$/)[1]; // e.g., `minor`
    sinon.stub(service, 'slack').resolves();
    sinon.stub(service, 'npmaudit').resolves({ get: () => testcase[variant] || [] });
  });

  afterEach(() => {
    service.slack.restore();
    service.npmaudit.restore();
  });

  it('should call npm-check and post to Slack', async () => {
    await audit({ name: 'test', webhookuri });
    expect(service.slack.calledOnce).to.be.true;
    expect(service.npmaudit.calledOnce).to.be.true;
  });

  it('should create Slack message / none', async () => {
    await audit({ name: 'test', webhookuri });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('attachments');
    const { attachments } = message;
    expect(attachments).to.have.lengthOf(1);
    expect(attachments[0]).to.have.property('color', 'good');
    expect(attachments[0]).to.not.have.property('pretext');
    expect(attachments[0]).to.have.property('text', 'No security vulnerabilities. Very good! :heart:');
  });

  it('should create Slack message with branch / none', async () => {
    await audit({ name: 'test', webhookuri, branch: 'master' });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('text', '*test [master]* security status');
  });

  it('should not create Slack message if all up-to-date and reluctant / update none', async () => {
    await audit({ name: 'test', webhookuri, reluctant: true });
    expect(service.slack.calledOnce).to.be.false;
    expect(service.npmaudit.calledOnce).to.be.true;
  });

  xit('should create Slack message if not all up-to-date and reluctant / update major', async () => {
    await audit({ name: 'test', webhookuri, reluctant: true });
    expect(service.slack.calledOnce).to.be.true;
    expect(service.npmaudit.calledOnce).to.be.true;
  });
});

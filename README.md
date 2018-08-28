# npmaudit2slack

Runs `npm audit` in the current working directory and posts the results to Slack.

[![Build Status](https://travis-ci.org/frankthelen/npmaudit2slack.svg?branch=master)](https://travis-ci.org/frankthelen/npmaudit2slack)
[![Coverage Status](https://coveralls.io/repos/github/frankthelen/npmaudit2slack/badge.svg?branch=master)](https://coveralls.io/github/frankthelen/npmaudit2slack?branch=master)
[![dependencies Status](https://david-dm.org/frankthelen/npmaudit2slack/status.svg)](https://david-dm.org/frankthelen/npmaudit2slack)
[![Greenkeeper badge](https://badges.greenkeeper.io/frankthelen/npmaudit2slack.svg)](https://greenkeeper.io/)
[![Maintainability](https://api.codeclimate.com/v1/badges/3291daaa0f241b65857d/maintainability)](https://codeclimate.com/github/frankthelen/npmaudit2slack/maintainability)
[![node](https://img.shields.io/node/v/npmaudit2slack.svg)]()
[![code style](https://img.shields.io/badge/code_style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript)
[![License Status](http://img.shields.io/npm/l/npmaudit2slack.svg)]()

## Install

```bash
npm install -g npmaudit2slack
```

Or run without installation
```bash
npx npmaudit2slack --help
```

## Usage

```bash
npmaudit2slack --help

  Usage: npmaudit2slack [options] <webhookuri>

  Options:
    -v, --version              output the version number
    -u, --username <username>  username to be displayed in Slack, defaults to channel settings
    -e, --emoji <emoji>        emoji to be displayed in Slack, e.g., ":ghost:", defaults to channel settings
    -b, --branch <branch>      branch name to be displayed in Slack
    -r, --reluctant            do not send any message if there are no vulnerabilities
    -h, --help                 output usage information
```

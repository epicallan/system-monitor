const mailer = require('./mailer');
const http = require('request');
const domains = require('./configs/domains');
const cheerio = require('cheerio');

const INTERVAL = 60000 * 5; // check every after 5 mins

const sendAlert = ({ message, domain }) =>
  mailer(`domain is down, check server!! ${message}`, domain.link, domain.emails);

const checkLinkHasRightContent = (domain, body) => {
  const dom = cheerio.load(body);
  const tag = Object.keys(domain.html)[0];
  const expectedText = dom(tag).text();
  return expectedText.includes(domain.html[tag]);
};

/* eslint-disable no-unused-expressions */
const domainStatus = ({ statusCode, body, domain }) =>
  new Promise((resolve, reject) => {
    if (statusCode !== 200) reject({ statusCode, domain });
    if (domain.html) {
      const hasExpectedText = checkLinkHasRightContent(domain, body);
      hasExpectedText ? resolve(`${domain.link} is alive`) :
          reject({ message: ' or is showing error page', domain });
    } else {
      resolve(`${domain.link} is alive`);
    }
  });

const createLink = domain => `http://${domain.host}:${domain.port || 80}`;

const addLink = domain => Object.assign(domain, { link: createLink(domain) });

const httpGet = domain => new Promise((resolve) => {
  http(domain.link, (error, response, body) => {
    if (error) {
      sendAlert({ message: 'domain is inaccessible', domain });
    } else {
      const statusCode = response.statusCode;
      resolve({ statusCode, body, domain });
    }
  });
});

const logger = (message) => {
  if (process.env.NODE_ENV === 'development') return console.log(message);
  return message;
};

module.exports = () => setInterval(() => {
  domains
        .map(addLink)
        .map(httpGet)
        .map(promise => promise.then(domainStatus))
        .map(promise => promise.then(logger).catch(sendAlert));
}, INTERVAL);

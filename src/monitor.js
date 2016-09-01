const mailer = require('./mailer');
const http = require('request');
const domains = require('./configs/domains');
const cheerio = require('cheerio');

const sendAlert = ({ message, domain }) =>
  mailer(`domain is down, check server!! ${message}`, domain);

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
      if (hasExpectedText) {
        resolve({ message: 'domain is alive', domain });
      } else {
        reject({ message: ' domain is probably showing an error page', domain });
        sendAlert({ message: ' domain is inaccessible', domain });
      }
    } else {
      resolve({ message: 'domain is alive', domain });
    }
  });

const createLink = domain => `http://${domain.host}:${domain.port || 80}`;

const addLink = domain => Object.assign(domain, { link: createLink(domain) });

const httpGet = domain => new Promise((resolve, reject) => {
  http(domain.link, (error, response, body) => {
    if (error) {
      sendAlert({ message: error, domain });
      reject({ message: error, domain });
    } else {
      const statusCode = response.statusCode;
      if (statusCode === 200) {
        resolve({ statusCode, body, domain });
      } else {
        reject({ message: `domain status code is ${statusCode}`, domain });
        sendAlert({ message: `domain is off with status code ${statusCode}`, domain });
      }
    }
  });
});

const logger = ({ message, domain }) =>
    new Promise(resolve => resolve(`${domain.link} :  ${message}`));

const throwPromise = obj => new Promise(resolve => resolve(obj));

module.exports = () =>
  domains
        .map(addLink)
        .map(httpGet)
        .map(promise => promise.then(domainStatus).catch(throwPromise))
        .map(promise => promise.then(logger).catch(logger));

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
const domainStatus = ({ body, domain }) =>
  new Promise((resolve, reject) => {
    if (domain.html) {
      if (checkLinkHasRightContent(domain, body)) {
        resolve({ message: 'domain is alive', domain });
      } else {
        const message = ' domain is probably showing an error page';
        reject({ message, domain });
        sendAlert({ message, domain });
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
        resolve({ body, domain });
      } else {
        const message = `domain is off with status code ${statusCode}`;
        reject({ message, domain });
        sendAlert({ message, domain });
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

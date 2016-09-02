module.exports = [{
  port: 80,
  host: 'data.devinit.org',
  emails: ['allan.lukwago@devinit.org', 'epicallan.al@gmail.com'],
  html: { p: 'The Development Data Hub' } // optional
},
{
  port: 9999,
  host: 'data.devinit.org',
  emails: ['allan.lukwago@devinit.org', 'epicallan.al@gmail.com'],
  html: { p: 'The Development Data Hub' } // optional
},
{
  port: 80,
  host: 'data.devinit.org',
  emails: ['allan.lukwago@devinit.org', 'epicallan.al@gmail.com'],
  // should report failure coz we dont have an h2 tag with that copy
  html: { h2: 'The Development Data Hub' }
},
{
  port: 8080,
  host: 'data.devinit.org',
  emails: ['allan.lukwago@devinit.org'],
  html: { '.navigation__item-title': 'Our work' } // optional
}];

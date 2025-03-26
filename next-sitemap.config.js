/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.indiainresearch.org',
    generateRobotsTxt: true, 
    generateIndexSitemap: false,
    changefreq: 'daily'
  }
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://indiainresearch.org',
    generateRobotsTxt: true, 
    generateIndexSitemap: false,
    changefreq: 'monthly'
  }
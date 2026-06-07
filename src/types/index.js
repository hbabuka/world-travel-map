/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} [avatar_url]
 * @property {string} [display_name]
 */

/**
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} user_id
 * @property {string} title
 * @property {string} country_code   - ISO 3166-1 alpha-2
 * @property {string} country_name
 * @property {string} [start_date]
 * @property {string} [end_date]
 * @property {string} [notes]
 * @property {string[]} [photo_urls]
 * @property {string} created_at
 */

/**
 * @typedef {Object} CountryStats
 * @property {number} visited
 * @property {number} total
 * @property {number} percentage
 */

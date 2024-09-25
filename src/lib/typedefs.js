/**
 * @typedef {Object} Task
 * @property {number | null} id
 * @property {string | null} name
 * @property {string | null} status
 * @property {string | null} priority
 * @property {string | null} [description]
 * @property {number | null} projectId
 * @property {Comment[]} comments
 */

/**
 * @typedef {Object} Project
 * @property {number | null} id
 * @property {string | null} name
 * @property {string | null} picture
 * @property {number | null} [percentage]
 * @property {number | null} authorId
 * @property {boolean| null} remind
 * @property {Date | string | null} deadline
 * @property {Date | string | null} createdAt
 */

/**
 * @typedef {Object} Comment
 * @property {number| null} id
 * @property {number | null} authorId
 * @property {number | null} taskId
 * @property {string | null} body
 * @property {number | null} [likes] // delete
 * @property {Date | string | null} createdAt
 * @property { UserPicNameId | null } author
 */

/**
 * @typedef {Object} UserPicNameId
 * @property {number} id
 * @property {string | null} picture
 * @property {string} username
 */

/**
 * @typedef {Object} Invite
 * @property {number} projectId
 * @property {number} userId
 * @property {Project} project
 */

module.exports = {};

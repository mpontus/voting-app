/**
 * Forwards errors caught during execution of a route to error handling middleware
 *
 * @param {function} fn Route function
 * @returns {function} Wrapped route function
 */
export default fn => (...args) => fn(...args).catch(args[2]);

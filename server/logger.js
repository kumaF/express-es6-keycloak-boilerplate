import log from 'npmlog';

/**
 *  ===== log levels available =====
 * 
 *  - silly
 *  - verbose
 *  - info
 *  - http
 *  - warn
 *  - error
 */

export function logger(msg, level='info') {
    const datetime = new Date().toISOString()
    log.log(level, datetime , msg);
}
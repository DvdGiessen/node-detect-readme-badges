'use strict';

const removeExtension = require('./util/removeExtension');

// https://coveralls.io/repos/github/${user}/${package}/badge.svg?branch=${branch}
// https://coveralls.io/repos/${user}/${package}/badge.svg?branch=${branch}
// https://img.shields.io/coveralls/${user}/${repo}.svg
// https://img.shields.io/coveralls/${user}/${repo}/${branch}.svg

function extractData(url) {
    let match;
    let data;

    if (url.indexOf('img.shields.io') !== -1) {
        match = url.match(/img.shields.io\/coveralls\/(.+)\/(.+).*/);

        if (!match) {
            return null;
        }

        data = { user: match[1], repo: removeExtension(match[2]) };

        // Support branches
        if (data.repo.split('/').length > 1) {
            data.branch = data.repo.split('/')[1];
            data.repo = data.repo.split('/')[0];
        }

        return data;
    }

    match = url.match(/coveralls.io\/(.+)/);

    if (!match) {
        return null;
    }

    // repos/[github]/IndigoUnited/js-promtie/badge.svg -> ['js-promtie', 'IndigoUnited']
    match = match[1].split('/').reverse();
    match.shift();

    return { user: match[1], repo: match[0] };
}

module.exports = function (url) {
    const data = extractData(url.href.split('?')[0]);

    if (!data) {
        return null;
    }

    return {
        url: `https://coveralls.io/repos/${data.user}/${data.repo}/badge.svg`,
        originalUrl: url.href,
        metaUrl: `https://img.shields.io/coveralls/${data.user}/${data.repo}${data.branch ? '/' + data.branch : ''}.json`,
        type: 'coveralls',
    };
};
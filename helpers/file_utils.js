'use strict';
const path = require('path');

function _getConfigName(testFileName) {
	let path_parse = path.parse(testFileName);
	return path.format({
		dir: path_parse.dir,
		name: path_parse.name,
		ext: '.json'
	});
}

module.exports = {
	getConfigName: _getConfigName
};
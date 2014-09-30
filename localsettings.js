/*
 * This is a sample configuration file.
 *
 * Copy this file to localsettings.js and edit that file to fit your needs.
 *
 * Also see the file server.js for more information.
 */

var CitoidConfig = {

	//Set your WorldCat API key here
	wskey: false,

	// Enable debug mode (prints extra debugging messages)
	debug: false,

	// Allow cross-domain requests to the API (default '*')
	// Sets Access-Control-Allow-Origin header
	// enable:
	allowCORS: '*',
	// disable:
	//allowCORS = false;
	// restrict:
	//allowCORS = 'some.domain.org';

	// Allow override of port/interface:
	citoidPort: 1970,
	citoidInterface: 'localhost',

	//Settings for Zotero server
	zoteroPort: 1969,
	zoteroInterface: 'localhost',
};

/*Exports*/
module.exports = {
	CitoidConfig: CitoidConfig
};



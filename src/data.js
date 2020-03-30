const vscode = require("vscode");
const https = require("https");
const { Icon } =  require("./completions");
const meta = require("@mdi/svg/meta.json");
class PackageResponse{
	/** @type {String} */
	id;
	/** @type {String} */
	name;
	/** @type {String} */
	description;
	/** @type {Number} */
	size;
	/** @type {Number} */
	iconCount;
	/**
	 * 
	 * @param {Object} data 
	 */
	constructor(data){
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.size = data.size * 100;
		this.iconCount = data.iconCount;
	}
}
function GetData(){
	return meta.map(m => new Icon(m));
}
module.exports = {
	GetData
};
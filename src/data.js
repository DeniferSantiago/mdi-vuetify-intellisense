const { Icon } =  require("./completions");
const meta = require("@mdi/svg/meta.json");
function GetData(){
	return meta.map(m => new Icon(m));
}
module.exports = {
	GetData
};
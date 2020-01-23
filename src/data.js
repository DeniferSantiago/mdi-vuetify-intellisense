const vscode = require("vscode");
const https = require("https");
const { Icon } =  require("./completions");
/**
 * @param {vscode.ExtensionContext} context 
 */
async function GetData(context){
	return new Promise((res, rej) => {
		try {
			let data = context.workspaceState.get("mdi");
			if(!data){
				var request = https.get("https://materialdesignicons.com/api/package/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B",
				r => {
					var dataString = "";
					r.on("data", chunk => dataString += chunk);
					r.on("end", () => {
						const json = JSON.parse(dataString);
						/**@type{Array} */
						const icons = json.icons;
						data = icons.map(icon => new Icon(icon));
						context.workspaceState.update("mdi", data);
					});
				});
				request.on("error", e => rej(e));
			}
			else{
				data = data.map(iconData => new Icon(iconData));
			}
			res(data);
		}
		catch (error) {
			rej(error);
		}
	});
}
module.exports = {
	GetData
};
const vscode = require('vscode');
const https = require("https");
/**
 * 
 * @param {vscode.ExtensionContext} context 
 */
function activate(context) {
	GetData(context);
	const provider2 = vscode.languages.registerCompletionItemProvider(
		'vue',
		{
			provideCompletionItems(document, position) {
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				let prefix = linePrefix.slice(linePrefix.length - 4);
				if(prefix === "mdi-"){
					console.log("");
				}
				return [];
			}
		},
		'-'
	);
	context.subscriptions.push(provider2);
}
/**
 * 
 * @param {vscode.ExtensionContext} context 
 */
function GetData(context){
	let data = context.workspaceState.get("mdi");
	if(!data){
		var request = https.get("https://materialdesignicons.com/api/package/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B",
		r => {
			var dataString = "";
			r.on("data", chunk => dataString += chunk);
			r.on("end", () => {
				const dataJson = JSON.parse(dataString);
				context.workspaceState.update("mdi", dataJson);
			});
		});
		request.on("error", e => console.error(e));
	}
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

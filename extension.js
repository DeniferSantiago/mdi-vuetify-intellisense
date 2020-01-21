const vscode = require('vscode');
const https = require("https");
/**
 * 
 * @param {vscode.ExtensionContext} context 
 */
function activate(context) {
	GetData(context);
	const provider1 = vscode.languages.registerCompletionItemProvider(
		'vue',
		{
			provideCompletionItems(document, position){
				const start = new vscode.Position(position.line, 0);
				const range = new vscode.Range(start, position);
				const text = document.getText(range);
				const rawClasses = text.match(/icon=["|']([\w- ]*$)/);
				console.log(rawClasses);
				return [];
			}
		}
	)
	const provider2 = vscode.languages.registerCompletionItemProvider(
		'vue',
		{
			provideCompletionItems(document, position) {
				let range = new vscode.Range(new vscode.Position(0,0), position);
				let behindTextReverse = Reverse(document.getText(range));
				if(/^(-|.|\n)*?(>noci-v<)/.test(behindTextReverse)){
					let index = behindTextReverse.indexOf(">");
					let text = behindTextReverse.substring(0, index);
					console.log(Reverse(text));
				}
				else if(/^.*?(("|')=noci)/.test(behindTextReverse)){
					let results = behindTextReverse.match(/('|")/);
					console.log(results);
				}
				/* let prefix = linePrefix.slice(linePrefix.length - 4);
				if(prefix === "mdi-"){
					console.log("");
				} */
				return [];
			}
		},
		'-'
	);
	context.subscriptions.push(provider1, provider2);
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
function Reverse(str) {
	var reverseStr = "";
	for (let i = str.length - 1; i >= 0; i--) {
		const char = str[i];
		reverseStr += char;
	}
	return reverseStr;
}
module.exports = {
	activate,
	deactivate
}

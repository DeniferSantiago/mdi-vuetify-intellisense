const vscode = require("vscode");
const { SetIntellisense, TagIconCompletion, PropsItemCompletion, ResolveCompletion } = require("./src/completions");
const { GetData } = require("./src/data");
/**
 * @param {vscode.ExtensionContext} context 
 */
async function activate(context) {
	SetIntellisense(await GetData(context));
	const provider1 = vscode.languages.registerCompletionItemProvider(
		'vue',
		{
			provideCompletionItems: PropsItemCompletion,
			resolveCompletionItem: ResolveCompletion
		},
		'"', "'", " ", ".", "-"
	);
	const provider2 = vscode.languages.registerCompletionItemProvider(
		'vue',
		{
			provideCompletionItems: TagIconCompletion,
			resolveCompletionItem: ResolveCompletion
		},
		'-'
	);
	context.subscriptions.push(provider1, provider2);
}

// this method is called when your extension is deactivated
function deactivate() {}
module.exports = {
	activate,
	deactivate
};
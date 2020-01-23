const vscode = require("vscode");
const { SetIntellisense, TagIconCompletion, PropsItemCompletion, ResolveCompletion } = require("./src/completions");
const { GetData } = require("./src/data");
const { HoverIconPreview } = require("./src/hover");
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
	const provider3 = vscode.languages.registerHoverProvider(
		'vue',
		{
			provideHover: HoverIconPreview
		}
	);
	context.subscriptions.push(provider1, provider2, provider3);
}

// this method is called when your extension is deactivated
function deactivate() {}
module.exports = {
	activate,
	deactivate
};
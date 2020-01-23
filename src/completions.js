const vscode = require("vscode");
const { Reverse, GetIconData, IconInfo } = require("./helpers");
/**@type {Array<Icon>}*/
var intellisense = [];
/**@param {Array<Icon>} data*/
function SetIntellisense(data){
    intellisense = data;
}
class Icon{
	/**@param {{ name: string; aliases: string[]; data: string; }} data*/
	constructor(data){
		/**@type{String}*/
		this.name = data.name;
		/**@type{Array<String>} */
		this.aliases = data.aliases;
		/**@type{String}*/
		this.data = data.data;
		/**@type{Number} */
		this.sections = this.name.split("-").length;
	}
	/**@param {Number} sections */
	ToCompletionItem(sections){
		sections -= 1; 
		let nameArray = this.name.split("-");
		let completionName = nameArray.slice(sections, nameArray.length).join("-");
		let item = new MyCompletionItem(this.name, vscode.CompletionItemKind.Text, this.name, this);
		item.commitCharacters = ["-"];
		item.insertText = completionName;
		return item;
	}
}
class MyCompletionItem extends vscode.CompletionItem{
	/**
	 * @param {string} label
	 * @param {vscode.CompletionItemKind} kind
	 * @param {String} name
	 * @param {Icon} icon
	 */
	constructor(label, kind, name, icon = null){
		super(label, kind)
		this.name = name;
		this.icon = icon;
	}
}
/**
 * @param {vscode.TextDocument} document 
 * @param {vscode.Position} position 
 */
function TagIconCompletion(document, position) {
    /**@type {Array<vscode.CompletionItem>} */
    let completions = [];
    let range = new vscode.Range(new vscode.Position(0,0), position);
    let behindTextReverse = Reverse(document.getText(range));
    if(/^(-|.|\n)*?(>noci-v<)/.test(behindTextReverse)){
        let index = behindTextReverse.indexOf(">");
        let text = behindTextReverse.substring(0, index);
        let name = Reverse(text);
        if(name.length < 4){
            let mdiCompletion = new MyCompletionItem("mdi", vscode.CompletionItemKind.Text, "mdi");
            mdiCompletion.preselect = true;
            mdiCompletion.range = new vscode.Range(position.line, position.character - 1, position.line, position.character);
            mdiCompletion.commitCharacters = ["-"];
            mdiCompletion.documentation =  new vscode.MarkdownString('Press `-` to get `mdi-`');
            completions.push(mdiCompletion);
        }
        else{
            if(name === "mdi-"){
                completions.push(...intellisense
                    .map(icon => icon.ToCompletionItem(1))
                );
            }
            else{
                const realName = name.substr(4, name.length);
                completions.push(...GetCompletions(realName));
            }
        }
    }
    return completions;
};
/**
 * @param {vscode.TextDocument} document 
 * @param {vscode.Position} position 
 */
function PropsItemCompletion(document, position){
    /**@type {Array<vscode.CompletionItem>} */
    let completions = [];
    const start = new vscode.Position(position.line, 0);
    const range = new vscode.Range(start, position);
    const text = document.getText(range);
    const results = text.match(/icon=["|']([\w- ]*$)/);
    if(results){
        let name = results[1];
        if(name === " "){
            let mdiCompletion = new MyCompletionItem("mdi", vscode.CompletionItemKind.Text, "mdi");
            mdiCompletion.preselect = true;
            mdiCompletion.range = new vscode.Range(position.line, position.character - 1, position.line, position.character);
            mdiCompletion.commitCharacters = ["-"];
            mdiCompletion.documentation =  new vscode.MarkdownString('Press `-` to get `mdi-`');
            completions.push(mdiCompletion);
        }
        else{
            if(name === "mdi-"){
                completions.push(...intellisense
                    .map(icon => icon.ToCompletionItem(1))
                );
            }
            else{
                const realName = name.substr(4, name.length);
                completions.push(...GetCompletions(realName));
            }
        }
    }
    return completions;
};
/**@param {MyCompletionItem} item */
async function ResolveCompletion(item){
	if(item.icon){
		/**@type {IconInfo} */
		const data = await GetIconData(item.icon);
		let doc = new vscode.MarkdownString(`# ${data.name}\n`)
		doc.appendMarkdown(data.icon.value + "\n");
		doc.appendMarkdown(`
		- link: ${data.link.value}\n
		- aliases: ${data.aliases}\n
		`);
		item.documentation = doc;
	}
	return item;
}
/**@param {String} name */
function GetCompletions(name) {
	const sections = name.split("-").length;
	return intellisense.filter(icon => {
		if(icon.sections < sections){
			return false;
		}
		let  b = icon.name.startsWith(name);
		return b;
	}).map(icon => icon.ToCompletionItem(sections));
}
module.exports = {
    ResolveCompletion,
    PropsItemCompletion,
    TagIconCompletion,
    MyCompletionItem,
    Icon,
    SetIntellisense
};
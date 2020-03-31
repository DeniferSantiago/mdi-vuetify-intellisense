const vscode = require("vscode");
const { Reverse, GetIconData, IconInfo } = require("./helpers");
/**@type {Icon[]}*/
var intellisense = [];
/**@param {Icon[]} data*/
function SetIntellisense(data){
    intellisense = data;
}
/**@param {String} name */
function GetIcon(name) {
    return intellisense.find(icon => icon.name === name || !!icon.aliases.find(alias => alias === name));
}
class Icon{
	/**@param {{ name: string; aliases: string[]; tags: string[]; }} data*/
	constructor(data){
		/**@type {String}*/
		this.name = data.name;
		/**@type {string[]} */
		this.aliases = data.aliases;
		/**@type {string[]}*/
		this.tags = data.tags;
		/**@type {Number} */
		this.sections = this.name.split("-").length;
	}
	/** @param {String} text */
	ToCompletionItem(text){
        if(!this.name.startsWith(text))
            return null;
        let sections = text.split("-").length;
		sections--;
        let nameArray = this.name.split("-");
		let completionName = nameArray.slice(sections, nameArray.length).join("-");
		let item = new MyCompletionItem(this.name, vscode.CompletionItemKind.Text, this.name, this);
        item.insertText = completionName;
        item.commitCharacters = ["-"];
		return item;
    }
    /** @param {String} text*/
    ToAllCompletionItem(text){
        let sections = text.split("-").length;
        const itemName = this.ToCompletionItem(text);
        sections--;
        var items = this.aliases
            .filter(alias => alias.startsWith(text))
            .map(alias => {
                let aliasArray = alias.split("-");
                let completionAlias = aliasArray.slice(sections, aliasArray.length).join("-");
                let item = new MyCompletionItem(alias, vscode.CompletionItemKind.Text, alias, this);
                item.insertText = completionAlias;
                item.commitCharacters = ["-"];
                return item;
            });
        if(itemName)
            items.push(itemName);
        return items;
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
        if(name.length < "mdi-".length){
            let mdiCompletion = new MyCompletionItem("mdi", vscode.CompletionItemKind.Text, "mdi");
            mdiCompletion.preselect = true;
            mdiCompletion.range = new vscode.Range(position.line, position.character - 1, position.line, position.character);
            mdiCompletion.commitCharacters = ["-"];
            mdiCompletion.documentation =  new vscode.MarkdownString('Press `-` to get `mdi-`');
            completions.push(mdiCompletion);
        }
        else{
            if(name === "mdi-"){
                completions.push(...GetCompletions(""));
            }
            else{
                let realName = name.slice("mdi-".length, name.length);
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
                completions.push(...GetCompletions(""));
            }
            else{
                const realName = name.substr("mdi-".length, name.length);
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
		let doc = new vscode.MarkdownString(`# ${data.name}\n`);
		doc.appendMarkdown(data.icon.value);
		doc.appendMarkdown(`
		- link: ${data.link.value}
		- aliases: ${data.aliases}
		`);
		item.documentation = doc;
	}
	return item;
}
/**@param {String} name */
function GetCompletions(name) {
    var result = intellisense.filter(icon => {
        const n = icon.name.startsWith(name);
        const a = !!icon.aliases.find(a => a.startsWith(name));
		return n || a;
	}).map(icon => icon.ToAllCompletionItem(name));

	return [].concat(...result);
}
module.exports = {
    ResolveCompletion,
    PropsItemCompletion,
    TagIconCompletion,
    MyCompletionItem,
    Icon,
    SetIntellisense,
    GetIcon
};
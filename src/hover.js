const vscode = require("vscode");
const { GetIcon } = require("./completions");
const { GetIconData, IconInfo } = require("./helpers");
/**
 * 
 * @param {vscode.TextDocument} doc 
 * @param {vscode.Position} pos 
 */
async function HoverIconPreview(doc, pos) {
    const regex = /mdi-((\w|\-)+)/i;
    const range = doc.getWordRangeAtPosition(pos, regex);
    if (!range) {
        return null;
    }
    const text = doc.getText(range);
    const match = regex.exec(text);
    if (!match) {
      return null;
    }
    const name = match[1];
    const icon = GetIcon(name);
    if(icon){
        /**@type {IconInfo} */
        const iconData = await GetIconData(icon);
        let hover = new vscode.Hover(new vscode.MarkdownString(`# ${iconData.name}\n`));
        hover.contents.push(iconData.icon);
        hover.contents.push(`
		* link: ${iconData.link.value}
		* aliases: ${iconData.aliases}
        `);
        return hover;
    }
    return null;
}
module.exports = {
    HoverIconPreview
};
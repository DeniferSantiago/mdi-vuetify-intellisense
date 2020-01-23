const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const { Icon } = require("./completions");
class IconInfo{
    constructor(name, aliases, svgEncode, svg){
        this.aliases = [name, ...aliases].join(", "),
        this.name = name,
        this.link = new vscode.MarkdownString(`[docs](https://materialdesignicons.com/icon/${name})`),
        this.icon = new vscode.MarkdownString(`![preview](${svgEncode})`),
        this.svgIcon =  svg;
    }
}
/**@param {Icon} item */
const GetIconData = (item) => {
    const svgPath = path.normalize(
        path.join(path.normalize(path.join(__dirname, "../node_modules/@mdi/svg/")), "svg", `${item.name}.svg`)
    );
    return new Promise((res, rej) => {
        fs.readFile(svgPath, (error, data) => {
            if (error) {
                vscode.window.showErrorMessage(error.message);
                return rej(error);
            }
            const utf8String = data
                .toString("utf8")
                .replace(/<path/gi, `<path fill="${'#646464'}" `);
            const previewSvg =
                "data:image/svg+xml;utf8;base64," +
                Buffer.from(utf8String).toString("base64") +
                encodeSpaces(` | width=${98} height=${98}`);
            const result = new IconInfo(item.name, item.aliases, previewSvg, utf8String);
            return res(result);
        });
    });
};
/**@param {String} content */
const encodeSpaces = (content) => {
    return content.replace(/ /g, "%20");
};
/**@param {String} str */
function Reverse(str) {
	var reverseStr = "";
	for (let i = str.length - 1; i >= 0; i--) {
		const char = str[i];
		reverseStr += char;
	}
	return reverseStr;
}
module.exports = {
    GetIconData,
    Reverse,
    IconInfo
};

declare class TreeNode {
    /**
     *
     * @param {string} text
     * @param {TreeNode | undefined} parentNode
     */
    constructor(text: string, parentNode: TreeNode | undefined, data: any);
    /** @type {string} */
    text: string;
    /** @type {TreeNode | undefined} */
    parentNode: TreeNode | undefined;
    /** @type {TreeNode[]} */
    parentNodes: TreeNode[];
    /** @type {TreeNode[]} */
    childNodes: TreeNode[];
    /** @type {any} user data */
    data: any;
    get nestCount(): number;
    get isRoot(): boolean;
    /**
     * @param {(v:TreeNode)=>void} cb
     */
    forEach(cb: (v: TreeNode) => void): void;
    toArray(ary: any): TreeNode[];
}
declare class NestedTextParser {
    static getNestCount(line: any, divider: any): number;
    static parse(text: any): any[];
}

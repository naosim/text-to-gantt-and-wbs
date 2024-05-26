/** 
 * @typedef {Object} JSGanttTaskData
 * @property {string} pID
 * @property {string} pName
 * @property {string} pStart
 * @property {string} pEnd
 * @property {string} pRes
 * @property {any} pParent
 * @property {string} pClass
 * @property {number} pOpen
 * @property {string} pNotes
 */


class TreeNodeToJSGanttDataConvertor {
  static autoIdIndex = 1;
  static resetAutoIdIndex() {
    TreeNodeToJSGanttDataConvertor.autoIdIndex = 1;
  }
  static createAutoId() {
    return TreeNodeToJSGanttDataConvertor.autoIdIndex++;
  }
  static convertMap = {
    "start": "pStart", 
    "s": "pStart",
    "end": "pEnd",
    "e": "pEnd",
    "res": "pRes",
    "r": "pRes",
    "comp": "pComp",
    "c": "pComp",
    "depend": "pDepend",
    "dep": "pDepend",
    "note": "pNotes",
    "notes": "pNotes",
    "ID": "pID",
    "id": "pID",
  }
  /**
   * 
   * @param {string} text 
   * @param {any} parentID
   */
  static parse(text, parentID) {
    /** @type {JSGanttTaskData} */
    var data;
    if(text.indexOf("//") != -1) {
      var [pName, dataText] = text.split("//");
      dataText = dataText.trim();
      /** @type {JSGanttTaskData} */
      // @ts-ignore
      data = dataText.split(",").map(v => {const [key, value] = v.split(":").map(n => n.trim()); return {key, value}}).reduce((memo, v) => {memo[v.key] = v.value; return memo}, {});
      data.pName = pName.trim();

      // pを省略した場合に対応
      Object.keys(TreeNodeToJSGanttDataConvertor.convertMap).forEach(k => {
        if(data[k] === undefined) {
          return;
        }
        data[TreeNodeToJSGanttDataConvertor.convertMap[k]] = data[k];
      })

    } else {
      // @ts-ignore
      data = {pName:text.trim()}
    }

    data.pParent = parentID;
    if(data.pClass === undefined) {
      data.pClass = "ggroupblack" 
    }
    if(data.pOpen === undefined) {
      data.pOpen = 1
    }
    if(data.pID === undefined) {
      data.pID = `AUTOID${TreeNodeToJSGanttDataConvertor.createAutoId()}`
    }
    if(data.pRes === undefined) {
      data.pRes = "" 
    }
    // pGroup=1は小要素設定時に設定される。ここでは設定しない
    return data;
  }

  /**
   * 
   * @param {TreeNode} currentNode 
   */
  static getParentID(currentNode) {
    if(currentNode.isRoot) {
      throw new Error("rootは処理対象外");
    }
    return currentNode.parentNode?.isRoot ? 0 : currentNode.parentNode?.data.pID
  }
}

/**
 * 
 * @param {TreeNode[]} nodes 
 * @returns 
 */
function treeNodesToJSGanttDatas(nodes) { 
  TreeNodeToJSGanttDataConvertor.resetAutoIdIndex();
  
  return nodes.slice(1).map((v, i) => {
    const data = TreeNodeToJSGanttDataConvertor.parse(v.text, TreeNodeToJSGanttDataConvertor.getParentID(v));

    // nodeのdataに設定
    v.data = data;
    
    // 親をグループにする ★破壊的
    if(!v.parentNode?.isRoot) {
      // @ts-ignore 
      v.parentNode.data.pGroup = 1;
    }
    
    return data;
  })
}
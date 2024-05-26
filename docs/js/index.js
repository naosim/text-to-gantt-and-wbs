document.querySelector("textarea").value = datatext;

function nodeToText(node) {
  /** @type {JSGanttTaskData} */
  const data = node.data;
  const lines = [];
  if(data.pRes) {
    lines.push(`担当:${data.pRes}`);
  }
  if(data.pStart) {
    lines.push(`開始日:${data.pStart}`);
  }
  if(data.pEnd) {
    lines.push(`期日:${data.pEnd}`);
  }
  if(data.pNotes) {
    lines.push(`メモ:${data.pNotes}`);
  }
  if(lines.length == 0) {
    return data.pName
  }
  return data.pName + "<hr />" + lines.join("\n");
}

/**
 * 
 * @param {TreeNode[]} mindmapNodes 
 * @param {string} direction 
 * @returns 
 */
function treeNodesToMindmap(mindmapNodes, direction = "TB") {  
  const rectText = mindmapNodes.map(node => {
    console.log(node.isRoot)
    if(node.isRoot) {
      return `0[${node.text}]`;
    }
    return `${node.data.pID}["${nodeToText(node)}"]`;
  }).join("\n");
  
  const arrowText = mindmapNodes.map(node => {
    if(!node.parentNode) {
      return ""
    }
    var lines = [`${node.data.pParent}---${node.data.pID}`]
    if(node.data.pDepend) {
      node.data.pDepend.split(",").forEach(v => lines.push(`${v.trim()}-->${node.data.pID}`));
    }
    return lines.join("\n");
  }).join("\n");
  return `---\ntitle: ${mindmapNodes[0].text}\n---\nflowchart  ${direction}\n${rectText}\n${arrowText}`;
  // return "flowchart TD\n" + rectText + "\n" + arrowText;
}

function treeNodesToTaskFlow(nodes, direction = "TB") {
  
  function draw(node) {
    if(node.childNodes.length == 0) {
      return `${node.data.pID}["${nodeToText(node)}"]`;
    } else {
      const childText = node.childNodes.map(v => draw(v)).join("\n");
      return `subgraph ${node.data.pID}["${node.data.pName}(${node.data.pRes})"]\ndirection ${direction}\n${childText}\nend`;
    }
  }
  function drawChildArrow(node) {
    var lines = [];
    if(node.childNodes.length > 0) {
      node.childNodes.map((v, i) => i > 0 ? `${node.childNodes[i-1].data.pID}-->${v.data.pID}`:"").forEach(v => lines.push(v));
    }
    if(node.data && node.data.pDepend) {
      node.data.pDepend.split(",").forEach(v => lines.push(`${v.trim()}-->${node.data.pID}`));
    }
    return lines.join("\n");
  }
  
  const root = nodes[0];
  const text = root.childNodes.map(draw).join("\n");
  const arrow = nodes.map(drawChildArrow).join("\n")
  
  return `---\ntitle: ${root.text}\n---\nflowchart ${direction}\n${text}\n${arrow}`;
}

/**
 * 
 * @param {JSGanttTaskData[]} tasks 
 */
function setupGantt(selector, tasks) {
  const g = new JSGantt.GanttChart(document.querySelector(selector), 'month');
  g.setOptions(jsGanttOptions); // jsGanttOptionsはjsGanttOptions.jsで変更可能です。
  tasks.forEach(v => g.AddTaskItemObject(v))
  g.Draw();
}

const orgText = document.querySelector("textarea")?.value.trim();
const nodes = NestedTextParser.parse(orgText);
setupGantt('#GanttChartDIV', treeNodesToJSGanttDatas(nodes));

console.log(nodes);

document.querySelector(".mindmap").innerHTML = treeNodesToMindmap(nodes);
document.querySelector(".taskFlow").innerHTML = treeNodesToTaskFlow(nodes);
mermaid.initialize({
  startOnLoad:true,
  securityLevel: 'loose',
});

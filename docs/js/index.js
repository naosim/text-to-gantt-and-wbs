document.querySelector("textarea").value = datatext;

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
    return `${node.data.pID}["${node.data.pName}\n${node.data.pRes}"]`;
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
  return `flowchart ${direction}\n${rectText}\n${arrowText}`;
  // return "flowchart TD\n" + rectText + "\n" + arrowText;
}

function treeNodesToTaskFlow(nodes, direction = "TB") {
  function nodeToText(node) {
    return `${node.data.pName}\n${node.data.pRes}\nstart:${node.data.pStart}\nend:${node.data.pEnd}`
  }
  function draw(node) {
    if(node.childNodes.length == 0) {
      return `${node.data.pID}["${nodeToText(node)}"]`;
    } else {
      const childText = node.childNodes.map(v => draw(v)).join("\n");
      return `subgraph ${node.data.pID}["${node.data.pName}\n${node.data.pRes}"]\ndirection ${direction}\n${childText}\nend`;
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
  
  return `flowchart ${direction}\n${text}\n${arrow}`;
}

/**
 * 
 * @param {JSGanttTaskData[]} tasks 
 */
function setupGantt(selector, tasks) {
  //document.getElementById('GanttChartDIV')
  const g = new JSGantt.GanttChart(document.querySelector(selector), 'month');
  g.setOptions({
    vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,     
    vQuarterColWidth: 36,
    vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
    vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to dates in the "Major" header of the "Day" view
    vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
    vLang: 'ja',
    vShowTaskInfoLink: 1, // Show link in tool tip (0/1)
    vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily
    vUseSingleCell: 10000, // Set the threshold cell per table row (Helps performance for large data.
    vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers,
    vDateTaskTableDisplayFormat:"yyyy/mm/dd"
  });
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

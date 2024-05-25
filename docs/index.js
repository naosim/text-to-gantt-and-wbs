var g = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'month');

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

function treeNodesToJSGanttDatas(nodes) { 
  const convertTargetKeys = ["start", "end", "res", "comp", "note", "ID"]
  
  return nodes.slice(1).map((v, i) => {
    var [pName, dataText] = v.text.split("data{");
    dataText = dataText.split("}")[0];
    const data = dataText.split(",").map(v => {const [key, value] = v.split(":").map(n => n.trim()); return {key, value}}).reduce((memo, v) => {memo[v.key] = v.value; return memo}, {});
    data.pName = pName.trim();
    if(v.parentNode.nestCount == 0) {
      data.pParent = 0;
    } else {
      data.pParent = v.parentNode.data.pID
    }
    if(data.pClass === undefined) {
      data.pClass = "ggroupblack" 
    }
    if(data.pOpen === undefined) {
      data.pOpen = 1
    }
    if(data.pID === undefined) {
      data.pID = `AUTOID${i}`
    }
    v.data = data;
    
    // 親をグループにする
    if(!v.parentNode.isRoot) {
      v.parentNode.data.pGroup = 1;
    }
    
    return data;
  })
}

const orgText = document.querySelector("textarea")?.value.trim();
const nodes = NestedTextParser.parse(orgText);
treeNodesToJSGanttDatas(nodes).forEach(v => g.AddTaskItemObject(v))
g.Draw();


console.log(nodes);
document.querySelector(".mindmap").innerHTML = treeNodesToMindmap(nodes);
document.querySelector(".taskFlow").innerHTML = treeNodesToTaskFlow(nodes);
mermaid.initialize({
  startOnLoad:true,
  securityLevel: 'loose',
});

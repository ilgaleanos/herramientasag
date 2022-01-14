// tamaño del lienzo
const width = 800, height = 800;

// creamos el lienzo
const svg = d3.select("#fuerzas")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

const nodeId = d => d.id, // retorno del indicador
  nodeGroup = d => d.group, // retorno del grupo
  nodeTitle = d => `${d.id}\n${d.group}`, // retorno de formato del titulo
  linkStrokeWidth = l => Math.sqrt(l.value), // dado d link, retornamos el ancho en pixeles
  colors = d3.schemeTableau10; // paleta de colores para los grupos

// obtenemos los datos
d3.json("https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json")
  .then((data) => {
    // extraemos los nodos y los links de los datos
    var { nodes, links } = data;

    // construimos la escala ordenando los nodos
    const color = d3.scaleOrdinal(d3.sort(nodes), colors);

    // construimos las fuerzas
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(nodeId);

    const simulation = d3.forceSimulation(nodes)
      // los elementos relacionados tienen que estar cerca
      .force("link", forceLink)
      // no pueden estar tan cerca que no se puedan ver
      .force("charge", forceNode)
      // fuerza para que quede en el centro
      .force("center", d3.forceCenter())
      .on("tick", ticked);

    // pintamos las lineas
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-linecap", "round")
      .selectAll("line")
      .data(links)
      .join("line");

    // pintamos los nodos
    const node = svg.append("g")
      .attr("fill", "currentColor")
      .attr("stroke", "#fff")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .call(drag(simulation));

    // ancho de la linea
    link.attr("stroke-width", linkStrokeWidth);
    //coloreamos
    node.attr("fill", d => color(d.group));
    // titulo del nodo
    node.append("title").text(nodeTitle);

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  })
  // .catch(err => console.error(err));
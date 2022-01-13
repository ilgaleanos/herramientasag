
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


// creamos el lienzo sobre el div
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// obtenemos los datos
d3.csv("https://raw.githubusercontent.com/ilgaleanos/datasets/main/paro.csv", function (d) {
  return {
    "xx": parseFloat(d["Evolucion de la contratacion Indefinido"]),
    "yy": parseFloat(d["Evolucion de la contratacion Temporal"])
  };
})
  .then((data) => {
    // creamos el eje x
    var x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.xx))
      .range([0, width]);

    // agregamos el eje x en la parte inferior de la grafica
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // creamos el eje y
    var y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.yy))
      .range([height, 0]);

    // agregamos el eje y en la parte izquierda de la grafica
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add dots
    svg.append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.xx); })
      .attr("cy", function (d) { return y(d.yy); })
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

  })
  .catch(err => console.error(err));
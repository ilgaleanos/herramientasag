
// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// creamos el lienzo sobre el div
const svg = d3.select("#barras")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


var reducir = function (datos) {
  let keys = {};
  for (let dato of datos) {
    if (dato.xx in keys) {
      keys[dato.xx] = keys[dato.xx] + dato.yy
    } else {
      keys[dato.xx] = dato.yy;
    }
  }
  return keys;
}

// obtenemos los datos
d3.csv("https://raw.githubusercontent.com/ilgaleanos/datasets/main/paro.csv", function (d) {
  return {
    "xx": 's' + d["Año"],
    "yy": parseFloat(d["Evolucion de la contratacion Temporal"])
  };
})
  .then((data) => {
    data = reducir(data);
    console.log(data);
    // creamos el eje x
    var x = d3.scaleBand()
      .domain(Object.keys(data))
      .range([0, width])
      .padding(0.2);

    // agregamos el eje x en la parte inferior de la grafica
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0) rotate(-45)")
      .style("text-anchor", "end");

    // creamos el eje y
    var y = d3.scaleLinear()
      .domain([0, d3.max(Object.keys(data), d => data[d])])
      .range([height, 0]);

    // agregamos el eje y en la parte izquierda de la grafica
    svg.append("g")
      .call(d3.axisLeft(y));

    // agregamos las barras a la visualización
    svg.selectAll(".bar")
      .data(Object.keys(data))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d))
      .attr("y", d => y(data[d]))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(data[d]))
      .attr("fill", "#69b3a2")

  })
  .catch(err => console.error(err));
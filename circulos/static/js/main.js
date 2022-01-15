// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;


// creamos el lienzo sobre el div
var svg = d3.select("#circulos")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// obtenemos los datos
d3.json("https://api.jsonbin.io/b/61a4b32f62ed886f9156a27e")
  .then((data) => {
    console.log(data)
    // creamos el eje x
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.nota)])
      .range([0, width]);

    // agregamos el eje x en la parte inferior de la grafica
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // creamos el eje y
    var y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.ranking))
      .range([0, height]);

    // agregamos el eje y en la parte izquierda de la grafica
    svg.append("g")
      .call(d3.axisLeft(y));

    var scaleColor = d3.scaleLinear()
      .domain(d3.extent(data, d => d.nota))
      .range([0, 1]);

    // Add dots
    svg.append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.nota); })
      .attr("cy", function (d) { return y(d.ranking); })
      .attr("r", function (d) { return 15*d.nota/10;})
      // .style("fill", "#69b3a2")
      .style("fill", function (d) { return d3.interpolateRdYlGn(scaleColor(d.nota)); })

  })
  // .catch(err => console.error(err));
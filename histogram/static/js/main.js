
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


// creamos el lienzo sobre el div llamado histograma
var svg = d3.select("#histograma")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// funcion propia para crear mis tics
function makeTicks(x, size) {
  let domain = x.domain();
  let tics = [domain[0]];
  let delta = (domain[1] - domain[0]) / size
  let count = domain[0];
  while (count < domain[1]) {
    count += delta;
    tics.push(count);
  }
  return tics;
}

// obtenemos los datos
d3.csv("https://raw.githubusercontent.com/ilgaleanos/datasets/main/paro.csv", function (d) {
  return { 'price': parseFloat(d["Evolucion de la contratacion Indefinido"]) };
})
  .then((data) => {
    // numero de barras
    var numTics = 5;

    // creamos el eje x
    var x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.price))
      .range([0, width]);

    var tics = makeTicks(x, numTics);

    // fijamos los parametros para el histograma
    var histogram = d3.histogram(data)
      .value(function (d) { return d.price; })
      .domain(x.domain())
      .thresholds(tics);

    // obtenemos los contenedores
    var bins = histogram(data);

    // agregamos el eje x en la parte inferior de la grafica
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickValues(tics));

    // creamos el eje y
    var y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(bins, function (d) { return d.length; })]);

    // agregamos el eje y en la parte izquierda de la grafica
    svg.append("g")
      .call(d3.axisLeft(y));

    // agregamos los rectangulos al svg
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
      .attr("height", function (d) { return height - y(d.length); })
      .style("fill", "#69b3a2")

  })
  .catch(err => console.error(err));
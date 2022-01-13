
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


// creamos el lienzo sobre el div
var svg = d3.select("#pie")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);


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

const radius = Math.min(width, height) / 2;


const randomColor = () => {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    const random = Math.random();
    const bit = (random * 16) | 0;
    color += (bit).toString(16);
  };
  return color;
};

const randomColors = (size) => {
  let colors = [];
  for (let i = 0; i < size; i++) {
    colors.push(randomColor());
  }
  return colors;
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

    var color = d3.scaleOrdinal()
      .domain(Object.keys(data))
      .range(randomColors(Object.keys(data).length));


    const pie = d3.pie()
      .value(function (d) { return d[1] })
    const data_ready = pie(Object.entries(data))


    var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);


    var arcs = svg.selectAll("arc")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("class", "arc")


    arcs.append("path")
      .attr("fill", function (d, i) {
        return color(i);
      })
      .attr("d", arc);
  })
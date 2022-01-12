const nombres = {
    date: "Fecha",
    eci: "Evolucion de la contratacion Indefinido",
    ect: "Evolucion de la contratacion Temporal",
    tpi: "Total de población inactiva",
    otc: "Ocupados a tiempo completo",
    otp: "Ocupados a tiempo parcial",
    pp: "Personas en paro",
    etc: "Evolución a tiempo completo",
    etp: "Evolución a tiempo parcial",
    na: "Número de activos",
    rfd: "Robos con fuerza en domicilios",
    hrcs: "Homicidios registrados por los cuerpos de seguridad",
    itd: "Infracciones por tráfico de drogas",
    rvi: "Robos con violencia e intimidación"
};

var data = [];
var colores = {};

var indices = [
    'eci',
    'ect',
    'tpi',
    'otc',
    'otp',
    'pp',
    'etc',
    'etp',
    'na',
    'rfd',
    'hrcs',
    'itd',
    'rvi',
];

var activas = [];

// set the dimensions and margins of the graph
const margin = {
    top: 10, right: 30, bottom: 30, left: 60
},
    width = 850 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;


// creamos un apuntamiento al lugar que vamos a dibujar
const svg = d3.select("#lineas")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// creamos el tooltip fijo al cual vamos a mostrar, actualizar y ocultar
const tooltip = d3.select('.tooltip-area')
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");


// buscador de maximo contextual en data para las variables activas
function maximo() {
    let _maximo = -Infinity;
    activas.forEach(element => {
        data.forEach(dato => {
            if (dato[element] > _maximo) {
                _maximo = dato[element];
            }
        })
    });
    return _maximo;
}


// auxiliar para evitar errores nulos en los datos
function elimninarNaN(element) {
    let newData = [];
    // para cada linea de data tuncamos las que contengan nulos
    data.forEach(d => {
        if (!isNaN(d[element])) {
            newData.push({ [element]: d[element], 'date': d['date'] });
        }
    });
    // retornamos este nuevo dataset con solo dos valores por fila
    return newData;
}



// http://bl.ocks.org/fryford/2925ecf70ac9d9b51031
function animateline(element, time) {
    // obtenemosla longitud de la linea a animar
    var totalLength = d3.select("#line" + element).node().getTotalLength();

    // seleccionamos la linea
    d3.select("#line" + element)
        // atributos que dan el efecto de dibujado
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        // ejecutamos la transicion
        .transition()
        // asignamos el tiempo de duracion de la misma
        .duration(time)
        // atributos que dan el efecto de dibujado
        .attr("stroke-dashoffset", 0);
}


function render() {


    // limpiamos el svg
    svg.selectAll("*").remove();

    // creamos el lienzo, objeto svg, determinamos márgenes
    svg.append("svg")
        .attr("width", '100%')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // preparamos el eje X con la variable año como es tiempo usamos scaleTime
    // adicionalmente el maximo y minimo lo tomamos con extend
    // lo mapeamos con range en el ancho de nuestra visualización
    const x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);

    // preparamos el eje Y, uuna escala lineal y le pasamos una funcion
    // dinámica encargada de extraer el máximo de los datos activos
    const y = d3.scaleLinear()
        .domain([0, maximo()])
        .range([height, 0]);

    // agrefamos el eje X en la parte inferior de la gráfica
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // agregamos el eje Y en la parte izquierda de la gráfica
    svg.append("g")
        .call(d3.axisLeft(y));


    // creamos una referencia a la función que debe aparecer cuando se pasa el mouse
    // recordemos que esta ligada a cada linea
    const mouseover = (event, d) => {
        tooltip.style("visibility", "visible");
    };

    // creamos una referencia a la función que debe desaparecer cuando se pasa el mouse
    // recordemos que esta ligada a cada linea
    const mouseleave = (event, d) => {
        tooltip.style("visibility", "hidden");
    }


    // creamos una referencia para actualizar el valor del tooltip, este es calculado
    // a partir de de calcular el inverso de la coordenada de interseccion del mouse 
    // con la linea, tambien cabe resaltar que el element es el nombre de la linea
    // por lo tanto usamos el diccionario auxiliar para recuperar el nombre del tooltip
    const _mousemove = (event, d, element) => {
        let [xx, yy] = d3.pointer(event);
        tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px")
            .html(`
                <div class="container">
                    <div class="quicksand text-center"><b>${nombres[element]}</b></div>
                    <div class="row quicksand"> 
                        <div class="col">${moment(x.invert(xx)).format('L')}</div>
                        <div class="col">Valor: ${Math.floor(y.invert(yy))}</div>
                    </div>
                <div>
            `);
    };

    // para cada nombre de variable de las posibles variables activables
    activas.forEach(element => {
        // creamos el path
        svg.append("path")
            // le damos una clase en particular
            .attr("class", "line")
            // le damos un id bien definido
            .attr("id", "line" + element)
            // le da una finalizacion a la linea redondeada
            .attr("stroke-linecap", "round")
            // le asignamos una opacidad de 0.7 a la linea
            .style("opacity", "0.7")
            // generamos un dataset sin datos nulos para esa variable
            .datum(elimninarNaN(element))
            // le decimos que no nos de un relleno
            .attr("fill", "none")
            // le fijamos el color segun el mapeo ordinal inicial del main
            .attr("stroke", colores(element))
            // asignamos un ancho al path
            .attr("stroke-width", 3.5)
            // la pasamos al path el descriptor de linea y los valores
            .attr("d", d3.line()
                .x(function (d) { return x(d.date) })
                .y(function (d) { return y(d[element]) })
            )
            // adjuntamos el evento de actualizacion de tooltip
            .on("mousemove", (event, d) => { _mousemove(event, d, element); })
            // adjuntamos el evento de esconder de tooltip
            .on("mouseleave", mouseleave)
            // adjuntamos el evento de mostrar de tooltip
            .on("mouseover", mouseover);

        // agregamos el efecto de animacion para cada linea
        setTimeout(animateline(element, 500 + (Math.random() * 1500)), 1000);
    });
}

// activamos la funcion que nos indica modifica el array de graaficas activas que tenemos
function intercambiar(elemento) {
    // determinamos que grafica es
    let index = activas.indexOf(elemento)
    if (index == -1) {
        // lo agregamos a la visualizacion
        activas.push(elemento)
    } else {
        // lo eliminamos de la visualizacion
        activas.splice(index, 1)
    }

    // llamamos la función renderizadora
    render();
}

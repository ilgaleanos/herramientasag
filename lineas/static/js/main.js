d3.csv("https://raw.githubusercontent.com/ilgaleanos/datasets/main/paro.csv", function (d) {
    // cada fila es mapeada en un diccionario
    // aquí se realiza la transformacion línea a línea
    return {
        date: d3.timeParse("%Y-%m-%d")(d["Fecha"]),
        eci: parseFloat(d["Evolucion de la contratacion Indefinido"]),
        ect: parseFloat(d["Evolucion de la contratacion Temporal"]),
        tpi: parseFloat(d["Total de población inactiva"]),
        otc: parseFloat(d["Ocupados a tiempo completo"]),
        otp: parseFloat(d["Ocupados a tiempo parcial"]),
        pp: parseFloat(d["Personas en paro"]),
        na: parseFloat(d["Número de activos"]),
        etc: parseFloat(d["Evolución a tiempo completo"]),
        etp: parseFloat(d["Evolución a tiempo parcial"]),
        rfd: parseFloat(d["Robos con fuerza en domicilios"]),
        hrcs: parseFloat(d["Homicidios registrados por los cuerpos de seguridad"]),
        itd: parseFloat(d["Infracciones por tráfico de drogas"]),
        rvi: parseFloat(d["Robos con violencia e intimidación"]),
    }
}).then((localData) => {
    // se recibe un array con los diccionarios en cada celda
    data = localData;

    // escala ordinal se mapea un array en unos colores arbitrarios
    colores = d3.scaleOrdinal().domain(Object.keys(data[0]))
        .range(["white", "#089296", "#ffd700", "#69b3a2", "#040404", "#808080", "#006400", "#ffc0cb", "#a52a2a", "#6a5acd", "#089296", "#ffa500", "#ff0000", "#0000ff"])

    // para cada indice obtenemos el checkbox correspondiente
    indices.forEach(indice => {
        if (document.getElementById(indice).checked) {
            // si el checkbox está activo renderizamos esa linea
            intercambiar(indice);
        }
    })
});

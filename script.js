/* =========================================================
   DATA
========================================================= */

// ==========================================
// Monthly Revenue
// ==========================================

const revenueData = [
    {
        month: "January",
        branchA: 30000,
        branchB: 25000,
        branchC: 28000
    },

    {
        month: "February",
        branchA: 32000,
        branchB: 27000,
        branchC: 30000
    },

    {
        month: "March",
        branchA: 35000,
        branchB: 29000,
        branchC: 32000
    },

    {
        month: "April",
        branchA: 40000,
        branchB: 31000,
        branchC: 34000
    }
];


// ==========================================
// Temperature
// ==========================================

const temperatureData = [
    {
        city: "Bangkok",
        temperature: 32
    },

    {
        city: "Tokyo",
        temperature: 25
    },

    {
        city: "New York",
        temperature: 20
    },

    {
        city: "London",
        temperature: 18
    },

    {
        city: "Sydney",
        temperature: 22
    }
];


// ==========================================
// Car
// ==========================================

const carData = [
    {
        car_model: "Sedan A",
        engine_size: 1.6,
        mpg: 30
    },

    {
        car_model: "Sedan B",
        engine_size: 2.0,
        mpg: 28
    },

    {
        car_model: "SUV A",
        engine_size: 2.5,
        mpg: 22
    },

    {
        car_model: "SUV B",
        engine_size: 3.0,
        mpg: 20
    },

    {
        car_model: "Truck A",
        engine_size: 3.5,
        mpg: 18
    }
];



/* =========================================================
   GLOBAL
========================================================= */

const tooltip =
    d3.select("#tooltip");


const margin = {
    top: 25,
    right: 40,
    bottom: 65,
    left: 70
};



/* =========================================================
   TOOLTIP
========================================================= */

function showTooltip(
    event,
    html
) {

    tooltip
        .html(html)
        .classed(
            "show",
            true
        )
        .style(
            "left",
            `${event.clientX + 15}px`
        )
        .style(
            "top",
            `${event.clientY - 20}px`
        );
}


function moveTooltip(event) {

    tooltip
        .style(
            "left",
            `${event.clientX + 15}px`
        )
        .style(
            "top",
            `${event.clientY - 20}px`
        );
}


function hideTooltip() {

    tooltip.classed(
        "show",
        false
    );
}



/* =========================================================
   SUMMARY
========================================================= */

// ==========================================
// Highest Revenue
// ==========================================

let maxRevenue = 0;

let maxRevenueBranch = "";

let maxRevenueMonth = "";


revenueData.forEach(
    row => {

        [
            "branchA",
            "branchB",
            "branchC"
        ].forEach(
            branch => {

                if (
                    row[branch] >
                    maxRevenue
                ) {

                    maxRevenue =
                        row[branch];

                    maxRevenueBranch =
                        branch;

                    maxRevenueMonth =
                        row.month;
                }

            }
        );

    }
);


document
    .getElementById(
        "highestRevenue"
    )
    .textContent =
    "$" +
    maxRevenue.toLocaleString();


document
    .getElementById(
        "highestRevenueDetail"
    )
    .textContent =
    `${maxRevenueBranch
        .replace(
            "branch",
            "Branch "
        )} • ${maxRevenueMonth}`;



// ==========================================
// Highest Temperature
// ==========================================

const maxTemperature =
    d3.max(
        temperatureData,
        d => d.temperature
    );


const maxTemperatureCity =
    temperatureData.find(
        d =>
            d.temperature ===
            maxTemperature
    );


document
    .getElementById(
        "highestTemperature"
    )
    .textContent =
    maxTemperature +
    "°C";


document
    .getElementById(
        "highestTemperatureDetail"
    )
    .textContent =
    maxTemperatureCity.city;



// ==========================================
// Highest MPG
// ==========================================

const maxMPG =
    d3.max(
        carData,
        d => d.mpg
    );


const maxMPGCar =
    carData.find(
        d =>
            d.mpg === maxMPG
    );


document
    .getElementById(
        "highestMPG"
    )
    .textContent =
    maxMPG +
    " MPG";


document
    .getElementById(
        "highestMPGDetail"
    )
    .textContent =
    maxMPGCar.car_model;



/* =========================================================
   01 — REVENUE
   LINE + SCATTER
========================================================= */

function drawRevenueChart(
    filter = "all"
) {

    d3.select(
        "#revenueChart"
    )
    .selectAll("*")
    .remove();


    const container =
        document.querySelector(
            "#revenueChart"
        );


    const width =
        container.clientWidth;


    const height = 430;


    const innerWidth =
        width -
        margin.left -
        margin.right;


    const innerHeight =
        height -
        margin.top -
        margin.bottom;


    /* -----------------------------------------
       SVG
    ------------------------------------------ */

    const svg =
        d3.select(
            "#revenueChart"
        )
        .append("svg")
        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    const chart =
        svg.append("g")
        .attr(
            "transform",
            `translate(
                ${margin.left},
                ${margin.top}
            )`
        );


    /* -----------------------------------------
       Prepare Data
    ------------------------------------------ */

    const branches =
        filter === "all"

            ? [
                "branchA",
                "branchB",
                "branchC"
            ]

            : [filter];


    const colors = {

        branchA: "#6366f1",

        branchB: "#06b6d4",

        branchC: "#f59e0b"

    };


    /* -----------------------------------------
       Scales
    ------------------------------------------ */

    const x =
        d3.scalePoint()
        .domain(
            revenueData.map(
                d => d.month
            )
        )
        .range([
            0,
            innerWidth
        ])
        .padding(.5);


    const y =
        d3.scaleLinear()
        .domain([
            0,
            45000
        ])
        .range([
            innerHeight,
            0
        ]);


    /* -----------------------------------------
       Grid
    ------------------------------------------ */

    chart.append("g")
        .attr(
            "class",
            "grid"
        )
        .call(
            d3.axisLeft(y)
            .ticks(6)
            .tickSize(
                -innerWidth
            )
            .tickFormat("")
        )
        .selectAll("line")
        .attr(
            "class",
            "grid-line"
        );


    /* -----------------------------------------
       X Axis
    ------------------------------------------ */

    chart.append("g")
        .attr(
            "class",
            "axis"
        )
        .attr(
            "transform",
            `translate(
                0,
                ${innerHeight}
            )`
        )
        .call(
            d3.axisBottom(x)
        );


    /* -----------------------------------------
       Y Axis
    ------------------------------------------ */

    chart.append("g")
        .attr(
            "class",
            "axis"
        )
        .call(
            d3.axisLeft(y)
            .ticks(6)
            .tickFormat(
                d =>
                    "$" +
                    d / 1000 +
                    "k"
            )
        );


    /* -----------------------------------------
       Axis Labels
    ------------------------------------------ */

    chart.append("text")
        .attr(
            "class",
            "axis-label"
        )
        .attr(
            "x",
            innerWidth / 2
        )
        .attr(
            "y",
            innerHeight + 50
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "Month"
        );


    chart.append("text")
        .attr(
            "class",
            "axis-label"
        )
        .attr(
            "transform",
            "rotate(-90)"
        )
        .attr(
            "x",
            -innerHeight / 2
        )
        .attr(
            "y",
            -52
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "Revenue ($)"
        );


    /* -----------------------------------------
       LINE GENERATOR
    ------------------------------------------ */

    const line =
        d3.line()
        .x(
            d => x(d.month)
        )
        .y(
            d => y(d.value)
        )
        .curve(
            d3.curveMonotoneX
        );


    /* -----------------------------------------
       Draw Each Branch
    ------------------------------------------ */

    branches.forEach(
        branch => {

            const data =
                revenueData.map(
                    d => ({
                        month: d.month,

                        value:
                            d[branch],

                        branch:
                            branch
                    })
                );


            /* -------------------------------
               LINE
            -------------------------------- */

            const path =
                chart.append("path")
                .datum(data)

                .attr(
                    "fill",
                    "none"
                )

                .attr(
                    "stroke",
                    colors[branch]
                )

                .attr(
                    "stroke-width",
                    3
                )

                .attr(
                    "stroke-linecap",
                    "round"
                )

                .attr(
                    "d",
                    line
                );


            const totalLength =
                path.node()
                    .getTotalLength();


            path
                .attr(
                    "stroke-dasharray",
                    totalLength
                )

                .attr(
                    "stroke-dashoffset",
                    totalLength
                )

                .transition()

                .duration(1100)

                .attr(
                    "stroke-dashoffset",
                    0
                );


            /* -------------------------------
               SCATTER POINTS
            -------------------------------- */

            chart.selectAll(
                `.point-${branch}`
            )
            .data(data)
            .enter()
            .append("circle")

            .attr(
                "class",
                `point-${branch}`
            )

            .attr(
                "cx",
                d => x(d.month)
            )

            .attr(
                "cy",
                d => y(d.value)
            )

            .attr(
                "r",
                0
            )

            .attr(
                "fill",
                colors[branch]
            )

            .attr(
                "stroke",
                "white"
            )

            .attr(
                "stroke-width",
                3
            )

            .style(
                "cursor",
                "pointer"
            )

            /* HOVER */

            .on(
                "mouseover",
                function(
                    event,
                    d
                ) {

                    d3.select(this)
                        .transition()
                        .duration(150)
                        .attr(
                            "r",
                            10
                        );


                    showTooltip(
                        event,

                        `
                        <strong>
                            ${d.branch.replace(
                                "branch",
                                "Branch "
                            )}
                        </strong>

                        <br>

                        Month:
                        ${d.month}

                        <br>

                        Revenue:
                        <strong>
                            $${d.value.toLocaleString()}
                        </strong>
                        `
                    );

                }
            )

            .on(
                "mousemove",
                function(event) {

                    moveTooltip(event);

                }
            )

            .on(
                "mouseout",
                function() {

                    d3.select(this)
                        .transition()
                        .duration(150)
                        .attr(
                            "r",
                            6
                        );

                    hideTooltip();

                }
            )

            /* POINT ANIMATION */

            .transition()

            .duration(600)

            .delay(
                (d, i) =>
                    700 +
                    i * 100
            )

            .attr(
                "r",
                6
            );

        }
    );


    /* -----------------------------------------
       Legend
    ------------------------------------------ */

    const legend =
        svg.append("g")
        .attr(
            "transform",
            `translate(
                ${margin.left},
                ${height - 15}
            )`
        );


    branches.forEach(
        (
            branch,
            index
        ) => {

            const item =
                legend.append("g")
                .attr(
                    "transform",
                    `translate(
                        ${index * 110},
                        0
                    )`
                );


            item.append("circle")
                .attr(
                    "r",
                    5
                )
                .attr(
                    "fill",
                    colors[branch]
                );


            item.append("text")
                .attr(
                    "x",
                    10
                )
                .attr(
                    "y",
                    4
                )
                .attr(
                    "fill",
                    "#727c8c"
                )
                .style(
                    "font-size",
                    "11px"
                )
                .text(
                    branch.replace(
                        "branch",
                        "Branch "
                    )
                );

        }
    );

}



/* =========================================================
   02 — TEMPERATURE
   BAR CHART
========================================================= */

function drawTemperatureChart(
    filter = "all"
) {

    d3.select(
        "#temperatureChart"
    )
    .selectAll("*")
    .remove();


    const container =
        document.querySelector(
            "#temperatureChart"
        );


    const width =
        container.clientWidth;


    const height = 430;


    const innerWidth =
        width -
        margin.left -
        margin.right;


    const innerHeight =
        height -
        margin.top -
        margin.bottom;


    let data =
        filter === "all"

            ? temperatureData

            : temperatureData.filter(
                d =>
                    d.city ===
                    filter
            );


    const svg =
        d3.select(
            "#temperatureChart"
        )
        .append("svg")
        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    const chart =
        svg.append("g")
        .attr(
            "transform",
            `translate(
                ${margin.left},
                ${margin.top}
            )`
        );


    /* -----------------------------------------
       SCALES
    ------------------------------------------ */

    const x =
        d3.scaleBand()
        .domain(
            data.map(
                d => d.city
            )
        )
        .range([
            0,
            innerWidth
        ])
        .padding(.35);


    const y =
        d3.scaleLinear()
        .domain([
            0,
            40
        ])
        .range([
            innerHeight,
            0
        ]);


    /* -----------------------------------------
       GRID
    ------------------------------------------ */

    chart.append("g")
        .call(
            d3.axisLeft(y)
            .ticks(8)
            .tickSize(
                -innerWidth
            )
            .tickFormat("")
        )
        .selectAll("line")
        .attr(
            "class",
            "grid-line"
        );


    /* -----------------------------------------
       X AXIS
    ------------------------------------------ */

    chart.append("g")
        .attr(
            "class",
            "axis"
        )
        .attr(
            "transform",
            `translate(
                0,
                ${innerHeight}
            )`
        )
        .call(
            d3.axisBottom(x)
        );


    /* -----------------------------------------
       Y AXIS
    ------------------------------------------ */

    chart.append("g")
        .attr(
            "class",
            "axis"
        )
        .call(
            d3.axisLeft(y)
            .ticks(8)
        );


    /* -----------------------------------------
       LABELS
    ------------------------------------------ */

    chart.append("text")
        .attr(
            "class",
            "axis-label"
        )
        .attr(
            "x",
            innerWidth / 2
        )
        .attr(
            "y",
            innerHeight + 50
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "City"
        );


    chart.append("text")
        .attr(
            "class",
            "axis-label"
        )
        .attr(
            "transform",
            "rotate(-90)"
        )
        .attr(
            "x",
            -innerHeight / 2
        )
        .attr(
            "y",
            -52
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "Temperature (°C)"
        );


    /* -----------------------------------------
       BARS
    ------------------------------------------ */

    chart.selectAll(
        ".temperature-bar"
    )
    .data(data)
    .enter()
    .append("rect")

    .attr(
        "class",
        "temperature-bar"
    )

    .attr(
        "x",
        d => x(d.city)
    )

    .attr(
        "width",
        x.bandwidth()
    )

    .attr(
        "y",
        innerHeight
    )

    .attr(
        "height",
        0
    )

    .attr(
        "rx",
        7
    )

    .attr(
        "fill",
        "#f59e0b"
    )

    .style(
        "cursor",
        "pointer"
    )

    /* HOVER */

    .on(
        "mouseover",
        function(
            event,
            d
        ) {

            d3.select(this)
                .transition()
                .duration(150)
                .attr(
                    "opacity",
                    .75
                );


            showTooltip(
                event,

                `
                <strong>
                    ${d.city}
                </strong>

                <br>

                Average Temperature:

                <strong>
                    ${d.temperature}°C
                </strong>
                `
            );

        }
    )

    .on(
        "mousemove",
        function(event) {

            moveTooltip(event);

        }
    )

    .on(
        "mouseout",
        function() {

            d3.select(this)
                .transition()
                .duration(150)
                .attr(
                    "opacity",
                    1
                );

            hideTooltip();

        }
    )

    /* ANIMATION */

    .transition()

    .duration(800)

    .delay(
        (d, i) =>
            i * 120
    )

    .attr(
        "y",
        d =>
            y(d.temperature)
    )

    .attr(
        "height",
        d =>
            innerHeight -
            y(d.temperature)
    );


    /* -----------------------------------------
       VALUE LABEL
    ------------------------------------------ */

    chart.selectAll(
        ".temperature-label"
    )
    .data(data)
    .enter()
    .append("text")

    .attr(
        "class",
        "temperature-label"
    )

    .attr(
        "x",
        d =>
            x(d.city) +
            x.bandwidth() / 2
    )

    .attr(
        "y",
        d =>
            y(d.temperature) - 10
    )

    .attr(
        "text-anchor",
        "middle"
    )

    .attr(
        "fill",
        "#626b7a"
    )

    .style(
        "font-size",
        "12px"
    )

    .style(
        "font-weight",
        "500"
    )

    .style(
        "opacity",
        0
    )

    .text(
        d =>
            `${d.temperature}°C`
    )

    .transition()

    .delay(900)

    .duration(400)

    .style(
        "opacity",
        1
    );

}



/* =========================================================
   03 — CAR
   SCATTER PLOT
========================================================= */

function drawCarChart(
    filter = "all"
) {

    d3.select(
        "#carChart"
    )
    .selectAll("*")
    .remove();


    const container =
        document.querySelector(
            "#carChart"
        );


    const width =
        container.clientWidth;


    const height = 430;


    const innerWidth =
        width -
        margin.left -
        margin.right;


    const innerHeight =
        height -
        margin.top -
        margin.bottom;


    /* -----------------------------------------
       FILTER
    ------------------------------------------ */

    let data =
        filter === "all"

            ? carData

            : carData.filter(
                d =>
                    d.car_model
                        .startsWith(
                            filter
                        )
            );


    const svg =
        d3.select(
            "#carChart"
        )
        .append("svg")
        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    const chart =
        svg.append("g")
        .attr(
            "transform",
            `translate(
                ${margin.left},
                ${margin.top}
            )`
        );


    /* -----------------------------------------
       SCALES
    ------------------------------------------ */

    const x =
        d3.scaleLinear()
        .domain([
            1.4,
            3.7
        ])
        .range([
            0,
            innerWidth
        ]);


    const y =
        d3.scaleLinear()
        .domain([
            15,
            33
        ])
        .range([
            innerHeight,
            0
        ]);


    /* -----------------------------------------
       GRID
    ------------------------------------------ */

    chart.append("g")
        .call(
            d3.axisLeft(y)
            .ticks(6)
            .tickSize(
                -innerWidth
            )
            .tickFormat("")
        )
        .selectAll("line")
        .attr(
            "class",
            "grid-line"
        );


    /* -----------------------------------------
       X AXIS
    ------------------------------------------ */

    chart.append("g")
        .attr(
            "class",
            "axis"
        )
        .attr(
            "transform",
            `translate(
                0,
                ${innerHeight}
            )`
        )
        .call(
            d3.axisBottom(x)
        );


    /* -----------------------------------------
       Y AXIS
    ------------------------------------------ */

    chart.append("g")
        .attr(
            "class",
            "axis"
        )
        .call(
            d3.axisLeft(y)
        );


    /* -----------------------------------------
       LABELS
    ------------------------------------------ */

    chart.append("text")
        .attr(
            "class",
            "axis-label"
        )
        .attr(
            "x",
            innerWidth / 2
        )
        .attr(
            "y",
            innerHeight + 50
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "Engine Size (L)"
        );


    chart.append("text")
        .attr(
            "class",
            "axis-label"
        )
        .attr(
            "transform",
            "rotate(-90)"
        )
        .attr(
            "x",
            -innerHeight / 2
        )
        .attr(
            "y",
            -52
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "Fuel Efficiency (MPG)"
        );


    /* -----------------------------------------
       POINTS
    ------------------------------------------ */

    chart.selectAll(
        ".car-point"
    )
    .data(data)
    .enter()
    .append("circle")

    .attr(
        "class",
        "car-point"
    )

    .attr(
        "cx",
        d =>
            x(d.engine_size)
    )

    .attr(
        "cy",
        innerHeight
    )

    .attr(
        "r",
        0
    )

    .attr(
        "fill",
        "#16a34a"
    )

    .attr(
        "stroke",
        "white"
    )

    .attr(
        "stroke-width",
        3
    )

    .style(
        "cursor",
        "pointer"
    )

    /* HOVER */

    .on(
        "mouseover",
        function(
            event,
            d
        ) {

            d3.select(this)
                .transition()
                .duration(150)
                .attr(
                    "r",
                    10
                );


            showTooltip(
                event,

                `
                <strong>
                    ${d.car_model}
                </strong>

                <br>

                Engine Size:
                ${d.engine_size} L

                <br>

                MPG:
                <strong>
                    ${d.mpg}
                </strong>
                `
            );

        }
    )

    .on(
        "mousemove",
        function(event) {

            moveTooltip(event);

        }
    )

    .on(
        "mouseout",
        function() {

            d3.select(this)
                .transition()
                .duration(150)
                .attr(
                    "r",
                    7
                );

            hideTooltip();

        }
    )

    /* -----------------------------------------
       ANIMATION
    ------------------------------------------ */

    .transition()

    .duration(800)

    .delay(
        (d, i) =>
            i * 150
    )

    .attr(
        "cy",
        d =>
            y(d.mpg)
    )

    .attr(
        "r",
        7
    );


    /* -----------------------------------------
       CAR LABELS
    ------------------------------------------ */

    chart.selectAll(
        ".car-label"
    )
    .data(data)
    .enter()
    .append("text")

    .attr(
        "class",
        "car-label"
    )

    .attr(
        "x",
        d =>
            x(d.engine_size) + 10
    )

    .attr(
        "y",
        d =>
            y(d.mpg) - 10
    )

    .attr(
        "fill",
        "#596273"
    )

    .style(
        "font-size",
        "11px"
    )

    .style(
        "opacity",
        0
    )

    .text(
        d =>
            d.car_model
    )

    .transition()

    .delay(1000)

    .duration(400)

    .style(
        "opacity",
        1
    );

}



/* =========================================================
   FILTER EVENTS
========================================================= */

document
    .getElementById(
        "revenueFilter"
    )
    .addEventListener(
        "change",
        function() {

            drawRevenueChart(
                this.value
            );

        }
    );


document
    .getElementById(
        "temperatureFilter"
    )
    .addEventListener(
        "change",
        function() {

            drawTemperatureChart(
                this.value
            );

        }
    );


document
    .getElementById(
        "carFilter"
    )
    .addEventListener(
        "change",
        function() {

            drawCarChart(
                this.value
            );

        }
    );



/* =========================================================
   INITIALIZE
========================================================= */

drawRevenueChart();

drawTemperatureChart();

drawCarChart();



/* =========================================================
   RESPONSIVE REDRAW
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    function() {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                function() {

                    drawRevenueChart(
                        document
                            .getElementById(
                                "revenueFilter"
                            )
                            .value
                    );


                    drawTemperatureChart(
                        document
                            .getElementById(
                                "temperatureFilter"
                            )
                            .value
                    );


                    drawCarChart(
                        document
                            .getElementById(
                                "carFilter"
                            )
                            .value
                    );

                },
                250
            );

    }
);
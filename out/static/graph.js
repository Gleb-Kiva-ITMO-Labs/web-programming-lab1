const svg = d3.select("#graph-view");
const width = document.getElementById('graph-view').getBoundingClientRect().width;
const height = document.getElementById('graph-view').getBoundingClientRect().height;
const point_size = 5;

const screen_center_x = width / 2;
const screen_center_y = height / 2;

// Fixed scaling for the axes (coordinates -200 to 200)
const axisScale = 5;
// const axisScale = width;
// Functions translating point on coordinate system to svg coordinates
const xScale = d3.scaleLinear().domain([-axisScale, axisScale]).range([0, width]);
const yScale = d3.scaleLinear().domain([-axisScale, axisScale]).range([height, 0]);

let R_coefficient = 1;
let point_coordinates = null;

function getScreenR() {
    return (width / (axisScale * 2)) * R_coefficient;
}

// Scaling for the shape based on getScreenR() (for flexibility)
const shapeXScale = d3.scaleLinear().domain([-R_coefficient, R_coefficient]).range([screen_center_x - getScreenR(), screen_center_x + getScreenR()]);
const shapeYScale = d3.scaleLinear().domain([-R_coefficient, R_coefficient]).range([screen_center_y + getScreenR(), screen_center_y - getScreenR()]);
// const shapeXScale = d3.scaleLinear().domain([-getScreenR(), getScreenR()]).range([screen_center_x - getScreenR(), screen_center_x + getScreenR()]);
// const shapeYScale = d3.scaleLinear().domain([-getScreenR(), getScreenR()]).range([screen_center_y + getScreenR(), screen_center_y - getScreenR()]);

// Draw the axes
function drawAxes() {
    const axisXFragments = [d3.axisBottom(xScale)
        .ticks(10)
        .tickSize(-height / 2), d3.axisBottom(xScale)
        .tickFormat('')
        .ticks(10)
        .tickSize(height / 2)];
    const axisYFragments = [d3.axisLeft(yScale)
        .ticks(10)
        .tickSize(-width / 2), d3.axisLeft(yScale)
        .tickFormat('')
        .ticks(10)
        .tickSize(width / 2)];
    axisXFragments.forEach(axisXFragment => {
        svg.append("g")
            .attr("transform", `translate(0, ${screen_center_y})`)
            .call(axisXFragment)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "var(--border-color)"))
            .call(g => g.selectAll(".tick text").attr("fill", "var(--text-color)").attr("transform", "translate(20, 6) rotate(30)"));
    });
    axisYFragments.forEach(axisYFragment => {
        svg.append("g")
            .attr("transform", `translate(${screen_center_x}, 0)`)
            .call(axisYFragment)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "var(--border-color)"))
            .call(g => g.selectAll(".tick text").attr("fill", "var(--text-color)").attr("transform", "translate(-2, 6) rotate(-30)"));

    });
}

// Draw the #F05D23 shape (depending on getScreenR())
function drawShape() {
    // Rectangle part
    svg.append("rect")
        .attr("x", shapeXScale(-R_coefficient / 2))
        .attr("y", shapeYScale(0))
        .attr("width", shapeXScale(0) - shapeXScale(-R_coefficient / 2))
        .attr("height", shapeYScale(0) - shapeYScale(R_coefficient))
        .attr("fill", "#F05D23")
        .attr("opacity", "0.3");

    // Quarter circle part
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(shapeXScale(0) - shapeXScale(-R_coefficient / 2))
        .startAngle(Math.PI * 1.5)
        .endAngle(Math.PI * 2);

    svg.append("path")
        .attr("d", arc)
        .attr("fill", "#F05D23")
        .attr("opacity", "0.3")
        .attr("transform", `translate(${shapeXScale(0)},${shapeYScale(0)})`);

    // Triangle part
    svg.append("polygon")
        .attr("points", `${shapeXScale(0)},${shapeYScale(0)} ${shapeXScale(R_coefficient / 2)},${shapeYScale(0)} ${shapeXScale(0)},${shapeYScale(-R_coefficient / 2)}`)
        .attr("fill", "#F05D23")
        .attr("opacity", "0.3");
}

function drawPoint() {
    if (point_coordinates) {
        svg.append("rect")
            .attr("x", xScale(point_coordinates.x) - point_size / 2)
            .attr("y", yScale(point_coordinates.y) - point_size / 2)
            .attr("width", point_size)
            .attr("height", point_size)
            .attr("fill", "#5dd17c");
    }
}

function render() {
    document.getElementById('graph-view').innerHTML = '';
    drawAxes();
    drawShape();
    drawPoint();
}

render();
window.onresize = () => render();


const svg = d3.select("#graph-view");
const width = document.getElementById('graph-view').getBoundingClientRect().width;
const height = document.getElementById('graph-view').getBoundingClientRect().height;

const centerX = width / 2;
const centerY = height / 2;

// Fixed scaling for the axes (coordinates -200 to 200)
const axisScale = width;
const xScale = d3.scaleLinear().domain([-axisScale, axisScale]).range([0, width]);
const yScale = d3.scaleLinear().domain([-axisScale, axisScale]).range([height, 0]);

const R = width / 5;  // Define the radius for the shape only

// Scaling for the shape based on R (for flexibility)
const shapeXScale = d3.scaleLinear().domain([-R, R]).range([centerX - R, centerX + R]);
const shapeYScale = d3.scaleLinear().domain([-R, R]).range([centerY + R, centerY - R]);

// Draw the axes
function drawAxes() {
    const axisXFragments = [
        d3.axisBottom(xScale)
            .ticks(10)
            .tickSize(-height / 2),
        d3.axisBottom(xScale)
            .tickFormat('')
            .ticks(10)
            .tickSize(height / 2)
    ];
    const axisYFragments = [
        d3.axisLeft(yScale)
            .ticks(10)
            .tickSize(-width / 2),
        d3.axisLeft(yScale)
            .tickFormat('')
            .ticks(10)
            .tickSize(width / 2)
    ];
    axisXFragments.forEach(axisXFragment => {
        svg.append("g")
            .attr("transform", `translate(0, ${centerY})`)
            .call(axisXFragment)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "var(--border-color)"))
            .call(g => g.selectAll(".tick text").attr("fill", "var(--text-color)").attr("transform", "translate(20, 6) rotate(30)"));
    });
    axisYFragments.forEach(axisYFragment => {
        svg.append("g")
            .attr("transform", `translate(${centerX}, 0)`)
            .call(axisYFragment)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "var(--border-color)"))
            .call(g => g.selectAll(".tick text").attr("fill", "var(--text-color)").attr("transform", "translate(-2, 6) rotate(-30)"));

    });
}

// Draw the blue shape (depending on R)
function drawShape() {
    // Rectangle part
    svg.append("rect")
        .attr("x", shapeXScale(-R / 2))
        .attr("y", shapeYScale(0))
        .attr("width", shapeXScale(0) - shapeXScale(-R / 2))
        .attr("height", shapeYScale(0) - shapeYScale(R))
        .attr("fill", "blue")
        .attr("opacity", "0.3");

    // Quarter circle part
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(R / 2)
        .startAngle(Math.PI * 1.5)
        .endAngle(Math.PI * 2);

    svg.append("path")
        .attr("d", arc)
        .attr("fill", "blue")
        .attr("opacity", "0.3")
        .attr("transform", `translate(${shapeXScale(0)},${shapeYScale(0)})`);

    // Triangle part
    svg.append("polygon")
        .attr("points", `${shapeXScale(0)},${shapeYScale(0)} ${shapeXScale(R / 2)},${shapeYScale(0)} ${shapeXScale(0)},${shapeYScale(-R / 2)}`)
        .attr("fill", "blue")
        .attr("opacity", "0.3");
}

// Call the functions to draw the axes and the shape
drawAxes();
drawShape();

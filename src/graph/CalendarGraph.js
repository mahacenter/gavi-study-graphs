import React from 'react'
import * as d3 from 'd3'

const cellSize = 17;
const width = 954;
const height = 119

const colorResolver = years => {
    let min = 0, max = 0;
    years.forEach(year => {
        year.values.forEach(({coverageRateDiff}) => {
            if (coverageRateDiff < min) min = coverageRateDiff;
            if (coverageRateDiff > max) max = coverageRateDiff;
        })
    })
    return {
        min,
        max,
        color: d3.scaleSequential(d3.interpolatePiYG).domain([-max, max])
    };
};

export function CalendarGraph(props) {
    const {color} = colorResolver(props.years);

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, (height + (props.selectedRegions.length * cellSize)) * props.years.length])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

    const yearSvg = svg.selectAll("g")
        .data(props.years)
        .join("g")
        .attr("transform", (d, i) => `translate(300,${(40 + (props.selectedRegions.length * cellSize)) * i + cellSize * 1.5})`);

    yearSvg.append("text")
        .attr("x", -5)
        .attr("y", -5)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(year => year.name);

    yearSvg.append("g")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(props.selectedRegions)
        .join("text")
        .attr("x", -5)
        .attr("y", (_, index) => (index + 0.5) * cellSize)
        .attr("dy", "0.31em")
        .text(key => key);


    yearSvg.append("g")
        .selectAll("g")
        .data(['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'])
        .join("g")
        .append("text")
        .attr("x", (_, index) => index * cellSize + 20)
        .attr("y", -5)
        .text(month => month);

    yearSvg.append("g")
        .selectAll("rect")
        .data(year => year.values)
        .join("rect")
        .attr("width", cellSize - 1)
        .attr("height", cellSize - 1)
        .attr("x", cell => cell.month * cellSize + 0.5)
        .attr("y", cell => {
            const regionIndex = props.selectedRegions.findIndex(selected => selected === cell.regionOrDistrict);
            return regionIndex * cellSize + 0.5;
        })
        .attr("fill", cell => color(cell.coverageRateDiff))
        .append("title")
        .text(cell => `${props.indicator}: ${cell.coverageRateDiff}`);

    const node = svg.node();

    return <div dangerouslySetInnerHTML={{__html: node.outerHTML}}></div>;
}

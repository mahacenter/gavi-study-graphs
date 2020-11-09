import React from 'react'
import * as d3 from 'd3'
import {legend} from "./monthlyLegend";

const cellSize = 17;
const width = 954;
const legendWidth = 320;
const height = 119

const colorResolver = years => {
    let min = 0, max = 0;
    years.forEach(year => {
        year.values.forEach(({coverageRateDiff}) => {
            if (coverageRateDiff < min) min = coverageRateDiff;
            if (coverageRateDiff > max) max = coverageRateDiff;
        })
    });

    const maxValue = Math.max(1.5, Math.max(max, -min));
    return {
        legendBuilder: () => legend({
            color: d3.scaleDiverging([-maxValue / 100, 0, maxValue / 100], d3.interpolatePiYG),
            width: legendWidth,
            title: "Monthly change",
            tickFormat: "+%"
        }),
        color: d3.scaleSequential(d3.interpolatePiYG).domain([-maxValue, maxValue])
    };
};

export function CalendarGraph(props) {
    const {color, legendBuilder} = colorResolver(props.years);

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, (height + (props.selectedRegions.length * cellSize)) * props.years.length])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

    const yearSvg = svg.selectAll("g")
        .data(props.years)
        .join("g")
        .attr("transform", (d, i) => `translate(345,${(40 + (props.selectedRegions.length * cellSize)) * i + cellSize * 1.5})`);

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
        .text(cell => `${props.indicator} for ${cell.regionOrDistrict}: 
- Coverage rate diff: ${cell.coverageRateDiff}
- Target population: ${cell.targetPop}
- Value: ${cell.value}`);

    const node = svg.node();

    return <>
        <div style={{width: legendWidth, margin: '25px auto auto'}} dangerouslySetInnerHTML={{__html: legendBuilder().outerHTML}}></div>
        <div dangerouslySetInnerHTML={{__html: node.outerHTML}}></div>
    </>;
}

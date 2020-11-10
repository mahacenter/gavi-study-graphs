import React, {useEffect} from 'react'
import * as d3 from 'd3'

const margin = ({top: 20, right: 20, bottom: 30, left: 30});
const height = 500;
const width = 1000;

export function MultiLineGraph(props) {
  useEffect(() => {
    const dates = props.dates.map(d => new Date(d));

    const x = d3.scaleUtc()
      .domain(d3.extent(dates))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(props.series, d => d3.max(d.values))]).nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(`${props.indicator}: Coverage rate catch-up %`));

    const line = d3.line()
      .defined(d => !isNaN(d))
      .x((d, i) => x(dates[i]))
      .y(d => y(d));

    function hover(svg, path) {
      if ("ontouchstart" in document) svg
        .style("-webkit-tap-highlight-color", "transparent")
        .on("touchmove", moved)
        .on("touchstart", entered)
        .on("touchend", left)
      else svg
        .on("mousemove", moved)
        .on("mouseenter", entered)
        .on("mouseleave", left);

      const dot = svg.append("g")
        .attr("display", "none");

      dot.append("circle")
        .attr("r", 2.5);

      dot.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("y", -8);

      function moved(event) {
        event.preventDefault();
        const pointer = d3.pointer(event, this);
        const xm = x.invert(pointer[0]);
        const ym = y.invert(pointer[1]);
        const i = d3.bisectCenter(dates, xm);
        const s = d3.least(props.series, d => Math.abs(d.values[i] - ym));
        path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
        dot.attr("transform", `translate(${x(dates[i])},${y(s.values[i])})`);
        dot.select("text").text(s.name);
      }

      function entered() {
        path.style("mix-blend-mode", null).attr("stroke", "#ddd");
        dot.attr("display", null);
      }

      function left() {
        path.style("mix-blend-mode", "multiply").attr("stroke", null);
        dot.attr("display", "none");
      }
    }

    d3.select("#multiline-graph").selectAll("*").remove();
    const svg = d3.select("#multiline-graph")
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible");

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(props.series)
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", d => line(d.values));

    svg.call(hover, path);
  }, [props.dates, props.series, props.indicator]);

  return <svg id="multiline-graph" style={{width: width}}/>;
}

'use client'

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Tooltip, Typography, Space } from "antd";
import useToken from "antd/es/theme/useToken";

const { Text } = Typography;

// LLM generated code
export default function StackedBar({ data, height, width }: { data: any, height: number | string, width: number | string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const tokens = useToken()[1];

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous content

        const countries = ["in", "us", "cn"];
        const categories = ["Undergrad", "Postgrad", "Postdoc", "Faculty", "Industry", "Unknown"];

        const colors = d3.scaleOrdinal(d3.schemePiYG[6]);

        const formattedData = countries.map(country => {
            const total: number = (Object.values(data[country] || {}) as number[]).reduce((sum, value) => sum + value, 0 as number);
            
            return {
                country: country.toUpperCase(),
                values: categories.map(category => ({
                    category,
                    percentage: ((data[country][category] || 0) / total) * 100,
                    value: data[country][category] || 0
                }))
            };
        });

        const margin = { top: 24, right: 24, bottom: 24, left: 24 };
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
        const yScale = d3.scaleBand().domain(countries.map(c => c.toUpperCase())).range([margin.top, height - margin.bottom]).padding(0.4)

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        // Add Y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).tickSize(0))
            .select(".domain")
            .remove()               // Remove the Y-axis vertical line
            .selectAll("text")
            .style("font-size", "12px");

        // Add tooltip
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "white")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "4px")
            .style("box-shadow", "0px 2px 5px rgba(0, 0, 0, 0.2)")
            .style("pointer-events", "none")
            .style("opacity", 0);

        // Add stacked bars
        svg.append("g")
            .selectAll("g")
            .data(formattedData)
            .join("g")
            .attr("transform", d => `translate(0,${yScale(d.country)})`)
            .selectAll("rect")
            .data(d => d.values)
            .join("rect")
            .attr("x", (d, i, nodes) => {
                const parentNode = (nodes[i] as SVGRectElement).parentNode as SVGGElement | null;
                const previous = parentNode
                    ? d3.sum((d3.select(parentNode).data()[0] as { values: { percentage: number }[] }).values.slice(0, i), (v: { percentage: number }) => v.percentage)
                    : 0;
                return xScale(previous);
            })
            .attr("y", 0)
            .attr("width", d => xScale(d.percentage) - xScale(0))
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colors(d.category))
            .style("transition", "all 0.3s ease")
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .style("opacity", 0.7)
                    .style("cursor", "pointer");

                tooltip
                    .style("opacity", 1)
                    .html(`<strong>${d.category} (${d.percentage.toFixed(1)}%)</strong><br>Val: ${d.value}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .style("opacity", 1);

                tooltip.style("opacity", 0);
            });

        // Add percentage text inside the bars
        svg.append("g")
            .selectAll("g")
            .data(formattedData)
            .join("g")
            .attr("transform", d => `translate(0,${yScale(d.country)})`)
            .selectAll("text")
            .data(d => d.values)
            .join("text")
            .attr("x", (d, i, nodes) => {
                const parentNode = (nodes[i] as SVGTextElement).parentNode as SVGGElement | null;
                const previous = parentNode
                    ? d3.sum((d3.select(parentNode).data()[0] as { values: { percentage: number }[] }).values.slice(0, i), (v: { percentage: number }) => v.percentage)
                    : 0;
                return xScale(previous) + (xScale(d.percentage) - xScale(0)) / 2;
            })
            .attr("y", yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d => `${d.percentage.toFixed(1)}%`)
            .style("fill", "white")
            .style("font-size", "10px");

        // Add X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => `${d}%`))
            .selectAll("text")
            .style("font-size", "12px");

        // Adjust legend to be horizontal and above the bars
        const legend = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top - 20})`)
            .attr("text-anchor", "start");

        categories.forEach((category, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(${i * width/6}, 0)`); // Adjust spacing between legend items

            legendRow.append("rect")
                .attr("width", 16)
                .attr("height", 16)
                .attr("fill", colors(category));

            legendRow.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .style("font-size", "12px")
                .text(category);
        });

        return () => {
            tooltip.remove(); // Clean up tooltip on unmount
        };
    }, [data]);

    return (
        <svg ref={svgRef} 
        width={width}
        height={height}
        style={{
            maxWidth: '100%',
            height: 'auto'
        }}></svg>
    );
}

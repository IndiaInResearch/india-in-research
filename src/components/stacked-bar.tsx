'use client'

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Tooltip, Typography, Space } from "antd";
import useToken from "antd/es/theme/useToken";
import { getDataReturnType } from "@/utils/data-handlers";

const { Text } = Typography;

// LLM generated code
export default function StackedBar({ data, height, width }: { data: getDataReturnType, height: number | string, width: number | string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const tokens = useToken()[1];

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous content

        const countries = ["in", "us", "cn"];
        const categories = Object.keys(data.author_ranks.in);

        const colors = d3.scaleOrdinal(d3.schemePiYG[6]);

        const formattedData = countries.map(country => {
            const total: number = (Object.values(data.author_ranks[country as keyof typeof data.author_ranks] || {}) as number[]).reduce((sum, value) => sum + value, 0 as number);
            
            return {
                country: country.toUpperCase(),
                values: categories.map(category => ({
                    category,
                    percentage: ((data.author_ranks[country as keyof typeof data.author_ranks][category as keyof typeof data.author_ranks.in] || 0) / total) * 100,
                    value: data.author_ranks[country as keyof typeof data.author_ranks][category as keyof typeof data.author_ranks.in] || 0
                }))
            };
        });

        const margin = { top: 24, right: 24, bottom: 24, left: 40 };
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
        const yScale = d3.scaleBand().domain(countries.map(c => c.toUpperCase())).range([margin.top, height - margin.bottom]).padding(0.4)

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        // Add Y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left - 10},0)`) // Add gap by shifting the Y-axis left
            .call(d3.axisLeft(yScale).tickSize(0))
            .select(".domain")
            .remove();               // Remove the Y-axis vertical line

        svg.selectAll(".tick text")
            .style("font-size", tokens.fontSizeHeading5)

        // Add tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", tokens.colorBgElevated)
            .style("color", tokens.colorText)
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("box-shadow", "0 2px 8px rgba(0,0,0,0.15)");

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
                    .style("visibility", "visible")
                    .html(`<strong>${d.category[0].toUpperCase() + d.category.slice(1)} (${d.percentage.toFixed(1)}%)</strong><br>Val: ${d.value}`)
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

                tooltip.style("visibility", "hidden");
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
            .style("fill", tokens.colorText)
            .style("font-size", tokens.fontSizeSM);

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
                .style("font-size", tokens.fontSize)
                .style("fill", tokens.colorText)
                .text(category[0].toUpperCase() + category.slice(1));
        });

        return () => {
            tooltip.remove(); // Clean up tooltip on unmount
        };
    }, [data]);

    return (
        <svg ref={svgRef} 
        width={width}
        height={height}
        ></svg>
    );
}

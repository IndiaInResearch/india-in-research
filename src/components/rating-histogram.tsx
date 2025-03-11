'use client'

import { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import { ThemeModeContext, ThemeMode } from '@/components/theme-context';
import useToken from 'antd/es/theme/useToken';

interface RatingHistogramProps {
    width: number | string;
    height: number | string;
    indiaRatings: any[];
    usRatings: any[];
    chinaRatings: any[];
}

// LLM generated code
export default function RatingHistogram({ width, height, indiaRatings, usRatings, chinaRatings }: RatingHistogramProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const { mode } = useContext(ThemeModeContext);
    const tokens = useToken()[1];

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear any existing content
        d3.select(svgRef.current).selectAll("*").remove();


        // Set up dimensions
        const margin = { top: 40, right: 40, bottom: 60, left: 60 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = svgRef.current.clientHeight - margin.top - margin.bottom;

        // Create scales
        const allRatings = [...indiaRatings, ...usRatings, ...chinaRatings];
        const xScale = d3.scaleLinear()
            .domain([d3.min(allRatings) || 0, d3.max(allRatings) || 10])
            .range([0, width]);

        // Create histogram generator
        const histogram = d3.bin<number, number>()
            .domain(xScale.domain() as [number, number])
            .thresholds((d3.max(allRatings) || 10) - (d3.min(allRatings) || 0) + 2);

        // Generate histograms and normalize them
        const normalizeHistogram = (hist: d3.Bin<number, number>[], totalCount: number) => {
            return hist.map(bin => ({
                x0: bin.x0,
                x1: bin.x1,
                length: (bin.length / totalCount) * 100 // Convert to percentage
            }));
        };

        const indiaHistogram = normalizeHistogram(histogram(indiaRatings), indiaRatings.length);
        const usHistogram = normalizeHistogram(histogram(usRatings), usRatings.length);
        const chinaHistogram = normalizeHistogram(histogram(chinaRatings), chinaRatings.length);

        const indiaMean = d3.mean(indiaRatings) || 0;
        const usMean = d3.mean(usRatings) || 0;
        const chinaMean = d3.mean(chinaRatings) || 0;

        const binMidpoints = indiaHistogram.map(bin => (bin.x0! + bin.x1!) / 2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max([...indiaHistogram, ...usHistogram, ...chinaHistogram], d => d.length) || 0])
            .range([height, 0]);

        // Create SVG
        const svg = d3.select(svgRef.current);
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create tooltip div
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

        // Add X axis with bin midpoints
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickValues(binMidpoints)
                .tickFormat((d: d3.NumberValue) => (+d).toFixed(2)))
            .selectAll("text")
            .attr("fill", tokens.colorText);

        // Add Y axis with percentage format
        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat((d: d3.NumberValue, i: number) => `${(+d).toFixed(1)}%`))
            .selectAll("text")
            .attr("fill", tokens.colorText);

        // Add X axis label
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .attr("fill", tokens.colorText)
            .text("Average Rating");

        // Add Y axis label
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .attr("fill", tokens.colorText)
            .text("Percentage of Papers");

        // Define line and area generators
        const line = d3.line<any>()
            .x(d => xScale((d.x0! + d.x1!) / 2))
            .y(d => yScale(d.length))
            // .curve(d3.curveCatmullRom);

        const area = d3.area<any>()
            .x(d => xScale((d.x0! + d.x1!) / 2))
            .y0(height)
            .y1(d => yScale(d.length))
            // .curve(d3.curveCatmullRom);

        // Add the areas with hover interactions
        const addAreaAndLine = (data: any[], color: string, name: string) => {
            // Add area
            g.append("path")
                .datum(data)
                .attr("fill", color)
                .attr("opacity", 0.1)
                .attr("d", area)
                .attr("class", `area-${name}`)
                .style("cursor", "pointer")
                .on("mouseover", function() {
                    // Highlight area
                    d3.select(this).attr("opacity", 0.3);
                    // Highlight corresponding line
                    d3.select(`.line-${name}`).attr("stroke-width", 3);
                    // Show all points
                    d3.selectAll(`.point-${name}`).attr("opacity", 1);
                    
                    const meanValue = name === "India" ? indiaMean :
                                    name === "USA" ? usMean :
                                    chinaMean;
                    
                    tooltip
                        .style("visibility", "visible")
                        .html(`
                            <strong>${name}</strong><br/>
                            Mean Rating: ${meanValue.toFixed(2)}<br/>
                            Total Papers: ${data.length}
                        `);
                })
                .on("mousemove", function(event: MouseEvent) {
                    tooltip
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 10}px`);
                })
                .on("mouseout", function() {
                    // Reset area
                    d3.select(this).attr("opacity", 0.1);
                    // Reset line
                    d3.select(`.line-${name}`).attr("stroke-width", 2);
                    // Hide points
                    d3.selectAll(`.point-${name}`).attr("opacity", 0);
                    // Hide tooltip
                    tooltip.style("visibility", "hidden");
                });

            // Add interactive line with hover points
            const lineGroup = g.append("g")
                .attr("class", `line-group-${name}`);

            // Add the main line
            lineGroup.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 2)
                .attr("d", line)
                .attr("class", `line-${name}`)
                .on("mouseover", function() {
                    d3.select(this)
                        .attr("stroke-width", 3);
                    d3.select(`.area-${name}`)
                        .attr("opacity", 0.3);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("stroke-width", 2);
                    d3.select(`.area-${name}`)
                        .attr("opacity", 0.1);
                });

            // Add interactive points
            lineGroup.selectAll(`.point-${name}`)
                .data(data)
                .join("circle")
                .attr("class", `point-${name}`)
                .attr("cx", d => xScale((d.x0! + d.x1!) / 2))
                .attr("cy", d => yScale(d.length))
                .attr("r", 4)
                .attr("fill", color)
                .attr("opacity", 0)
                .on("mouseover", function(event: MouseEvent, d) {
                    d3.select(this)
                        .attr("opacity", 1)
                        .attr("r", 6);
                    
                    tooltip
                        .style("visibility", "visible")
                        .html(`
                            <strong>${name}</strong><br/>
                            Rating Range: ${d.x0?.toFixed(2)} - ${d.x1?.toFixed(2)}<br/>
                            Percentage: ${d.length.toFixed(2)}%
                        `)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 10}px`);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("opacity", 0)
                        .attr("r", 4);
                    tooltip.style("visibility", "hidden");
                });
        };

        // Add the visualizations for each dataset
        addAreaAndLine(indiaHistogram, tokens.colorSuccess, "India");
        addAreaAndLine(usHistogram, tokens.colorInfo, "USA");
        addAreaAndLine(chinaHistogram, tokens.colorWarning, "China");

        // Modified addMeanLine function with hover interaction
        const addMeanLine = (mean: number, color: string, name: string) => {
            const meanGroup = g.append("g")
                .attr("class", `mean-group-${name}`);

            const meanLine = meanGroup.append("line")
                .attr("x1", xScale(mean))
                .attr("x2", xScale(mean))
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", color)
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "4,4")
                .attr("class", `mean-line-${name}`)
                .style("cursor", "pointer")
                .on("mouseover", function(event: MouseEvent) {
                    // Bold line
                    d3.select(this).attr("stroke-width", 2);
                    // Bold text
                    d3.select(`.mean-text-${name}`).attr("font-weight", "bold");
                    
                    tooltip
                        .style("visibility", "visible")
                        .html(`<strong>${name} Mean</strong><br/>Average Rating: ${mean.toFixed(2)}`)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 10}px`);
                })
                .on("mouseout", function() {
                    // Reset line
                    d3.select(this).attr("stroke-width", 1);
                    // Reset text
                    d3.select(`.mean-text-${name}`).attr("font-weight", "normal");
                    
                    tooltip.style("visibility", "hidden");
                });

            // Add mean value label with hover interaction
            meanGroup.append("text")
                .attr("x", xScale(mean))
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("fill", color)
                .attr("font-size", "10px")
                .attr("transform", `rotate(-90 ${xScale(mean)} ${height / 2})`)
                .attr("class", `mean-text-${name}`)
                .style("cursor", "pointer")
                .text(`Mean: ${mean.toFixed(2)}`)
                .on("mouseover", function(event: MouseEvent) {
                    // Bold text
                    d3.select(this).attr("font-weight", "bold");
                    // Bold line
                    d3.select(`.mean-line-${name}`).attr("stroke-width", 2);
                    
                    tooltip
                        .style("visibility", "visible")
                        .html(`<strong>${name} Mean</strong><br/>Average Rating: ${mean.toFixed(2)}`)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 10}px`);
                })
                .on("mouseout", function() {
                    // Reset text
                    d3.select(this).attr("font-weight", "normal");
                    // Reset line
                    d3.select(`.mean-line-${name}`).attr("stroke-width", 1);
                    
                    tooltip.style("visibility", "hidden");
                });
        };

        addMeanLine(indiaMean, tokens.colorSuccess, "India");
        addMeanLine(usMean, tokens.colorInfo, "USA");
        addMeanLine(chinaMean, tokens.colorWarning, "China");

        // Interactive legend
        const legend = g.append("g")
            .attr("font-family", tokens.fontFamily)
            .attr("font-size", 10)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data([
                { color: tokens.colorSuccess, name: "India", count: indiaRatings.length },
                { color: tokens.colorInfo, name: "USA", count: usRatings.length },
                { color: tokens.colorWarning, name: "China", count: chinaRatings.length }
            ])
            .join("g")
            .attr("transform", (d, i) => `translate(${width - 180},${i * 20})`)
            .on("mouseover", function(event, d) {
                // Highlight corresponding line and area
                d3.select(`.line-${d.name}`).attr("stroke-width", 3);
                d3.select(`.area-${d.name}`).attr("opacity", 0.3);
                d3.selectAll(`.point-${d.name}`).attr("opacity", 1);
            })
            .on("mouseout", function(event, d) {
                // Reset highlights
                d3.select(`.line-${d.name}`).attr("stroke-width", 2);
                d3.select(`.area-${d.name}`).attr("opacity", 0.1);
                d3.selectAll(`.point-${d.name}`).attr("opacity", 0);
            });

        legend.append("line")
            .attr("x1", 0)
            .attr("x2", 19)
            .attr("y1", 10)
            .attr("y2", 10)
            .attr("stroke", d => d.color)
            .attr("stroke-width", 2);

        legend.append("text")
            .attr("x", 24)
            .attr("y", 10)
            .attr("dy", "0.35em")
            .attr("fill", tokens.colorText)
            .text(d => `${d.name} (${d.count} papers)`);

    }, [indiaRatings, usRatings, chinaRatings, mode, tokens]);

    // Cleanup tooltip on unmount
    useEffect(() => {
        return () => {
            d3.select("body").selectAll(".d3-tooltip").remove();
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{
                maxWidth: '100%',
                height: 'auto'
            }}
        />
    );
}
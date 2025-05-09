'use client'

import { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import { ThemeMode, ThemeModeContext } from '@/components/theme-context';
import useToken from 'antd/es/theme/useToken';
import countryCodeToName from "@/data/third-party/country_code_to_name.json";

interface TreemapProps {
    data: Record<string, number>;
    width: number | string;
    height: number | string;
    maxEntries?: number;
    keyToHighlight?: string;
}

interface TreemapData {
    name: string;
    value?: number;
    children?: TreemapData[];
}

type TreemapNode = d3.HierarchyRectangularNode<TreemapData>;

// LLM generated code
export default function TreemapChart({ data, width, height, maxEntries, keyToHighlight }: TreemapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const { mode, setMode } = useContext(ThemeModeContext);

    const tokens = useToken()[1]

    useEffect(() => {
        if (!svgRef.current || !data) return;

        // Clear any existing content
        d3.select(svgRef.current).selectAll("*").remove();

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

        // Convert data to hierarchical format
        const hierarchicalData: TreemapData = {
            name: "root",
            children: [
                ...Object.entries(data)
                    .sort(([,a], [,b]) => b - a) // Sort by value descending
                    .slice(0, maxEntries) // Take top maxEntries
                    .map(([country, value]) => ({
                        name: country,
                        value: value
                    })),
                {
                    name: "Other",
                    value: Object.entries(data)
                        .sort(([,a], [,b]) => b - a)
                        .slice(maxEntries) // Take remaining entries
                        .reduce((sum, [, value]) => sum + value, 0)
                }
            ]
        };

        // Create root hierarchy
        const root = d3.hierarchy(hierarchicalData)
            .sum(d => d.value || 0)

        // Create treemap layout
        const treemap = d3.treemap<TreemapData>()
            .size([svgRef.current.clientWidth, svgRef.current.clientHeight])
            .padding(1)
            .round(true)

        // Generate the treemap layout
        treemap(root);

        // Create the SVG container
        const svg = d3.select(svgRef.current);

        const dataExtent = d3.extent(root.leaves(), d => d.data.value)

        // Create color scale with a more pleasing color palette
        const colorScale = d3.scaleSequential(mode === ThemeMode.Dark ? d3.interpolateViridis : d3.interpolateGreens)
            .domain(dataExtent as [number, number])
        const highlightColorScale = d3.scaleSequential(d3.interpolateReds)
            // .domain(dataExtent as [number, number])

        // Add rectangles for each country with transitions and hover effects
        const nodes = svg
            .selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${(d as TreemapNode).x0},${(d as TreemapNode).y0})`);

        nodes
            .append("rect")
            .attr("width", d => (d as TreemapNode).x1 - (d as TreemapNode).x0)
            .attr("height", d => (d as TreemapNode).y1 - (d as TreemapNode).y0)
            .attr("fill", (d, i) => {
                if (keyToHighlight && d.data.name === keyToHighlight) {
                    return highlightColorScale(0.5);
                }
                return colorScale(d.data.value!);
            })
            .attr("rx", 2) // Rounded corners
            .attr("ry", 2)
            .style("stroke", tokens.colorBgBase)
            .style("stroke-width", 2)
            .style("transition", "all 0.3s ease")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .style("opacity", 0.5)
                    .style("cursor", "pointer")
                    .style("stroke", colorScale(0.9))

                    tooltip
                        .style("visibility", "visible")
                        .html(`<strong>${countryCodeToName.find((c) => c.code === d.data.name)?.name || d.data.name}</strong><br />Value: ${d.value}`);
            })
            .on("mousemove", function(event: MouseEvent) {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("filter", "none")
                    .style("stroke", tokens.colorBgBase)

                // Remove tooltip
                tooltip.style("visibility", "hidden");
            });

        // Add text labels
        nodes
            .append("text")
            .attr("x", 5)
            .attr("y", 20)
            .text(d => `${d.data.name}`)
            .attr("font-size", tokens.fontSizeHeading5)
            .attr("font-weight", tokens.fontWeightStrong)
            .attr("font-family", tokens.fontFamilyCode)
            .attr("fill", tokens.colorText)
            .style("pointer-events", "none")

        // Add value labels
        nodes
            .append("text")
            .attr("x", 5)
            .attr("y", 40)
            .text(d => d.value?.toString() || '0')
            .attr("font-size", tokens.fontSize)
            .attr("font-family", tokens.fontFamilyCode)
            .attr("fill", tokens.colorText)
            .style("pointer-events", "none");


    }, [data, width, height, mode, maxEntries]);
    
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
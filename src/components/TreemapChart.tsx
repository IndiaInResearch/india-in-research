'use client'

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreemapProps {
    data: Record<string, number>;
    width: number;
    height: number;
}

interface TreemapData {
    name: string;
    value?: number;
    children?: TreemapData[];
}

type TreemapNode = d3.HierarchyRectangularNode<TreemapData>;

// LLM generated code
export default function TreemapChart({ data, width, height }: TreemapProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data) return;

        // Clear any existing content
        d3.select(svgRef.current).selectAll("*").remove();

        // Convert data to hierarchical format
        const hierarchicalData: TreemapData = {
            name: "root",
            children: Object.entries(data).map(([country, value]) => ({
                name: country,
                value: value
            }))
        };

        // Create root hierarchy
        const root = d3.hierarchy(hierarchicalData)
            .sum(d => d.value || 0)
            .sort((a, b) => (b.value || 0) - (a.value || 0));

        // Create treemap layout
        const treemap = d3.treemap<TreemapData>()
            .size([width, height])
            .padding(1)
            .round(true)

        // Generate the treemap layout
        treemap(root);

        // Create the SVG container
        const svg = d3.select(svgRef.current);

        // Create color scale with a more pleasing color palette
        const colorScale = d3.scaleOrdinal(d3.schemeSet3);

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
            .attr("fill", (d, i) => colorScale(i.toString()))
            .attr("rx", 4) // Rounded corners
            .attr("ry", 4)
            .style("stroke", "#fff")
            .style("stroke-width", 2)
            .style("transition", "all 0.3s ease")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .style("opacity", 0.8)
                    .style("cursor", "pointer")
                    .style("filter", "brightness(110%)");
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("filter", "none");
            });

        // Add text labels with better styling and positioning
        nodes
            .append("text")
            .attr("x", 5)
            .attr("y", 20)
            .text(d => `${d.data.name}`)
            .attr("font-size", "14px")
            .attr("font-weight", "500")
            .attr("font-family", "system-ui, -apple-system, sans-serif")
            .attr("fill", "#2c3e50")
            .style("pointer-events", "none")
            .each(function(d) {
                const node = d as TreemapNode;
                const bbox = (this as SVGTextElement).getBBox();
                const availableWidth = node.x1 - node.x0;

                if (bbox.width > availableWidth - 10) {
                    d3.select(this)
                        .text(node.data.name.substring(0, 3) + "...")
                }
            });

        // Add value labels
        nodes
            .append("text")
            .attr("x", 5)
            .attr("y", 40)
            .text(d => d.value?.toString() || '0')
            .attr("font-size", "12px")
            .attr("font-family", "system-ui, -apple-system, sans-serif")
            .attr("fill", "#666")
            .style("pointer-events", "none");

        // Add tooltips
        nodes
            .append("title")
            .text(d => `${d.data.name}\nValue: ${d.value}`);

    }, [data, width, height]);

    return (
        <svg 
            ref={svgRef}
            width={width}
            height={height}
            style={{ 
                maxWidth: '100%', 
                height: 'auto',
                background: '#f8fafc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
        />
    );
} 
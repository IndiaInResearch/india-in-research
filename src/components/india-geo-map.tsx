'use client'

import { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import { ThemeModeContext, ThemeMode } from '@/components/theme-context';
import useToken from 'antd/es/theme/useToken';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import IndiaGeoJSON from '@/data/india.geojson';

export interface GeoMapDataInterface {
    name: string[];
    value: number[];
    coordinates: [number, number]; // [longitude, latitude]
}

interface IndiaGeoMapProps {
    width: number | string;
    height: number | string;
    data: GeoMapDataInterface[];
}

// LLM generated code
export default function IndiaGeoMap({ width, height, data }: IndiaGeoMapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const { mode } = useContext(ThemeModeContext);
    const tokens = useToken()[1];

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Create a projection for India
        const projection = d3.geoMercator()
            .center([82, 23]) // Approximately center of India
            .scale(Math.min(svgRef.current.clientWidth, svgRef.current.clientHeight) * 1.4)
            .translate([svgRef.current.clientWidth / 2, svgRef.current.clientHeight / 2]);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Create a group for the map
        const g = svg.append("g");

        const colorScale = d3.scaleSequential(d3.interpolatePurples)
            .domain([0, d3.max(data, d => {
                return Math.max(...d.value)
            }) as number]);

        // Draw India map
        g.selectAll("path")
            .data(IndiaGeoJSON.features)
            .enter()
            .append("path")
            .attr("d", (d: Feature) => pathGenerator(d))
            .attr("fill", mode === ThemeMode.Dark ?  tokens.colorInfoBg : tokens.colorSuccessBg)
            .attr("stroke", mode === ThemeMode.Dark ?  tokens.colorInfoBorder : tokens.colorSuccessBorder)
            .attr("stroke-width", 0.8);

        // Calculate radius scale based on population
        const populationExtent = d3.extent(data, d => Math.max(...d.value));
        const radiusScale = d3.scaleLinear()
            .domain(populationExtent as [number, number])
            .range([svgRef.current.clientHeight/80, svgRef.current.clientHeight/25]); 

        // Add circles for cities
        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => projection(d.coordinates)![0])
            .attr("cy", d => projection(d.coordinates)![1])
            .attr("r", d => radiusScale(Math.max(...d.value)))
            .attr("fill", d => colorScale(Math.max(...d.value)))
            .attr("fill-opacity", 0.8)
            .attr("stroke", tokens.colorPrimaryBorder)
            .attr("stroke-width", 0.8)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("fill-opacity", 1)
                    .attr("stroke-width", 2);

                let legend = ""
                for (let i = 0; i < d.name.length; ++i) {
                    legend += `${d.name[i]}: ${d.value[i]}; `;
                }

                // Add tooltip
                g.append("text")
                    .attr("class", "tooltip")
                    .attr("x", projection(d.coordinates)![0])
                    .attr("y", projection(d.coordinates)![1] - radiusScale(Math.max(...d.value)) - 5)
                    .attr("text-anchor", "middle")
                    .attr("fill", tokens.colorText)
                    .text(legend)
                    
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("fill-opacity", 0.8)
                    .attr("stroke-width", 0.8);
                
                // Remove tooltip
                g.selectAll(".tooltip").remove();
            });

    }, [data, mode, tokens]);

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
import React from 'react';
import './index.css'
import Api from './api';
import { wrap } from 'module';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import Suggestion from './suggestion';

export default class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.api = props.api || new Api();
    }
    render() {
        var svg = d3.select(".graphCanvas").append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("pointer-events", "all");

        this.api
            .getGraph()
            .then(graph => {
                let simulation = d3.forceSimulation(graph.nodes)
                    .force("charge", d3.forceManyBody())
                    .force("link", d3.forceLink(graph.links))
                    .force("center", d3.forceCenter());
                var node = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(graph.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("fill", "red");
                function tickActions() {
                    //update circle positions each tick of the simulation 
                    node
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function (d) { return d.y; });

                    //update link positions 
                    //simply tells one end of the line to follow one node around
                    //and the other end of the line to follow the other node around
                    link
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });

                }

                var link_force = d3.forceLink(graph.links)
                    .id(function (d) { return d.name; })

                //Add a links force to the simulation
                //Specify links  in d3.forceLink argument   


                simulation.force("links", link_force)
                //add tick instructions: 
                simulation.on("tick", tickActions);
                var link = svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(graph.links)
                    .enter().append("line")
                    .attr("stroke-width", 2);
            });
        return (
            <div className='graphCanvas'></div>
        )
    }
}

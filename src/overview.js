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
        this.state = { nodes: [], links: [] }
        this.api = props.api || new Api();
        this.renderGraph = this.renderGraph.bind(this);
    }
    componentDidMount() {
        this.renderGraph();
    }
    componentWillUnmount() {
        this.svg = null;
        this.simulation = null;
    }
    renderGraph() {
        let width = 800,
            height = 800;
        this.svg = d3.select(".graphCanvas").attr('width', width).attr('height', height);
        this.simulation = {};
        let graphPromise = this.api.getGraph();
        graphPromise.then(function (graph) {
            this.setState({ nodes: graph.nodes, links: graph.links });
            var graphLayout = d3.forceSimulation(graph.nodes)
                .force("charge", d3.forceManyBody().strength(-30))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("x", d3.forceX(width / 2).strength(1))
                .force("y", d3.forceY(height / 2).strength(1))
                .force("link", d3.forceLink(graph.links).id(function (d) { return d.id; }).distance(50).strength(1))
                .on("tick", ticked);

            var adjlist = [];

            graph.links.forEach(function (d) {
                adjlist[d.source.index + "-" + d.target.index] = true;
                adjlist[d.target.index + "-" + d.source.index] = true;
            });

            function neigh(a, b) {
                return a == b || adjlist[a + "-" + b];
            }


            let container = this.svg.append("g");

            this.svg.call(
                d3.zoom()
                    .scaleExtent([.1, 4])
                    .on("zoom", function () { container.attr("transform", d3.event.transform); })
            );

            var link = container.append("g").attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter()
                .append("line")
                .attr("stroke", "#aaa")
                .attr("stroke-width", "1px");

            var node = container.append("g").attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("fill", function (d) { return '#dd5566' })

            var labelNode = container.append("g").attr("class", "nodes")
                .selectAll("text")
                .data(graph.nodes)
                .enter()
                .append("text")
                .text((d, i) => d.title )
                .style("fill", "#555")
                .style("font-family", "Arial")
                .style("font-size", 12)
                .style("pointer-events", "none");

            node.on("mouseover", focus).on("mouseout", unfocus);

            node.call(
                d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

            node.on("mouseover", focus).on("mouseout", unfocus);

            function ticked() {

                node.call(updateNode);
                link.call(updateLink);

            }

            function fixna(x) {
                if (isFinite(x)) return x;
                return 0;
            }

            function focus(d) {
                var index = d3.select(d3.event.target).datum().index;
                node.style("opacity", function (o) {
                    return neigh(index, o.index) ? 1 : 0.1;
                });
                link.style("opacity", function (o) {
                    return o.source.index == index || o.target.index == index ? 1 : 0.1;
                });
            }

            function unfocus() {
                node.style("opacity", 1);
                link.style("opacity", 1);
            }

            function updateLink(link) {
                link.attr("x1", function (d) { return fixna(d.source.x); })
                    .attr("y1", function (d) { return fixna(d.source.y); })
                    .attr("x2", function (d) { return fixna(d.target.x); })
                    .attr("y2", function (d) { return fixna(d.target.y); });
            }

            function updateNode(node) {
                node.attr("transform", function (d) {
                    return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
                });
            }

            function dragstarted(d) {
                d3.event.sourceEvent.stopPropagation();
                if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) graphLayout.alphaTarget(0);
                d.fx = null;
                d.fy = null;

            }

        }.bind(this))
    }


    render() {
        return (
            <div>
                <div>
                    {this.state.nodes.map(node => <p key={node.id}>{node.id}</p>)}
                    {this.state.links.map(link => <p key={link.source.toString() + link.target.toString()}>{link.source} {link.target}</p>)}
                </div>
                <svg className='graphCanvas' style={{ background: '#eeeeee' }}></svg>

            </div>
        )
    }
}

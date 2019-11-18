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
        this.state={nodes:[], links:[]}
        this.api = props.api || new Api();
        this.renderGraph = this.renderGraph.bind(this);
    }
    componentDidMount() {
        this.renderGraph();
    }
    componentWillUnmount() {
        this.svg=null;
        this.simulation=null;
    }
    renderGraph() {
        this.svg = d3.select(".graphCanvas");
        let width = +this.svg.attr("width"),
            height = +this.svg.attr("height");
        this.simulation={};
        let graphPromise=this.api.getGraph();
        let thisTransfer=this;
        graphPromise.then(graph=>{
                graph.nodes=graph.nodes.map(node=>Object.assign(node, {px:Math.random()*800, py:Math.random()*800}))
                thisTransfer.setState({nodes:graph.nodes, links:graph.links});
                thisTransfer.simulation = d3.forceSimulation(graph.nodes)
                    .force("charge", d3.forceManyBody())
                    .force("center", d3.forceCenter(width / 2, height / 2));
                let node = thisTransfer.svg.append("g")
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
                    .id(function (d) { return d.idx; })

                //Add a links force to the simulation
                //Specify links  in d3.forceLink argument   


                thisTransfer.simulation.force("links", link_force)
                //add tick instructions: 
                thisTransfer.simulation.on("tick", tickActions);
                var link = thisTransfer.svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(graph.links)
                    .enter().append("line")
                    .attr("stroke-width", 2);
            });
            
    }

    render() {
        return (
            <div>
            <div>
                {this.state.nodes.map(node=><p>{node.title}</p>)}
                {this.state.links.map(link=><p>{link.source} {link.target}</p>)}
            </div>
            <svg className='graphCanvas' width='800px' height='800px' style={{background:'#eeeeee'}}></svg>

            </div>
        )
    }
}

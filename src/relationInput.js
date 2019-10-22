import React from 'react';
import ReactDOM from 'react-dom';
import TagsInput from 'react-tagsinput'
import scrollArea from 'react-scrollbar';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { read } from 'fs';
import { tsImportEqualsDeclaration } from '@babel/types';
import Api from './api';
import { Time } from 'neo4j-driver/types/v1';
import { ReactComponent } from '*.svg';

class RelationInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { scratch: '', relations: [] };
        this.api = new Api();
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.state.scratch = event.target.value;
    }

    render() {
        return (
            <div>
                <div style={{display:'flex', flexDirection:'column'}}>

                </div>
            <div style={{ background: this.props.inputColor }}>
                <input value={this.state.scratch} onChange={this.handleChange} placeholder="Notes" />
            </div>
            </div>

        )
    }
}

class Relation extends React.Component{
    constructor(props){
        super(props);
        this.state={type:'', polarity:true, strength:0}
    }
    render(){
        return (
            <div>
                <span style={{background:}}
            </div>
        )
    }
}
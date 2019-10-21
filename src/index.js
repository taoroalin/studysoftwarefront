import React from 'react';
import ReactDOM from 'react-dom';
import TagsInput from 'react-tagsinput'
import scrollArea from 'react-scrollbar';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { read } from 'fs';
import { tsImportEqualsDeclaration } from '@babel/types';

class Header extends React.Component {
    render() {
        return (
            <div className="header" >
                <div
                    style={{
                        position: 'absolute',
                        textAlign: 'center',
                        left: '50%',
                        transform: 'translate(-50%, -10%) scaleX(1.1)',
                        //background: '#efefef',
                        color: '#41b8cc',
                    }}>
                    <h1 style={{
                        fontWeight: 'lighter',
                        fontSize: '38px',

                    }}>Study Software</h1>
                </div>
            </div>
        )
    }
}

class Footer extends React.Component {
    render() {
        return (<p style={{
            position: 'absolute',
            bottom: 0,
            left:0,
            right:0,
            textAlign: 'center',
            color: 'grey'
        }}>Prototype v1</p>)
    }
}

class Overview extends React.Component {
    render() {
        return (
            <div className="overview"></div>
        )
    }
}

class Test extends React.Component {
    render() {
        return (
            <div className="overview"></div>
        )
    }
}

class QuickInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            definition: '',
            notes: '',
            relations: []
        };
        this.dced = '';
        this.handleChange = this.handleChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleRelationChange = this.handleRelationChange.bind(this);
    }
    clearForm() {
        this.setState({
            title: '',
            definition: '',
            notes: '',
            relations: []
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleRelationChange(relations) {
        this.setState({ relations })
    }
    renderRelation(props) {
        let { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other } = props
        return (
            <span style={{ display: 'block', width: '35%', fontSize: '18px', background: '#b8f5ff', padding: '0px 4px 0px 4px', margin: '4px 0px 4px 14px', borderRadius: '3px' }} key={key} {...other}>
                {getTagDisplayValue(tag)}
                {!disabled &&
                    <a className={classNameRemove} onClick={(e) => onRemove(key)} />
                }
            </span>
        )
    }

    render() {
        return (
            <form className="quickInput"
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '30%',
                    transform: 'translate(-50%, -50%)'
                }}
                onKeyPress={(event) => {
                    if (event.key == "Enter") {
                        if (!!window.event.shiftKey && event.target.nextSibling) {
                            event.target.nextSibling.focus();
                            event.preventDefault();
                        } else {
                            this.clearForm();
                            document.getElementsByName('title')[0].focus();
                            console.log(this.state.title + this.state.definition + this.state.notes);
                            console.log(this.state.relations);
                        }
                    }
                }
                }>
                <input name="title"
                    value={this.state.title} onChange={this.handleChange} placeholder="Unique Title"></input>
                <input name="definition"
                    value={this.state.definition} onChange={this.handleChange} placeholder="Definition"></input>
                <TagsInput addKeys='[9]' props={{ placeholder: 'relations' }} value={this.state.relations} onChange={this.handleRelationChange} renderTag={this.renderRelation} />
                <input name="notes"
                    value={this.state.notes} onChange={this.handleChange} placeholder="Notes"></input>
                <p style={{ color: 'red' }}>{this.dced}</p>
            </form>
        );
    }
}

ReactDOM.render(
    <div>
        <Header />
        <QuickInput />
        <Footer />
    </div>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

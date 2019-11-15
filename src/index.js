import React from 'react';
import ReactDOM from 'react-dom';
import TagsInput from 'react-tagsinput';
import RelationInput from './relationInput';
import scrollArea from 'react-scrollbar';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { read } from 'fs';
import { tsImportEqualsDeclaration } from '@babel/types';
import TextareaAutosize from 'react-textarea-autosize';
import Api from './api';
import Suggestion from './suggestion';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mode: 'add' };
        this.states = { add: <QuickInput />, test: <Test />, edit: <Overview />, about: <About /> }
    }
    render() {
        return (
            <div>
                <div className="header">
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        display: 'flex',
                        flexDirection: 'horizontal'
                    }}>
                        <h1 onClick={() => this.setState({ mode: 'about' })} style={{ margin: '4px 0 0px 20px' }}>Study Software</h1>
                    </div>
                    <div style={{ display: 'absolute', right: 0, top: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <h3 onClick={() => this.setState({ mode: 'test' })}>Test</h3>
                            <h3 onClick={() => this.setState({ mode: 'edit' })}>Edit</h3>
                            <h3 onClick={() => this.setState({ mode: 'add' })}>Add</h3>
                        </div>
                    </div>
                    {this.states[this.state.mode]}
                    <Footer />
                </div>
                {}
            </div>
        )
    }
}

class Footer extends React.Component {
    render() {
        return (<p style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey'
        }}>Prototype v1</p>)
    }
}

class Overview extends React.Component {
    render() {
        return (
            <div className="overview">
                <div className="overviewHeader">

                </div>
            </div>
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
            relations: [],
            created: 0,
            user: 'Tao',
        };
        this.confirmation = false;
        this.api = new Api();
        this.refs = { definition: React.createRef(), notes: React.createRef(), relations: React.createRef(), title: React.createRef() };
        this.titleRef = React.createRef();
        this.inputs = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleRelationChange = this.handleRelationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNext = this.handleNext.bind(this);
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
    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    }

    handleRelationChange(relations) {
        this.setState({ relations: relations })
    }

    handleSubmit(event) {
        if (event.key === "Enter" && !!window.event.shiftKey) {
            this.api.createNoteRelation(this.state, (r) => { if (r.result) { this.confirmation = true; setTimeout(() => this.confirmation = false, 2000) } });
            this.titleRef.current.focus();
            this.setState({ created: 0 });
            this.clearForm();
            event.preventDefault();
        }
    }

    handleNext(event) {
        if (event.key === "Enter" && !window.event.shiftKey && event.target.nextSibling) {
            event.target.nextSibling.focus();
            event.preventDefault();
        }
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
                onKeyPress={this.handleSubmit}>
                <Suggestion name='title' width={300} height={2}
                    value={this.state.title} onChange={this.handleTitleChange} placeholder="Unique Title" ref={this.titleRef} />
                <TextareaAutosize name="definition" maxLength='80' ref={this.refs.definition}
                    value={this.state.definition} onChange={this.handleChange} onKeyPress={this.handleNext} placeholder="Definition" />
                <TextareaAutosize name="notes" maxLength='150' ref={this.refs.notes}
                    value={this.state.notes} onChange={this.handleChange} onKeyPress={this.handleNext} placeholder="Notes" />
                <RelationInput
                    name='relations'
                    relations={this.state.relations}
                    ref={this.refs.relations}
                    placeholder='Relations'
                    onRelationChange={this.handleRelationChange}
                    api={this.api} />
                {this.confirmation ? <Confirmation /> : null}
            </form>
        );
    }
}

class About extends React.Component {
    render() {
        return (
            <div className='about'
                style={{
                    color: 'grey',
                    position: 'absolute',
                    left: '50%',
                    top: '40%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                }}>
                <p>Study Software</p>
                <p>By Tao Lin</p>
                <p>taoroalin@gmail.com</p>
                <p>Built using React, Neo4j</p>
                <p hidden>D3, and HerokuApp</p>
            </div>
        )
    }
}

class Confirmation extends React.Component {
    render() {
        return (
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }} >
                <p>Saved</p>
            </div>
        )
    }
}

ReactDOM.render(
        <Header />
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

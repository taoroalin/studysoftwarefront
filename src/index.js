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

class Header extends React.Component {

    addMode() {
        ReactDOM.render(
            <div>
                <Header />
                <QuickInput />
                <Footer />
            </div>,
            document.getElementById('root')
        )
    }

    testMode() {
        ReactDOM.render(
            <div>
                <Header />
                <Test />
                <Footer />
            </div>,
            document.getElementById('root')
        )
    }

    editMode() {
        ReactDOM.render(
            <div>
                <Header />
                <Overview />
                <Footer />
            </div>,
            document.getElementById('root')
        )
    }

    aboutMode() {
        ReactDOM.render(
            <div>
                <Header />
                <About />
                <Footer />
            </div>,
            document.getElementById('root')
        )
    }

    render() {
        return (
            <div className="header"
            >
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    display: 'flex',
                    flexDirection: 'horizontal'
                }}>
                    <h1 onClick={this.aboutMode} style={{ margin: '4px 0 0px 20px' }}>Study Software</h1>
                </div>
                <div style={{ display: 'absolute', right: 0, top: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <h3 onClick={this.testMode}>Test</h3>
                        <h3 onClick={this.editMode}>Edit</h3>
                        <h3 onClick={this.addMode}>Add</h3>
                    </div>
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
            reviewHistory: [],
            user: 'Tao',
        };
        this.api = new Api();
        this.dced = '';
        this.handleChange = this.handleChange.bind(this);
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
        if (event.target.name == 'title') {
            this.api.suggestSubjects(event.target.value);

        } else if (event.target.name == 'definition') {
            this.api.suggestRelations(event.target.value);
        }
        this.setState({ [event.target.name]: event.target.value });
    }

    handleRelationChange(relations) {
        this.setState({ relations:relations })
    }

    handleSubmit(event) {
        if (event.key == "Enter" && (!!window.event.shiftKey && event.target.nextSibling)) {
            this.clearForm();
            document.getElementsByName('title')[0].focus();
            this.setState({created:0});
            this.api.createNoteRelation(this.state);
        }
    }

    handleNext(event) {
        if (event.key == "Enter" && !(!!window.event.shiftKey && event.target.nextSibling)) {

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
                <TextareaAutosize name="title" maxLength='35'
                    value={this.state.title} onChange={this.handleChange} onKeyPress={this.handleNext} placeholder="Unique Title" />
                <TextareaAutosize name="definition" maxLength='80'
                    value={this.state.definition} onChange={this.handleChange} onKeyPress={this.handleNext} placeholder="Definition" />
                <RelationInput
                    placeholder='relations'
                    onRelationChange={this.handleRelationChange}
                    api={this.api}/>
                <TextareaAutosize name="notes" maxLength='150'
                    value={this.state.notes} onChange={this.handleChange} onKeyPress={this.handleNext} placeholder="Notes" />
                <p style={{ color: 'red' }}>{this.dced}</p>
            </form>
        );
    }
}

class About extends React.Component {
    render() {
        return (
            <div className='about'>
                <p>Study Software</p>
                <p>By Tao Lin</p>
                <p>taoroalin@gmail.com</p>
                <p>Built using React, Neo4j</p>
                <p hidden>D3, and HerokuApp</p>
            </div>
        )
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

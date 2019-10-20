import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { read } from 'fs';

class Header extends React.Component {
    render() {
        return (
            <div className="header" >
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        left: '50%',
                        transform: 'translate(-50%, 0%) scaleX(1.1)',
                        background: '#efefef',
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
            top: '100%',
            width: '100%',
            textAlign: 'center'
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

class QuickInput extends React.Component {
    render() {
        return (
            <div className="quickInput"
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '30%',
                    transform: 'translate(-50%, -50%)'

                }}>
                <input placeholder="Unique Title"></input>
                <input placeholder="Definition"></input>

            </div>
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

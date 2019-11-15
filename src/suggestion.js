import React from 'react';
import './index.css'
import Api from './api';
import { wrap } from 'module';
import TextareaAutosize from 'react-textarea-autosize';
import ReactDOM from 'react-dom';
import { read } from 'fs';

class Option extends React.Component {
    render() {
        return (<p className={this.props.highlighted ? 'region-dark' : 'region'}
            style={{ fontSize: '14px', margin: '1px', padding: '3px' }}>{this.props.value}</p>)
    }
}

class InputAutoSize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxWidth: props.maxWidth || 200,
            maxHeight: props.maxHeight || 1,
        }
        this.onChange = this.onChange.bind(this);
        this.getTextWidth = this.getTextWidth.bind(this);
        this.inputRef = React.createRef();
        this.focus = this.focus.bind(this);
        if (!this.props.placeholder) {
            this.props.placeholder = 'placeholder'
        }
    }
    focus() {
        this.inputRef.current.focus();
    }
    getTextWidth(text, font, fontSize) {
        return text.length * 12;
        /*
        // re-use canvas object for better performance
        var canvas = this.canvas || (this.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        canvas.fontSize=fontSize;
        var metrics = context.measureText(text);
        return metrics.width;
        */
    }

    onChange(event) {
        let width = this.getTextWidth(event.target.value);
        if (!(width > this.state.maxHeight * this.state.maxWidth)) {
            this.props.onChange(event);
        }
    }

    render() {
        let dummy = () => { console.log("dummy") };
        let txt = this.props.value.length > this.props.placeholder.length ? this.props.value : this.props.placeholder;
        let textLength = this.getTextWidth(txt);
        let width = Math.ceil(textLength > this.state.maxWidth ? this.state.maxWidth : textLength) + 'px';
        let height = Math.ceil(textLength / this.state.maxWidth);
        return (
            <textarea style={{ width: width }} rows={height} onChange={this.onChange}
                value={this.props.value} placeholder={this.props.placeholder}
                onKeyDown={this.props.onKeyDown || dummy}
                onKeyUp={this.props.onKeyUp || dummy}
                onKeyPress={this.props.onKeyPress || dummy}
                onBlur={this.props.onBlur || dummy}
                ref={this.inputRef}></textarea>
        )
    }
}

export default class Suggestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            highlighted: 0,
            type: props.type === 'subject',
        }
        this.api = props.api || new Api();
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.inputRef = React.createRef();
        this.focus = this.focus.bind(this);
    }

    focus() {
        this.inputRef.current.focus();
    }

    onChange(event) {
        switch (this.type) {
            case false:
                this.api.suggestRelations({ relation: event.target.value, max: 3 }, relations => this.setState({ suggestions: relations, highlighted: 0 }));
                break;
            default:
                this.api.suggestSubjects({ subject: event.target.value, max: 3 }, subjects => this.setState({ suggestions: subjects, highlighted: 0 }));
                break;
        }
        this.props.onChange({ target: Object.assign(event.target, { name: this.props.name }) });
    }

    onKeyDown(event) {
        if (event.key === "Enter" && !window.event.shiftKey) {
            if (this.state.suggestions.length > 0) {
                this.setState({ highlighted: (this.state.highlighted + 1) % this.state.suggestions.length });
                this.props.onChange({ target: { value: this.state.suggestions[this.highlighted], name: this.props.name } })
                event.preventDefault();
            }
        }
        if(this.props.onKeyDown){
            this.props.onKeyDown(event);
        }
    }

    render() {
        let dummy = () => { console.log("dummy") };
        let options = []
        for (let i = 0; i < this.state.suggestions.length; i++) {
            options.push(<Option key={this.state.suggestions[i]} highlighted={this.state.highlighted === i} value={this.state.suggestions[i]} />)
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <InputAutoSize maxWidth={this.props.width} maxHeight={this.props.height}
                    placeholder={this.props.placeholder}
                    onChange={this.onChange}
                    value={this.props.value}
                    onKeyDown={this.onKeyDown}
                    onBlur={() => {
                        if(this.state.suggestions.length>0){
                            this.props.onChange({ target: { value: this.state.suggestions[this.state.highlighted], name: this.props.name } });
                            this.setState({ suggestions: [] });
                        }
                        if (this.props.done) { this.props.done() }
                    }}
                    ref={this.inputRef}
                    onKeyUp={this.props.onKeyUp || dummy}
                    onKeyPress={this.props.onKeyPress || dummy} />
                {options}
            </div>
        )
    }
}
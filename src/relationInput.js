import React from 'react';
import './index.css'
import Api from './api';
import { wrap } from 'module';
import TextareaAutosize from 'react-textarea-autosize';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import Suggestion from './suggestion';



class Relation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relation: this.props.relation,
            polarity: this.props.polarity || '',
            subject: this.props.subject,
            strength: 0
        }
        this.arrow = this.arrow.bind(this);
    }
    arrow() {
        if (this.state.polarity) {
            return "→";
        } else {
            return "↛"
        }
    }
    render() {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span style={{}}>{this.state.relation}</span>
                    <span style={{ backgroundColor: '#ffffff', padding: 0, margin: '2px' }}>{this.arrow()}</span>
                    <span style={{}}>{this.state.subject}</span>
                </div>
            </div>
        )
    }
}

export default class RelationInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relation: '',
            subject: '',
            polarity: true,
        };
        this.api = props.api || new Api();
        this.handleRelationChange = this.handleRelationChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.createRelation = this.createRelation.bind(this);
        this.focus = this.focus.bind(this);
        this.subjectFocus = this.subjectFocus.bind(this);
        this.relationInputRef = React.createRef();
        this.subjectInputRef = React.createRef();
    }

    focus() {
        this.relationInputRef.current.focus();
    }
    subjectFocus() {
        this.subjectInputRef.current.focus();
    }

    handleRelationChange(event) {
        this.setState({ relation: event.target.value });
    }
    handleSubjectChange(event) {
        this.setState({ subject: event.target.value });
    }

    add(list, item) {
        let z = list;
        z.push(item);
        return z;
    }

    arrow() {
        if (this.state.polarity) {
            return "→";
        } else {
            return "↛"
        }
    }

    createRelation() {
        if (this.state.relation === '') {
            this.focus();
        } else {
            if (this.state.subject !== '') {
                let relation = { relation: this.state.relation, subject: this.state.subject, polarity: this.state.polarity };
                this.setState({ relation: '', subject: '', polarity: true });
                this.props.onRelationChange(this.add(this.props.relations, relation));
                this.focus();
            } else {
                ReactDOM.findDOMNode(this).nextSibling.focus();
            }
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px' }}>
                    {this.props.relations.map((relation) =>
                        <Relation relation={relation.relation}
                            subject={relation.subject}
                            polarity={relation.polarity}
                            key={relation.relation.toString() + relation.subject.toString()} />)}
                </div>
                <div style={{ width: '100px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Suggestion width={250} height={1}
                            value={this.state.relation}
                            className='relationInput'
                            ref={this.relationInputRef}
                            onChange={this.handleRelationChange}
                            placeholder='Relation'
                        />
                        <span style={{ borderRadius: '4', background: 'inherit', margin: '18px 0px 18px 0px' }}>{this.arrow()}</span>
                        <Suggestion width={250} height={1}
                            value={this.state.subject}
                            className='subjectInput'
                            ref={this.subjectInputRef}
                            onChange={this.handleSubjectChange}
                            done={this.createRelation}
                            placeholder='Subject'
                        />
                    </div>
                </div>
            </div>
        )
    }
}
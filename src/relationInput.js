import React from 'react';
import './index.css'
import Api from './api';
import { wrap } from 'module';
import TextareaAutosize from 'react-textarea-autosize';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';



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
            relations: [],
            suggestedRelations: [],
            selectedRelation: '',
            suggestedSubjects: [],
            suggestedSubject: '',
            relationFocus: false,
            subjectFocus: false,
        };
        this.api = props.api || new Api();
        this.handleRelationChange = this.handleRelationChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.handleRelationPress = this.handleRelationPress.bind(this);
        this.handleSubjectPress = this.handleSubjectPress.bind(this);
        this.focus = this.focus.bind(this);
        this.subjectFocus = this.subjectFocus.bind(this);
        this.relationInputRef = React.createRef();
        this.subjectInputRef = React.createRef();
    }

    focus() {
        this.relationRef.current.focus();
        this.setState({relationFocus:true, subjectFocus:false});
    }
    subjectFocus() {
        this.subjectRef.current.focus();
        this.setState({relationFocus:false, subjectFocus:true});
    }

    handleRelationChange(event) {
        this.setState({ relation: event.target.value });
        this.api.suggestRelations({ relation: this.state.relation, max: 3 }, relations => this.setState({ suggestedRelations: relations }));
    }
    handleSubjectChange(event) {
        this.setState({ subject: event.target.value });
        this.api.suggestSubjects({ subject: this.state.subject, max: 3 }, subjects => this.setState({ suggestedSubjects: subjects }));
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

    handleSubjectPress(event) {
        if (this.state.relation === '') {
            this.focus();
        } else if (event.key == "Enter" && !window.event.shiftKey) {
            if (this.state.subject !== '') {
                let relation = { relation: this.state.relation, subject: this.state.subject, polarity: this.state.polarity };
                this.setState({
                    relations: this.add(this.state.relations, relation)
                });
                this.setState({ relation: '', subject: '', polarity: true });
                this.props.onRelationChange(this.state.relations);
                this.focus();
            } else {
                ReactDOM.findDOMNode(this).nextSibling.focus();
            }
            event.preventDefault();

        }
    }

    handleRelationPress(event) {
        if (event.key == "Enter" && !window.event.shiftKey && this.state.relation !== '') {
            this.subjectFocus();
            event.preventDefault();
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px' }}>
                    {this.state.relations.map((relation) =>
                        <Relation relation={relation.relation}
                            subject={relation.subject}
                            polarity={relation.polarity}
                            key={relation.relation.toString() + relation.subject.toString()} />)}
                </div>
                <div style={{ width: '100px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <input size={this.state.relation.length>5?this.state.relation.length:5}
                        className='relationInput'
                            ref={this.relationInputRef}
                            value={this.state.relation}
                            onChange={this.handleRelationChange}
                            onKeyPress={this.handleRelationPress}
                            placeholder='Relation'
                             />
                        <span style={{ borderRadius: '4', background: 'inherit', margin: '18px 0px 18px 0px' }}>{this.arrow()}</span>
                        <input size={this.state.subject.length>5?this.state.subject.length:5}
                            className='subjectInput'
                            ref={this.subjectInputRef}
                            value={this.state.subject}
                            onChange={this.handleSubjectChange}
                            onKeyPress={this.handleSubjectPress}
                            placeholder='Subject'
                             />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px' }}>
                        {this.state.suggestedRelations.map((relation) =>
                            <p>{relation}</p>)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px' }}>
                        {this.state.suggestedSubjects.map((subject) =>
                            <p>{subject}</p>)}
                    </div>
                </div>
            </div>
        )
    }
}
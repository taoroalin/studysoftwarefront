import React from 'react';
import './index.css'
import Api from './api';
import { wrap } from 'module';
import TextareaAutosize from 'react-textarea-autosize';


class Relation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
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
                    <span style={{}}>{this.state.type}</span>
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
        this.state = { scratch: '', type: '', polarity: true, subject: '', relations: [] };
        this.api = props.api || new Api();
        this.handleChange = this.handleChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
    }

    handleChange(event) {
        this.setState({ 'scratch': event.target.value });
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

    handleSwitch(event) {
        if (event.key == "Backspace" && this.state.scratch === '') {
            this.setState({ polarity: !this.state.polarity })
        }
    }

    handleNext(event) {
        if (event.key == "Enter" && !window.event.shiftKey) {
            if (this.state.scratch !== '') {
                if (this.state.type === '') {
                    this.setState({ type: this.state.scratch, scratch: '' });
                } else if (this.state.subject === ''){
                    this.setState({ subject: this.state.scratch, scratch: '' });
                }else{
                    let relation = { type: this.state.type, subject: this.state.subject, polarity: this.state.polarity };
                    this.setState({
                        relations: this.add(this.state.relations, relation)
                    });
                    this.setState({ scratch: '', type: this.state.scratch, subject: '', polarity: true });
                    this.props.onRelationChange(this.state.relations);
                }
            } else {
                let relation = { type: this.state.type, subject: this.state.subject, polarity: this.state.polarity };
                this.setState({
                    relations: this.add(this.state.relations, relation)
                });
                this.setState({ type: '', subject: '', polarity: true });
                this.props.onRelationChange(this.state.relations);
            }

            event.preventDefault();
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft:'11px'}}>
                    {this.state.relations.map((relation) =>
                        <Relation type={relation.type}
                            subject={relation.subject}
                            polarity={relation.polarity}
                            key={relation.type.toString() + relation.subject.toString()} />)}
                </div>
                <div style={{ width: '100px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {this.state.type === '' ? null : <span style={{ borderRadius: '4', padding: '3px', margin:'17px 4px 17px 11px' }}>{this.state.type}</span>}
                        {this.state.subject === '' ? null : <span style={{ borderRadius: '4', background: 'inherit', margin:'18px 0px 18px 0px'}}>{this.arrow()}</span>}
                        {this.state.subject === '' ? null : <span style={{ borderRadius: '4', padding: '3px', margin:'17px 4px 17px 4px'  }}>{this.state.subject}</span>}
                        <input value={this.state.scratch}
                            onChange={this.handleChange}
                            onKeyPress={this.handleNext}
                            onKeyDown={this.handleSwitch}
                            placeholder={this.props.placeholder}
                            style={{marginTop:'4px', marginBottom:'0px'}} />
                    </div>
                </div>
            </div>
        )
    }
}
import React from 'react';
import './index.css'
import Api from './api';
import { wrap } from 'module';


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
        this.relationElements = [];
        this.api = new Api();
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

    handleSwitch(event){
        if (event.key == "Backspace" && this.state.scratch === ''){
            this.setState({polarity:!this.state.polarity})
        }
    }

    handleNext(event) {
        if (event.key == "Enter" && !window.event.shiftKey) {
            if (this.state.scratch !== '') {
                if (this.state.type === '') {
                    this.setState({ type: this.state.scratch, scratch: '' });
                } else {
                    this.setState({ subject: this.state.scratch, scratch: '' });
                }
            } else {
                this.setState({
                    relations: this.add(this.state.relations,
                        { type: this.state.type, subject: this.state.subject, polarity: this.state.polarity })
                });
                this.setState({ type: '', subject: '', polarity:true });
            }

            event.preventDefault();
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                    {this.state.relations.map((relation) =>
                        <Relation type={relation.type}
                            subject={relation.subject}
                            polarity={relation.polarity}
                            key={relation.type.toString() + relation.subject.toString()} />)}
                </div>
                <div style={{ width: '100px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {this.state.type === '' ? null : <span style={{ borderRadius: '4' }}>{this.state.type}</span>}
                        {this.state.subject === '' ? null : <span style={{ borderRadius: '4', flexWrap: 'nowrap' }}>{this.arrow()}</span>}
                        {this.state.subject === '' ? null : <span style={{ borderRadius: '4' }}>{this.state.subject}</span>}
                        <input value={this.state.scratch}
                            onChange={this.handleChange}
                            onKeyPress={this.handleNext}
                            onKeyDown={this.handleSwitch}
                            placeholder={this.props.placeholder} />
                    </div>
                </div>
            </div>
        )
    }
}
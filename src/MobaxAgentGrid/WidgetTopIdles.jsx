import React from 'react';
import { observable, computed, action, decorate, toJS } from 'mobx';


import agentsStore from "../stores/AgentsStore";
import RefData from '../stores/RefData';

// the skills filter component. this can be laid out much better in a 'React'
// way. there are design patterns you can apply to layout out your React classes.
// however, i'm not worried, as the intention here is to show you ag-Grid
// working with React, and that's all. i'm not looking for any awards for my
// React design skills.
export default class WidgetTopIdles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerProperty: props.timerProperty
        };

        console.log("widget props", props);
    }

    clearLogins() {
    }

    @action
    increaseTimer() {
    }

    @action
    externalTimer() {
    }

    render() {

        return (
            <div style={{width: 380}}>
                <div style={{
                    textAlign: 'center',
                    background: 'lightgray',
                    width: '100%',
                    display: 'block',
                    borderBottom: '1px solid grey'
                }}>
                    <div>
                        <label>TOP 3 AGENTS IN {this.state.timerProperty}</label>
                    </div>
                    <div>
                        <label>AGENT 1</label>&nbsp;&nbsp;&nbsp;<label>time</label>
                    </div>
                    <div>
                        <label>AGENT 2</label>&nbsp;&nbsp;&nbsp;<label>time</label>
                    </div>
                    <div>
                        <label>AGENT 3</label>&nbsp;&nbsp;&nbsp;<label>time</label>
                    </div>
                </div>
            </div>
        );
    }
}

import React from 'react';
import { observable, computed, action, reaction, decorate, toJS } from 'mobx';


import agentsStore from "../stores/AgentsStore";
import RefData from '../stores/RefData';
import Agent from '../classes/Agent';

// the skills filter component. this can be laid out much better in a 'React'
// way. there are design patterns you can apply to layout out your React classes.
// however, i'm not worried, as the intention here is to show you ag-Grid
// working with React, and that's all. i'm not looking for any awards for my
// React design skills.
export default class WidgetTopAgentsRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount() {
        // console.log('Row', this.props);
    }

    parseTime = (value) => {
        const currentTime = value;

        const minuteTime = currentTime % 3600;
    
        return {
          hours: Math.floor(currentTime / 3600),
          minutes: Math.floor(minuteTime / 60),
          seconds: minuteTime % 60,
          currentTime: currentTime
        };
    
    }

    render() {
        let value = 0; // this.props.value;
        if (this.props.widgetType === 'idle') {
            value = this.props.agent.status_idle;
        } else if (this.props.widgetType === 'mission') {
            value = this.props.agent.status_mission;
        } else if (this.props.widgetType === 'pause') {
            value = this.props.agent.status_pause;
        }

        const {
            seconds,
            minutes,
            hours,
            currentTime
        } = this.parseTime(value);

        const hoursStr = hours < 10 ? '0' + hours : hours;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    
        return (
            <div>
                <label>{this.props.agent.name}</label>&nbsp;&nbsp;&nbsp;<label>{`${hoursStr}:${minutesStr}:${secondsStr}`}</label>
            </div>
        );
    }
}

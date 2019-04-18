import React from 'react';
import { observable, computed, action, reaction, decorate, toJS } from 'mobx';


import agentsStore from "../stores/AgentsStore";
import RefData from '../stores/RefData';
import Agent from '../classes/Agent';
import WidgetTopAgentsRow from './WidgetTopAgentsRow';

// the skills filter component. this can be laid out much better in a 'React'
// way. there are design patterns you can apply to layout out your React classes.
// however, i'm not worried, as the intention here is to show you ag-Grid
// working with React, and that's all. i'm not looking for any awards for my
// React design skills.
export default class WidgetTopAgents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerProperty: props.timerProperty,
            agent1: new Agent(),
            agent2: new Agent(),
            agent3: new Agent()
        };

        this.agents = observable.map({});

        console.log("widget props", props);
    }

    componentDidMount() {
        let that = this;
        agentsStore.agents.forEach((item) => {
            that.trackAgent(item);
        });
    }

    trackAgent(agent) {
        const agentDisposer = reaction(
            () => toJS(agent),
            jsAgent => {
                // console.log(`Update ${agent.name}:\n${stringify(agent)}`);


                // console.log(`Reaction agent in widget ${this.state.timerProperty}`, agent);
                this.agents.set(agent.id, agent);
                // const jsAgents = [];
                // jsAgents.push(agent);

                // this.records.push(agent);

                // console.log('agents', this.data.agents);
                this.updateWidget();
            }
        );
        // this.discreteOrderDisposerMap.set(order.id, orderDisposer);
    }

    updateWidget() {
        const that = this;

        let agent1 = null;
        let agent2 = null;
        let agent3 = null;

        if (this.state.timerProperty === 'idle') {
            const ags = toJS([...this.agents]).sort((x, y) => y[1].status_idle - x[1].status_idle)

            this.setState({
                agent1: ags[0][1],
                agent2: ags[1][1],
                agent3: ags[2][1],
            });
        } else if (this.state.timerProperty === 'mission') {
            const ags = toJS([...this.agents]).sort((x, y) => y[1].status_mission - x[1].status_mission)

            this.setState({
                agent1: ags[0][1],
                agent2: ags[1][1],
                agent3: ags[2][1],
            });
        } else if (this.state.timerProperty === 'pause') {
            const ags = toJS([...this.agents]).sort((x, y) => y[1].status_pause - x[1].status_pause)

            this.setState({
                agent1: ags[0][1],
                agent2: ags[1][1],
                agent3: ags[2][1],
            });
        }


/*
        this.agents.forEach(x => {
            let value = 0;
            if (this.state.timerProperty === 'idle') {
                value = x.status_idle;
            } else if (this.state.timerProperty === 'mission') {
                value = x.status_mission;
            } else if (this.state.timerProperty === 'pause') {
                value = x.status_pause;
            }

            if (value )
        });
*/
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
                        <WidgetTopAgentsRow agent={this.state.agent1} widgetType={this.state.timerProperty} />
                    </div>
                    <div>
                        <WidgetTopAgentsRow agent={this.state.agent2} widgetType={this.state.timerProperty} />
                    </div>
                    <div>
                        <WidgetTopAgentsRow agent={this.state.agent3} widgetType={this.state.timerProperty} />
                    </div>
                </div>
            </div>
        );
    }
}

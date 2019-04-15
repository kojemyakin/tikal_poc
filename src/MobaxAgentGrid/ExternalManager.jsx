import React from 'react';
import { observable, computed, action, decorate, toJS } from 'mobx';
// import RefData from './RefData';

import agentsStore from "../stores/AgentsStore";

// the skills filter component. this can be laid out much better in a 'React'
// way. there are design patterns you can apply to layout out your React classes.
// however, i'm not worried, as the intention here is to show you ag-Grid
// working with React, and that's all. i'm not looking for any awards for my
// React design skills.
export default class ExternalManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    clearLogins() {
        console.log('clearLogins', agentsStore.agents);

        agentsStore.agents.forEach((item) => {
            item.login = 0;
            item.status_idle = 0;
            item.status_lactive = 0;
            item.status_mission = 0;
            item.status_mactive = 0;
            item.status_pause = 0;
            item.status_fpause = 0;
            item.status_d_hold = 0;
            item.calls = 0;
            item.incoming = 0;
        });
    }

    @action
    increaseTimer() {
        console.log('increaseTimer');

        agentsStore.agents.forEach((item) => {
            item.login = item.login + 1;
            item.status_idle = item.status_idle + 1;
            item.status_lactive = item.status_lactive + 1;
            item.status_mission = item.status_mission + 1;
            item.status_mactive = item.status_mactive + 1;
            item.status_pause = item.status_pause + 1;
            item.status_fpause = item.status_fpause + 1;
            item.status_d_hold = item.status_d_hold + 1;
            item.calls = item.calls + 10;
            item.incoming = item.incoming + 12;
        });
    }

    @action
    externalTimer() {
        setInterval(function () {
            agentsStore.agents.forEach((item) => {
                item.login = item.login + 1;
                item.status_idle = item.status_idle + 1;
                item.status_lactive = item.status_lactive + 1;
                item.status_mission = item.status_mission + 1;
                item.status_mactive = item.status_mactive + 1;
                item.status_pause = item.status_pause + 1;
                item.status_fpause = item.status_fpause + 1;
                item.status_d_hold = item.status_d_hold + 1;
                item.calls = item.calls + 10;
                item.incoming = item.incoming + 12;

                item.update = !item.update;
            });
    
        }, 1000);
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
                    <button onClick={this.clearLogins} className="btn btn-primary">Clear Login Time</button>
                    <button onClick={this.increaseTimer} className="btn btn-primary">Increase Timer</button>
                    <button onClick={this.externalTimer} className="btn btn-primary">Start External Update</button>
                </div>
            </div>
        );
    }
}

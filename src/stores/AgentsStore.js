import * as mobx from "mobx";
// , { observable, action, computed } from 'mobx';
// import { observer } from 'mobx-react';

import RowDataFactory from "../stores/RowDataFactory";
import Agent from "../classes/Agent";

//Enforcing Mobx Strict Mode - only change through @actions
// mobx.useStrict(true);

class AgentsStore {
    agents = mobx.observable([]);

    initAgents(iterations = 20) {
        this.agents = new RowDataFactory().createRowData(iterations);
        console.log('agents', this.agents);
    }

    @mobx.action
    addAgent(agent) {
        console.log("addAction");
        this.agents.push(agent);
    }

    @mobx.action
    updateAgent(agent) {
        const index = this.chance.integer({ min: 0, max: this.agents.length - 1 });
        // console.log('randomUpdate:',index);
        if (index >= 0 && index < this.agents.length) {
            // console.log('task:',task);
            this.agents[index] = { ...this.agents[index], agent };
        }
    }

    @mobx.computed
    get agentsArray() {
        console.log("agentsArray");
        return this.agents;
    }
}

let agentsStore = new AgentsStore();
agentsStore.initAgents(25);

export default agentsStore;

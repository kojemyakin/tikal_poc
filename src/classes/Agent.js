// import { observable, observer } from "mobx-react";
import { observable, decorate } from "mobx";

// @observer
class Agent {
    id = 0;
    name = '';
    skills = {
        android: 0,
        html5: 0,
        mac: 0,
        windows: 0,
        css: 0
    };
    country = '';
    continent = '';
    language = '';
    department = '';
    status = '';
    login = 0;
    status_idle = 0;
    status_lactive = 0;
    status_mission = 0;
    status_mactive = 0;
    status_pause = 0;
    status_fpause = 0;
    status_d_hold = 0;
    calls = 0;
    incoming = 0;
    update = false;
}

decorate(Agent, {
    // id: observable,
    // name: observable,
    // login: observable,
    // department: observable,
    // status: observable,
    // login: observable,
    // status_idle: observable,
    // status_lactive: observable,
    // status_mission: observable,
    // status_mactive: observable,
    // status_pause: observable,
    // status_fpause: observable,
    // status_d_hold: observable,
    // calls: observable,
    // incoming: observable,
    update: observable
});

// exports.Agent = Agent;
export default Agent;

// import { observable, observer } from "mobx-react";

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
}

// exports.Agent = Agent;
export default Agent;

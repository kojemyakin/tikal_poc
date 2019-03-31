import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import NavItem from "./NavItem";

import AgentGridComponent from "./AgentGrid/AgentGridComponent";
import MobaxAgentGridComponent from "./MobaxAgentGrid/MobaxAgentGridComponent";
import SimpleReduxDynamicExample from "./simpleReduxDynamicComponentExample/SimpleReduxExample";
import SimpleReduxHookExample from "./simpleReduxHooksExample/SimpleReduxHookExample";

const SideBar = () => (
    <div style={{float: "left", width: 250, marginRight: 25}}>
        <ul className="nav nav-pills">
            <NavItem to='/agent-grid'>Agents Grid</NavItem>
            <NavItem to='/mobax-agent-grid'>Mobax Agents Grid</NavItem>
            {/* 
              <NavItem to='/simple-redux-dynamic'>Simple Redux Dynamic Component Example</NavItem>
              <NavItem to='/simple-redux-hook'>Simple React Hook Component Example</NavItem>
            */}
        </ul>
    </div>
);

class App extends Component {
    render() {
        return (
            <div style={{display: "inline-block", width: "100%"}}>
                <SideBar/>
                <div style={{float: "left"}}>
                    <Switch>
                        <Redirect from="/" exact to="/agent-grid"/>
                        <Route exact path='/agent-grid' component={AgentGridComponent}/>
                        <Route exact path='/mobax-agent-grid' component={MobaxAgentGridComponent}/>
                        <Route exact path='/simple-redux-dynamic' component={SimpleReduxDynamicExample}/>
                        <Route exact path='/simple-redux-hook' component={SimpleReduxHookExample}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App

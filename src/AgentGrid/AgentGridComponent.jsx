import React, {Component} from "react";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import RowDataFactory from "./RowDataFactory";
import DateComponent from "./DateComponent.jsx";
import SkillsCellRenderer from './SkillsCellRenderer.jsx';
import StatusCellRenderer from './StatusCellRenderer.jsx';
import NameCellEditor from './NameCellEditor.jsx';
import ProficiencyCellRenderer from './ProficiencyCellRenderer.jsx';
import RefData from './RefData';
import SkillsFilter from './SkillsFilter.jsx';
import ProficiencyFilter from './ProficiencyFilter.jsx';
import HeaderGroupComponent from './HeaderGroupComponent.jsx';
import SortableHeaderComponent from './SortableHeaderComponent.jsx';

import "./AgentGridComponent.css";
// take this line out if you do not want to use ag-Grid-Enterprise
import "ag-grid-enterprise";
import { isTemplateSpan } from "typescript";

export default class AgentGridComponent extends Component {
    constructor(props) {
        super(props);

        this.time = 0;

        this.state = {
            timerId: null,
            quickFilterText: null,
            sideBar: false,
            sortByStatus: false,
            rowData: new RowDataFactory().createRowData(),
            rowCount: null,
            rowId: "",
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-times"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-alt-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-alt-up"/>',
                groupExpanded: '<i class="far fa-minus-square"/>',
                groupContracted: '<i class="far fa-plus-square"/>'
            }
        };

        console.log("QQQQQ", this.state.rowData);

        this.onStartTimer();
    }

    onStartTimer = () => {
        let that = this;

        this.state.timerId = setInterval(function () {
            that.time++;
            that.updateTime();
        }, 1000);
    };

    /* Grid Events we're listening to */
    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;

        this.calculateRowCount();
    };

    onCellClicked = (event) => {
        console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    };

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data.name);
    };

    /* Demo related methods */
    onToggleSidebar = (event) => {
        this.setState({sideBar: event.target.checked});
    };

    onToggleSortByStatus = (event) => {
        this.setState({
            sortByStatus: event.target.checked
        });
    };

    deselectAll() {
        this.api.deselectAll();
    }

    onQuickFilterText = (event) => {
        this.setState({quickFilterText: event.target.value});
    };

    onChangeRowId = (event) => {
        this.setState({
            rowId: event.target.value
        });
    };

    onRefreshData = () => {
        this.setState({
            rowData: new RowDataFactory().createRowData()
        });
    };

    updateTime = () => {
        let newRowData = [];
        let i = 0;
        this.state.rowData.forEach((item) => {
            // if (item.id == this.state.rowId) {
                var newItem = {
                    id: item.id,
                    name: item.name,
                    department: item.department,
                    status: RefData.AGENT_STATUS_CODES[Math.round(Math.random() * 10000) % RefData.AGENT_STATUS_CODES.length].name,
                    login: 0,
                    status_idle: this.time,
                    status_lactive: this.time,
                    status_mission: this.time,
                    status_mactive: this.time,
                    status_pause: this.time,
                    status_fpause: this.time,
                    status_d_hold: this.time,
                    calls: item.calls + 10,
                    incoming: item.incoming + 12
                }
                newRowData.push(newItem);
            // } else {
            //     newRowData.push(item);
            // }
        });

        if (this.state.sortByStatus) {
            const orderOfStatuses = [
                'Online',
                'Connect',
                'Pause',
                'ForcePause',
                'Mission',
            ];
            let sortData = [];
            orderOfStatuses.forEach(st => {
                let statusData = newRowData.filter( d => d.status === st);
                sortData = sortData.concat(statusData);
            });

            this.setState({
                rowData: sortData
            });
        } else {
            this.setState({
                rowData: newRowData
            });
        }
    };

    onUpdateRow1 = () => {
        let newRowData = [];
        let i = 0;
        this.state.rowData.forEach((item) => {
            // console.log("item", item);
            if (i++ < 15) {
                newRowData.push({
                    id: 1000,
                    name: "New name"
                });
            } else {
                newRowData.push(item); 
            }
            // item.id = 1000;
            // item.name = "New Name";
            // newRowData.push(item);
        });

        console.log('state.rowData: ', newRowData, this.state.rowId);

        this.setState({
            rowData: newRowData
        });
        // this.forceUpdate();
    };

    onUpdateRow2 = () => {
        let newRowData = [];
        let i = 0;
        this.state.rowData.forEach((item) => {
            if (item.id == this.state.rowId) {
                console.log("Updated Agent");
                
                var newItem = {
                    id: item.id,
                    name: "Updated Agent"
                }
                newRowData.push(newItem);
            } else {
                newRowData.push(item);
            }
        });

        console.log('state.rowData: ', newRowData, this.state.rowId);

        this.setState({
            rowData: newRowData
        });
        // this.forceUpdate();
    };

    onUpdateRow = () => {
        let newRowData = [];
        let i = 0;
        console.log(this.state.rowData.length);
        for (let i = 0; i < this.state.rowData.length; i++) {
            let item = this.state.rowData[i];

            if (item.id == this.state.rowId) {
                console.log('new item');

                var newItem = {
                    id: item.id,
                    name: "Updated Agent 2"
                }

                this.state.rowData[i] = newItem;
            }
        }

        console.log(this.state.rowData);
        this.setState({
            rowData: this.state.rowData
        });
        // this.forceUpdate();
    };

    invokeSkillsFilterMethod = () => {
        let skillsFilter = this.api.getFilterInstance('skills');
        let componentInstance = skillsFilter.getFrameworkComponentInstance();
        componentInstance.helloFromSkillsFilter();
    };

    dobFilter = () => {
        let dateFilterComponent = this.api.getFilterInstance('dob');
        dateFilterComponent.setModel({
            type: 'equals',
            dateFrom: '2000-01-01'
        });

        // as the date filter is a React component, and its using setState internally, we need
        // to allow time for the state to be set (as setState is an async operation)
        // simply wait for the next tick
        setTimeout(() => {
            this.api.onFilterChanged();
        });
    };

    calculateRowCount = () => {
        if (this.api && this.state.rowData) {
            const model = this.api.getModel();
            const totalRows = this.state.rowData.length;
            const processedRows = model.getRowCount();
            this.setState({
                rowCount: processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString()
            });
        }
    };

    static countryCellRenderer(params) {
        if (params.value) {
            return `<img border='0' width='15' height='10' style='margin-bottom: 2px' src='http://flags.fmcdn.net/data/flags/mini/${RefData.COUNTRY_CODES[params.value]}.png'> ${params.value}`;
        } else {
            return null;
        }
    }

    static statusCellRenderer(params) {
        if (params.value) {
            return `<img border='0' width='15' height='10' style='margin-bottom: 2px' src='/images/statuses/status_${RefData.AGENT_STATUS_CODES_GIF[params.value]}.gif'> ${params.value}`;
        } else {
            return null;
        }
    }

    static dateCellRenderer(params) {
        return AgentGridComponent.pad(params.value.getDate(), 2) + '/' +
            AgentGridComponent.pad(params.value.getMonth() + 1, 2) + '/' +
            params.value.getFullYear();
    }

    static pad(num, totalStringSize) {
        let asString = num + "";
        while (asString.length < totalStringSize) asString = "0" + asString;
        return asString;
    }

    render() {
        console.log("== RENDER ==");

        return (
            <div style={{width: '1500px'}}>
                <h1>AgGrid Example With Change States</h1>
                <div style={{display: "inline-block", width: "100%"}}>
                    <div style={{float: "left"}}>
                        <b>Agent Calls Processing: </b>{ this.state.rowCount }
                    </div>
                </div>
                <div style={{marginTop: 10}}>
                    <div>
                        <span>
                            <div style={{width: "200px", display: "inline-block"}}>Grid Actions:</div>
                            <button onClick={() => {
                                this.api.selectAll()
                            }} className="btn btn-primary">Select All</button>
                            <button onClick={() => {
                                this.api.deselectAll()
                            }} className="btn btn-primary">Clear Selection</button>
                            <button onClick={this.onRefreshData} className="btn btn-primary">Refresh Data</button>
                            <input type="text" id="rowId" value={this.state.rowId} onChange={this.onChangeRowId} placeholder="Type Agent Id for update"/>
                            <button onClick={this.onUpdateRow} className="btn btn-primary">Update Row</button>
                        </span>
                    </div>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10}}>
                        <span style={{float: "left"}}>
                            <div style={{width: "200px", display: "inline-block"}}>Column API:</div>
                            <button onClick={() => {
                                this.columnApi.setColumnVisible('country', false)
                            }} className="btn btn-primary">Hide Country Column</button>
                            <button onClick={() => {
                                this.columnApi.setColumnVisible('country', true)
                            }} className="btn btn-primary">Show Country Column</button>
                        </span>
                    </div>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10}}></div>
                    <span style={{float: "left"}}>
                            <div style={{width: "200px", display: "inline-block"}}>Filter API:</div>
                            <button onClick={this.invokeSkillsFilterMethod}
                                    className="btn btn-primary">Invoke Skills Filter Method
                            </button>
                            <button onClick={this.dobFilter} className="btn btn-primary">DOB equals to 01/01/2000
                            </button>
                            <div style={{float: "right", marginLeft: 20}}>
                                <label htmlFor="quickFilter">Quick Filter:&nbsp;</label>
                                <input type="text" id="quickFilter" onChange={this.onQuickFilterText} placeholder="Type text to filter..."/>
                            </div>
                    </span>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10}}>
                        <div style={{float: "left"}}>
                            <label htmlFor="sideBarToggle">Show Side Bar&nbsp;</label>
                            <input type="checkbox" id="sideBarToggle" onChange={this.onToggleSidebar} style={{marginRight: 5}}/>
                        </div>
                        <div style={{float: "right"}}>
                            <label htmlFor="sortByStatusToggle">Sort By Status&nbsp;</label>
                            <input type="checkbox" id="sortByStatusToggle" onChange={this.onToggleSortByStatus} style={{marginRight: 5}}/>
                        </div>
                    </div>
                    <div style={{height: 600, width: 1500}} className="ag-theme-balham">
                        <AgGridReact
                            // listening for events
                            onGridReady={this.onGridReady}
                            onRowSelected={this.onRowSelected}
                            onCellClicked={this.onCellClicked}
                            onModelUpdated={this.calculateRowCount}

                            // binding to simple properties
                            sideBar={this.state.sideBar}
                            quickFilterText={this.state.quickFilterText}

                            // binding to an object property
                            icons={this.state.icons}

                            // binding to array properties
                            rowData={this.state.rowData}

                            // no binding, just providing hard coded strings for the properties
                            // boolean properties will default to true if provided (ie suppressRowClickSelection => suppressRowClickSelection="true")
                            suppressRowClickSelection
                            rowSelection="multiple"
                            groupHeaders

                            // setting grid wide date component
                            dateComponentFramework={DateComponent}

                            // setting default column properties
                            defaultColDef={{
                                resizable: true,
                                sortable: true,
                                filter: true,
                                headerComponentFramework: SortableHeaderComponent,
                                headerComponentParams: {
                                    menuIcon: 'fa-bars'
                                }
                            }}>
                            <AgGridColumn headerName="#" width={30}
                                          checkboxSelection sortable={false} suppressMenu filter={false} pinned>
                            </AgGridColumn>
                            <AgGridColumn headerName="Agents" headerGroupComponentFramework={HeaderGroupComponent}>
                                <AgGridColumn field="id" width={75}
                                              pinned editable/>
                                <AgGridColumn field="name" width={130}
                                              cellEditorFramework={NameCellEditor}
                                              enableRowGroup enablePivot pinned editable/>
                                <AgGridColumn field="department" width={150}
                                              cellRenderer={AgentGridComponent.countryCellRenderer}
                                              filterParams={{
                                                  cellRenderer: AgentGridComponent.countryCellRenderer,
                                                  cellHeight: 20
                                              }}
                                              enableRowGroup enablePivot pinned editable/>
                                {/*
                                    <AgGridColumn field="country" width={150}
                                                cellRenderer={AgentGridComponent.countryCellRenderer}
                                                filterParams={{
                                                    cellRenderer: AgentGridComponent.countryCellRenderer,
                                                    cellHeight: 20
                                                }}
                                                enableRowGroup enablePivot pinned editable/>
                                */}
                                <AgGridColumn field="dob" width={175} headerName="DOB" filter="agDateColumnFilter"
                                              pinned columnGroupShow="open"
                                              cellRenderer={AgentGridComponent.dateCellRenderer}/>
                            </AgGridColumn>
                            <AgGridColumn headerName="Agent Status">
                                <AgGridColumn field="status" width={100}
                                              cellRenderer={AgentGridComponent.statusCellRenderer}
                                              filterParams={{
                                                  cellRenderer: AgentGridComponent.statusCellRenderer,
                                                  cellHeight: 20
                                              }}
                                              pinned editable/>
                            </AgGridColumn>
                            {/*
                                <AgGridColumn headerName="IT Skills">
                                    <AgGridColumn field="skills" width={120} enableRowGroup enablePivot sortable={false}
                                                cellRendererFramework={SkillsCellRenderer}
                                                filterFramework={SkillsFilter}/>
                                    <AgGridColumn field="proficiency" width={160} enableValue
                                                cellRendererFramework={ProficiencyCellRenderer}
                                                filterFramework={ProficiencyFilter}/>
                                </AgGridColumn>
                            */}
                            <AgGridColumn headerName="Timers">
                                <AgGridColumn field="login" width={98} filter="text"/>
                                <AgGridColumn field="status_idle" width={100} filter="text" headerName="Idle"
                                                cellRendererFramework={StatusCellRenderer}
                                />
                                <AgGridColumn field="status_lactive" width={100} filter="text" headerName="L.Active"
                                                cellRendererFramework={StatusCellRenderer}
                                />
                                <AgGridColumn field="status_mission" width={100} filter="text" headerName="Mission"
                                                cellRendererFramework={StatusCellRenderer}
                                />
                                <AgGridColumn field="status_mactive" width={100} filter="text" headerName="M.Active"
                                                cellRendererFramework={StatusCellRenderer}
                                />
                                <AgGridColumn field="status_pause" width={100} filter="text" headerName="Pause"
                                                cellRendererFramework={StatusCellRenderer}
                                />
                                <AgGridColumn field="status_fpause" width={100} filter="text" headerName="F.Pause"
                                                cellRendererFramework={StatusCellRenderer}
                                />
                                <AgGridColumn field="status_d_hold" width={100} filter="text" headerName="D.Hold"
                                                cellRendererFramework={StatusCellRenderer}
                                />
                            </AgGridColumn>
                            <AgGridColumn headerName="Status">
                                <AgGridColumn field="calls" width={100} filter="text"/>
                                <AgGridColumn field="incoming" width={100} filter="text"/>
                            </AgGridColumn>
                        </AgGridReact>
                    </div>
                </div>
            </div>
        );
    }
}

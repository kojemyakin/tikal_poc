import React, {Component} from "react";
import { observable, computed, action, decorate, toJS } from 'mobx';
import { observer } from 'mobx-react';
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import RowDataFactory from "./RowDataFactory";
import DateComponent from "./DateComponent.jsx";
import StatusCellRenderer from './StatusCellRenderer.jsx';
import NameCellEditor from './NameCellEditor.jsx';
import RefData from './RefData';
import HeaderGroupComponent from './HeaderGroupComponent.jsx';
import SortableHeaderComponent from './SortableHeaderComponent.jsx';

import "./MobaxAgentGridComponent.css";
// take this line out if you do not want to use ag-Grid-Enterprise
import "ag-grid-enterprise";
import { isTemplateSpan } from "typescript";

@observer
export default class MobaxAgentGridComponent extends Component {
    constructor(props) {
        super(props);

        this.time = 0;

        this.state = {
            timerId: null,
            quickFilterText: null,
            sideBar: false,
            sortByStatus: false,
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

        this.rowCount = 0;
        this.sortByStatus = false;
        this.mobxTableData = new RowDataFactory().createRowData();

        this.onStartTimer();
    }

    @observable rowCount;
    @observable sortByStatus;
    @observable mobxTableData;

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
        this.sortByStatus = event.target.checked;
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
        this.mobxTableData = new RowDataFactory().createRowData();
    };

    updateTime = () => {
        console.log('updateTime');

        let newRowData = [];
        let i = 0;
        this.mobxTableData.forEach((item) => {
            item.status = RefData.AGENT_STATUS_CODES[Math.round(Math.random() * 10000) % RefData.AGENT_STATUS_CODES.length].name;
            item.login = item.login + 1;
            item.status_idle = this.time;
            item.status_lactive = this.time;
            item.status_mission = this.time;
            item.status_mactive = this.time;
            item.status_pause = this.time;
            item.status_fpause = this.time;
            item.status_d_hold = this.time;
            item.calls = item.calls + 10;
            item.incoming = item.incoming + 12;

            newRowData.push(item);
        });

        if (this.sortByStatus) {
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

            var sort = [
                {colId: 'status', sort: 'asc'}
            ];

            this.api.updateRowData({ update: sortData });
            this.api.setSortModel(sort);
        } else {
            this.api.updateRowData({ update: newRowData });
            this.api.setSortModel(null);
        }
    };

    @computed
    get getFirstRow() {
        // console.log('getFirstRow');
        return this.mobxTableData[0].name;
    };

    calculateRowCount = () => {
        if (this.api && this.mobxTableData) {
            const model = this.api.getModel();
            const totalRows = this.mobxTableData.length;
            const processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString()
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
        return MobaxAgentGridComponent.pad(params.value.getDate(), 2) + '/' +
            MobaxAgentGridComponent.pad(params.value.getMonth() + 1, 2) + '/' +
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
                <h1>AgGrid Example With MobX</h1>
                <div style={{display: "inline-block", width: "100%"}}>
                    <div style={{float: "left"}}>
                        <b>Agent Calls Processing: </b>{ this.rowCount } ({ this.getFirstRow })
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
                            {/*
                                <input type="text" id="rowId" value={this.state.rowId} onChange={this.onChangeRowId} placeholder="Type Agent Id for update"/>
                                <button onClick={this.onUpdateRow} className="btn btn-primary">Update Row</button> 
                            */}
                        </span>
                    </div>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10}}>
                        <span style={{float: "left"}}>
                            <div style={{width: "200px", display: "inline-block"}}>Column API:</div>
                            <button onClick={() => {
                                this.columnApi.setColumnVisible('department', false)
                            }} className="btn btn-primary">Hide Department Column</button>
                            <button onClick={() => {
                                this.columnApi.setColumnVisible('department', true)
                            }} className="btn btn-primary">Show Department Column</button>
                        </span>
                    </div>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10}}>
                        <span style={{float: "left"}}>
                                {/*
                                <div style={{width: "200px", display: "inline-block"}}>Filter API:</div>
                                <button onClick={this.invokeSkillsFilterMethod}
                                        className="btn btn-primary">Invoke Skills Filter Method
                                </button>
                                <button onClick={this.dobFilter} className="btn btn-primary">DOB equals to 01/01/2000
                                </button>
                                */}
                            <div style={{width: "200px", display: "inline-block", marginRight: 5}}>Quick Filter:</div>
                            <input type="text" id="quickFilter" onChange={this.onQuickFilterText} placeholder="Type text to filter..."/>
                        </span>
                    </div>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10}}>
                        <div style={{float: "left"}}>
                            <div style={{width: "200px", display: "inline-block", marginRight: 5}}>Show Side Bar:</div>
                            <input type="checkbox" id="sideBarToggle" onChange={this.onToggleSidebar} style={{marginRight: 5}}/>
                        </div>
                    </div>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10}}>
                        <div style={{float: "left"}}>
                            <div style={{width: "200px", display: "inline-block", marginRight: 5}}>Sort By Status:</div>
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
                            rowData={this.mobxTableData}

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
                                              cellRenderer={MobaxAgentGridComponent.countryCellRenderer}
                                              filterParams={{
                                                  cellRenderer: MobaxAgentGridComponent.countryCellRenderer,
                                                  cellHeight: 20
                                              }}
                                              enableRowGroup enablePivot pinned editable/>
                                {/*
                                    <AgGridColumn field="country" width={150}
                                                cellRenderer={MobaxAgentGridComponent.countryCellRenderer}
                                                filterParams={{
                                                    cellRenderer: MobaxAgentGridComponent.countryCellRenderer,
                                                    cellHeight: 20
                                                }}
                                                enableRowGroup enablePivot pinned editable/>
                                */}
                                <AgGridColumn field="dob" width={175} headerName="DOB" filter="agDateColumnFilter"
                                              pinned columnGroupShow="open"
                                              cellRenderer={MobaxAgentGridComponent.dateCellRenderer}/>
                            </AgGridColumn>
                            <AgGridColumn headerName="Agent Status">
                                <AgGridColumn field="status" width={100}
                                              cellRenderer={MobaxAgentGridComponent.statusCellRenderer}
                                              filterParams={{
                                                  cellRenderer: MobaxAgentGridComponent.statusCellRenderer,
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

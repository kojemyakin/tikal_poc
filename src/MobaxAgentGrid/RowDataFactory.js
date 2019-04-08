import { observable, computed, action, decorate, toJS } from 'mobx';

import RefData from './RefData';

export default class RowDataFactory {

    createRowData() {
        const rowData = observable([]);

        for (let i = 0; i < 15; i++) {
            const countryData = RefData.COUNTRIES[i % RefData.COUNTRIES.length];
            const departmentData = RefData.DEPARTMENTS[i % RefData.DEPARTMENTS.length];
            rowData.push({
                id: Math.round(Math.random() * 10000),
                name: RefData.FIRST_NAMES[i % RefData.FIRST_NAMES.length] + ' ' + RefData.LAST_NAMES[i % RefData.LAST_NAMES.length],
                skills: {
                    android: Math.random() < 0.4,
                    html5: Math.random() < 0.4,
                    mac: Math.random() < 0.4,
                    windows: Math.random() < 0.4,
                    css: Math.random() < 0.4
                },
                country: countryData.country,
                continent: countryData.continent,
                language: countryData.language,
                department: departmentData.name,
                status: RefData.AGENT_STATUS_CODES[i % RefData.AGENT_STATUS_CODES.length].name,
                login: 0,
                status_idle: 0,
                status_lactive: 0,
                status_mission: 0,
                status_mactive: 0,
                status_pause: 0,
                status_fpause: 0,
                status_d_hold: 0,
                calls: Math.round(Math.random() * 100),
                incoming: Math.round(Math.random() * 100)
            });
        }

        return rowData;
    }

    createRandomPhoneNumber() {
        let result = '+';
        for (let i = 0; i < 12; i++) {
            result += Math.round(Math.random() * 10);
            if (i === 2 || i === 5 || i === 8) {
                result += ' ';
            }
        }
        return result;
    }

}
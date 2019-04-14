import React from 'react';
import * as PropTypes from 'prop-types';
import RefData from '../stores/RefData';

export default class StatusCellRenderer extends React.Component {

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
        const value = this.props.value;

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
          <div> {/* style={{ color: this.initBackgroundColorForIdleCall(currentTime) }}> */}
            {/*hours > 0 ? `${hoursStr}:${minutesStr}:${secondsStr}` : `${minutesStr}:${secondsStr}`*/}
            {`${hoursStr}:${minutesStr}:${secondsStr}`}
          </div>
        );
    }
}

// the grid will always pass in one props called 'params',
// which is the grid passing you the params for the cellRenderer.
// this piece is optional. the grid will always pass the 'params'
// props, so little need for adding this validation meta-data.
StatusCellRenderer.propTypes = {
    params: PropTypes.object
};
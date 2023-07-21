import React, { useEffect, memo } from 'react';
import { ProgressBar } from 'react-bootstrap';

const ProgressBarChart = (props) => {
    const numFormat = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2 })
    const nowFirst = numFormat.format(props.perCenFirst);
    const nowSecond = numFormat.format(props.perCenSecond);


    return (<div>
        <div></div>
        <ProgressBar>
            <ProgressBar animated striped variant="warning" now={nowFirst} key={1} />
            <ProgressBar animated striped variant="success" now={nowSecond} key={2} />
        </ProgressBar>
    </div>
    )
}

export default (ProgressBarChart);
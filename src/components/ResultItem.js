import React from 'react';

const ResultItem = ({rank, item}) => {
    return (
        <div className='result-item'>{rank +  '.) ' + item}</div>
    )
}

export default ResultItem;
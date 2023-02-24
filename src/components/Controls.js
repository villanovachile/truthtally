import React from 'react';

const Controls = () => {
    return (
        <div className='controls'>
            <form>
            <input 
                type='submit'
                value='Restart'
            />
            <input 
                type='submit'
                value='Clear'
            />
            </form>
        </div>
    )
}

export default Controls;
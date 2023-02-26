import React, {useState, useRef} from 'react';
import ItemCard from './ItemCard';

const Stage = ({gameState, items, pairs, setPairs, updateScore, setItems}) => {

// const pairs = [
//     [
//         {
//             item: 'red',
//             score: 0,
//             id: 1
//         },
//         {
//             item: 'white',
//             score: 0,
//             id: 2
//         },
//     ],
//     [
//         {
//             item: 'red',
//             score: 0,
//             id: 1
//         },
//         {
//             item: 'blue',
//             score: 0,
//             id: 3
//         },
//     ],
//     [
//         {
//             item: 'white',
//             score: 0,
//             id: 2
//         },
//         {
//             item: 'blue',
//             score: 0,
//             id: 3
//         },
//     ],

// ]
// console.log(pairs)

// const [currentIndex, setCurrentIndex] = useState(0);



// console.log(pairs[0][0].item);
// console.log(currentItemOne)

const currentIndex = useRef(0);


if (pairs.length) {

    let key = 1;


    
    
    // setCurrentItemTwo(pairs[0][1].item);
    

    function nextRound(currentSelection) {
        

        console.log(pairs.length);
        
        // e.preventDefault();
        // console.log('You selected ' + currentSelection.item)
        
        if (currentIndex.current <= pairs.length -1 ) {
            
                items.map((item, i) => {
                    if (item.id === currentSelection.id){
                        // console.log(i)
                        const newArray = items.map((item, n) => {
                            if (i === n) {
                                
                                
                            return { ...item, score: items[i].score + 1};
                            } else {
                                
                                
                            return item;
                            }
                        });
                        // console.log(newArray);
                        setItems(newArray);
                        
                        
                        
                    }
                }
            )
            if (currentIndex.current === pairs.length -1) {
                currentIndex.current = 0;
                console.log('done!!')
                setPairs([]);

            }
                currentIndex.current++
                console.log('it still ran')
            
        }
        }
    


    return (
        <>
        <div className='stage-header'>Battle {currentIndex.current + 1} of {pairs.length} </div>
        
        
        <div className='stage-container'>
        
            
            {/* {
                pairs.map(pairItems =>
                    pairItems.map(pairItem =>
                        <ItemCard key={key++} pairedItem={pairItem.item} />
                    )
                )
                } */}
                {/* <ItemCard key={key++} pairedItem={'Here comes the sun'} /> */}
                <div className='item-card' onClick={(e) => nextRound(pairs[currentIndex.current][0])}>
                    {pairs[currentIndex.current][0].item}
                </div>
                <div className='item-card-divider'>vs.</div>
                <div className='item-card' key={key++} onClick={(e) => nextRound(pairs[currentIndex.current][1])}>
                {pairs[currentIndex.current][1].item}
                </div>

                {/* <ItemCard key={key++} pairedItem={'While My Guitar Gently Weeps'} /> */}

        </div>
        </>
    )
}
}

export default Stage;
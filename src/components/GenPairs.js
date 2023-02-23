import React,{useState, useEffect} from 'react';


const GenPairs = ({items, pairs, updatePairsList}) => {

  

    const genList = (e) => {
        e.preventDefault();

        const generatePairs = (arr) => {
          //let pairCombinations = [];
        
          const result = [];
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              result.push([arr[i], arr[j]]);
            }
          }
          return result;
        }

        updatePairsList(generatePairs(items));

 
        

        

        // generatePairs(items).forEach(pair => {
        //     pair.push(pair);
            // console.log(pair[0].item + ' vs. ' + pair[1].item)
        // })
      


        
      }

      useEffect(() => {
        // console.log(pairs);

        pairs.forEach(pair => {
            // console.log(pair[0].item + ' vs. ' + pair[1].item)
            
        })
      }, [pairs]);


    return (
        <div>
        <form onSubmit = {(e) => genList(e)}> 
          <input type="submit" />
        </form>
      </div>
    );
}

export default GenPairs;
import React from 'react';

const GenList = ({items}) => {

    function generatePairs(arr) {
        let pairCombinations = [];
      
        for(let i = 0; i < arr.length - 1; i++) {
          for(let j = i + 1; j < arr.length; j++) {
            let pair = [arr[i], arr[j]];
            if (!pairCombinations.includes(pair)) {
              pairCombinations.push(pair);
            }
          }
        }
        return pairCombinations;
      }

    const genList = (e) => {
        e.preventDefault();

        generatePairs(items).forEach(pair => {
            console.log(pair[0].item + ' vs. ' + pair[1].item)
        })
      }

    return (
        <div>
        <form onSubmit = {(e) => genList(e)}> 
          <input type="submit" />
        </form>
      </div>
    );
}

export default GenList;
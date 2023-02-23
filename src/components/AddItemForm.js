import React, {useRef} from 'react';



const AddItemForm = ({addItem, items}) => {

    const itemInput = useRef();

    const handleSubmit = (e) => {

        e.preventDefault();

        let dupe = false;
        const input = itemInput.current.value.toLowerCase().replace(/\s+/g, '')
        
        items.forEach(item => {
            if (item.item === input) {
                dupe = true;
            }
        });

        if (!dupe && input) {
            addItem(itemInput.current.value);
            e.currentTarget.reset();
        }

    }


    return (
        <form onSubmit = {(e) => handleSubmit(e)}> 
        <input 
            type="text" 
            ref={itemInput}
            placeholder="Enter an item" 
        />
        <input 
            type="submit" 
            value="Add Item" 
        />
    </form>
    );
}

export default AddItemForm;
import React from 'react';

// demo mapCriteria
const mapCriteria = [
    { id: 1, name: 'Minimum 8 characters', checked: true },
    { id: 2, name: 'Special character', checked: false },
];


const InputCriteria = ({ mapCriteria }) => {

    const allSatisfied = mapCriteria.every(item => item.checked);

    if (allSatisfied) {
        return null;
    }

    return (

        mapCriteria.map((item, index) => (
            <div key={item.id || index} className="mt-1 mb-2 text-xs">
                <div className={`flex items-center ${item.checked ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{item.checked ? '✓' : '○'} {item.name}</span>
                </div>
            </div>
        ))

    );
};

export default InputCriteria;

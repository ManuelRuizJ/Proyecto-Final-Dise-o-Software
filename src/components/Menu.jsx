import React, { useEffect, useState } from 'react';
import { getMenu } from '../services/menuApi';

export const Menu = ({ onAddItem }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMenu()
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div className='bg-white shadow-xl pl-80'>
            <h1 className='text-4xl font-bold text-center mb-6 pb-5'>Platillos</h1>
            {loading ? (
                <p>Loading . . .</p>
            ) : (
                <ul className='grid grid-cols-3 gap-8'>
                    {data.map((item, index) => (
                        <li key={index} className='bg-gray-300 p-6 rounded-lg text-center'>
                            <h2 className='text-lg font-bold text-center mt-4'>{item.name}</h2>
                            <p className='text-center mt-2'>{item.description}</p>
                            <p className='text-center mt-2 font-bold'>${item.price.toFixed(2)}</p>
                            <button
                                className='bg-blue-500 font-bold py-1 px-3 rounded mt-4'
                                onClick={() => onAddItem(item)}
                            >
                                Agregar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

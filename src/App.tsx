import React, { useState, useEffect  } from 'react';
import { useStore } from './LocalStore';
import './App.css';

function MyComponent() {
    const store = useStore();

    const [localData, setLocalData] = useState<any>({ name: '', mark: '', ram: '' });
    const myData = store.myData;

    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);

    const handleAddObject = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!localData.name || !localData.mark || !localData.ram) {
            alert('Complete all fields!');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            store.addObject(localData);
            localStorage.setItem('myData', JSON.stringify(store.myData));
            setIsLoading(false);
        }, 2000);
        setLocalData({ name: '', type: '', ram: '' });
    };

    const handleDeleteObject = (index: number) => {
        store.deleteObject(index);
        setLocalData({ name: '', type: '', ram: '' });
        localStorage.setItem('myData', JSON.stringify(store.myData));
    };

    const handleUpdateObject = (index: number, newData: any) => {
        store.updateObject(index, newData);
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('myData', JSON.stringify(store.myData));
            setIsLoading(false);
        }, 2000);

        const dataToUpdate = store.myData[index];
        setLocalData({ name: dataToUpdate.name, address: dataToUpdate.address, phone: dataToUpdate.phone });
        setIsEditing(false);
        setEditingIndex(-1);
    };

    const handleEditObject = (index: number) => {
        const dataToUpdate = store.myData[index];
        setLocalData({ name: dataToUpdate.name, address: dataToUpdate.address, phone: dataToUpdate.phone });
        setIsEditing(true);
        setEditingIndex(index);
        setLocalData({ name: '', type: '', ram: '' });
    };

    const handleSaveObject = () => {
        if (editingIndex >= 0) {
            handleUpdateObject(editingIndex, localData);
            setLocalData({ name: '', type: '', ram: '' });
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('myData');
        if (data) {
            store.setMyData(JSON.parse(data));
        } else {
            localStorage.setItem('myData', JSON.stringify(store.myData));
        }
    }, [store]);

    useEffect(() => {
        if (!isLoading) {
            const data = localStorage.getItem('myData');
            if (data) {
                store.setMyData(JSON.parse(data));
            }
        }
    }, [isLoading, store]);

    function cancelEdit(){
        setIsEditing(false);
        setLocalData({ name: '', type: '', ram: '' });
    }

    return (
        <div className="container">
            <div className='start_img'>
                <div className="card_cont">
                    {myData.map((data: any, index: number) => (
                        <div key={index} className="card">              
                            <div className='card_ins'>
                                <span className='names'>Name: </span><span className='second'>{data.name}</span>
                            </div>                          
                            <div className='card_ins'>
                                <span className='names'>Mark: </span><span className='second'>{data.mark}</span>
                            </div>
                            <div className='card_ins'>
                                <span className='names'>RAM: </span><span className='second'>{data.ram}</span>
                            </div>
                            <button className="button2" onClick={() => handleEditObject(index)}>Edit</button>
                            <button className="button2" onClick={() => handleDeleteObject(index)}>Delete</button>
                        </div>
                    ))}
                </div>
                <form className="form" onSubmit={handleAddObject}>
                    <span className='title'>Mobile</span>
                    <div className='inp_cont'>
                        <span className='inp_txt'>Mobile Name </span>
                        <input className="input" type="text" value={localData.name} onChange={e => setLocalData({ ...localData, name: e.target.value })} />
                    </div>
                    <div className='inp_cont'>
                        <span className='inp_txt'>Mark </span>             
                        <input className="input" type="text" value={localData.mark} onChange={e => setLocalData({ ...localData, mark: e.target.value })} />
                    </div>
                    <div className='inp_cont'>
                        <span className='inp_txt'>RAM </span>
                        <input className="input" type="number" value={localData.ram} onChange={e => setLocalData({ ...localData, ram: e.target.value })} />
                    </div>
                    <button className="button" type="submit">{isLoading ? 'Loading...' : 'Insert'}</button>
                </form>
            </div> 
            {isEditing && (
                <div className="edit_cont">
                    <div className="edit_main">
                        <span className='title'>Edit</span>
                        <form className="edit_form" onSubmit={handleSaveObject}>
                            <div className='inp_cont_edit'>
                                <span className='inp_txt'>Name edit  </span>  
                                <input
                                    className="input"
                                    type="text"
                                    value={localData.name}
                                    onChange={(e) => setLocalData({ ...localData, name: e.target.value })}
                                />
                            </div>
                            <div className='inp_cont_edit'>
                                <span className='inp_txt'>Mark edit  </span>
                                <input
                                    className="input"
                                    type="text"
                                    value={localData.mark}
                                    onChange={(e) => setLocalData({ ...localData, mark: e.target.value })}
                                />
                            </div>
                            <div className='inp_cont_edit'>
                                <span className='inp_txt'>RAM edit  </span>
                                <input
                                    className="input"
                                    type="text"
                                    value={localData.ram}
                                    onChange={(e) => setLocalData({ ...localData, ram: e.target.value })}
                                />
                            </div>
                            <div className="edit_cont_buttons">
                                <button className="button" type="submit">Save</button>
                                <button className="button" onClick={cancelEdit}>Cancel</button>
                            </div>
                        </form>   
                    </div>
                </div>
            )}    
        </div>
    );
}

export default MyComponent;

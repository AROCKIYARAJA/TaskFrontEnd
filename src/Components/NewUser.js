import React, { useEffect, useState } from 'react'
import { FileInput, Label } from "flowbite-react";
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/UserStore';

function NewUser({ newUserForm, setNewUserForm }) {

    const dispatch = useDispatch();

    const [user, setUser] = useState({
        Name: "",
        Email: "",
        Password: "",
        Image: ""
    })

    function handleChange(e) {
        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    async function CreateUser() {
        const request = await fetch(`http://localhost:5000/User/CreateUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        const response = await request.json()
        console.log(response);
        dispatch(addUser(user))
        setNewUserForm(false)
    }
    return (
        <div className='w-[100%] h-screen fixed z-20 top-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center'>
            <form action="" className='bg-white w-[350px] p-5 rounded-lg flex flex-col items-center gap-4 border'>
                <div className=" w-full flex items-center justify-between px-3">
                    <span className='text-left font-[700]  text-[1.5rem]'>New User</span>
                    <button onClick={() => setNewUserForm(false)} type='button' className='px-3 py-[2px] rounded-md bg-red-600 text-white'>Close</button>
                </div>
                <div className="w-full">
                    <input type="text" className='w-full rounded-md' name='Name' value={user.Name} onChange={(e) => handleChange(e)} placeholder='Profile Name' />
                </div>
                <div className="w-full">
                    <input type="email" className='w-full rounded-md' name='Email' value={user.Email} onChange={(e) => handleChange(e)} placeholder='Email' />
                </div>
                <div className="w-full">
                    <input type="password" className='w-full rounded-md' name='Password' value={user.Password} onChange={(e) => handleChange(e)} placeholder='Password' />
                </div>
                <button type='button' onClick={() => CreateUser()} className='w-full bg-emerald-600 text-white py-1 rounded-md'>Create User</button>
            </form>
        </div>
    )
}

export default NewUser
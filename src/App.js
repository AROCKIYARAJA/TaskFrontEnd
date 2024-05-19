import React, { useEffect, useState } from 'react';
import Loading from './Components/loading';
import NewUser from './Components/NewUser';
import { useDispatch, useSelector } from "react-redux";
import { UpdateusersRedux, UserAPI, deleteUserredux, targetUser } from './redux/UserStore';
import { UserAPITWO, deletetheuser, findUser } from './redux/UsertwoStore';

function App() {
  const dispatch = useDispatch();
  const userRedux = useSelector(state => state.User.User);
  const Usertwo = useSelector(state => state.UserTwo.UserTwo);

  const [updatedValue, setUpdatedValue] = useState({
    ID: "", Name: "", Email: "", Password: ""
  });
  const [users, setUsers] = useState([]);
  const [newUserForm, setNewUserForm] = useState(false);
  const [showUpdateform, setShowUpdateform] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    dispatch(UserAPI());
  }, [dispatch]);

  useEffect(() => {
    dispatch(UserAPITWO());
  }, [dispatch]);

  async function deleteUser(ID) {
    try {
      dispatch(deleteUserredux(ID));
      const request = await fetch(`http://localhost:5000/User/DeleteUser/${ID}`, { method: "DELETE" });
      const response = await request.json();
      console.log(response);
      dispatch(UserAPI());
    } catch (error) {
      console.log(error.message);
    }
  }

  async function updateuser(ID) {
    const request = await fetch(`http://localhost:5000/User/GetSingleUser/${ID}`, { method: "GET" });
    const response = await request.json();
    setShowUpdateform(true);
    console.log(response.FinalOut);
    setUpdatedValue({
      ID: response.FinalOut._id,
      Name: response.FinalOut.Name,
      Email: response.FinalOut.Email,
      Password: response.FinalOut.Password,
    });
  }

  function handleUpdate(e) {
    const { name, value } = e.target;
    setUpdatedValue((prev) => ({ ...prev, [name]: value }));
  }

  async function triggerUpdateEvent(ID) {
    console.log(ID);
    dispatch(UpdateusersRedux(updatedValue));
    const request = await fetch(`http://localhost:5000/User/UpdateUser/${ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedValue)
    });
    const response = await request.json();
    alert(response.message);
    setShowUpdateform(false);
  }

  function handleDragStart(index) {
    setActiveCard(index);
  }

  function handleDragEnd() {
    setActiveCard(null);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  async function handleDrop(event) {
    event.preventDefault();
    if (activeCard !== null) {
      const draggedUser = userRedux[activeCard];
      console.log(draggedUser._id);

      dispatch(findUser(draggedUser));

      const request = await fetch(`http://localhost:5000/Usertwo/addsomenew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draggedUser)
      })
      const response = await request.json();
      console.log(response);
    }
  }

  async function deleteUsertwo(ID) {
    try {
      const draggedUser = Usertwo[ID];
      console.log(draggedUser._id);

      dispatch(deletetheuser(draggedUser));
      const request = await fetch(`http://localhost:5000/Usertwo/removeone/${draggedUser._id}`, { method: "DELETE" });
      const response = await request.json();
      console.log(response);
      dispatch(UserAPITWO());
    } catch (error) {
      console.log("frontend err->>  ", error.message);
    }
  }

  return (
    <div>
      {newUserForm ? <NewUser newUserForm={newUserForm} setNewUserForm={setNewUserForm} /> : ""}
      <div className="">
        <form action="" className={`w-[300px] duration-300 transition-all mx-auto flex-col flex gap-3 z-30 bg-white p-3 border border-gray-400 rounded-md shadow-xl absolute ${showUpdateform ? " top-10" : "top-[-500px]"}  left-2/4 -translate-x-2/4`}>
          <div className="flex w-full items-center justify-between"><span className=' font-[600] text-[1.3rem] '>Update Form</span><button type='button' onClick={() => setShowUpdateform(false)} className='px-2 py-1 rounded-md text-[13px] bg-red-600 text-white'>close</button></div>
          <input type="text" placeholder='Name' name='Name' value={updatedValue.Name} onChange={(e) => handleUpdate(e)} className='w-full border rounded-md' />
          <input type="text" placeholder='Email' name='Email' value={updatedValue.Email} onChange={(e) => handleUpdate(e)} className='w-full border rounded-md' />
          <input type="text" placeholder='Password' name='Password' value={updatedValue.Password} onChange={(e) => handleUpdate(e)} className='w-full border rounded-md' />
          <input type="button" value={"Update"} onClick={() => triggerUpdateEvent(updatedValue.ID)} className='w-full border rounded-md bg-gray-500 text-white py-2 hover:cursor-pointer' />
        </form>
      </div>
      <div className="grid grid-cols-2 w-[900px] mx-auto max-w-full mt-20 gap-5">
        <div className="flex flex-col w-full h-[550px] gap-5 items-center px-3 pb-5 border border-gray-300 rounded-xl overflow-y-scroll">
          <div className="flex items-center justify-between bg-white sticky top-0 z-10 w-full px-3 border-b border-gray-400 py-2">
            <span className='font-[700] text-[1.5rem] '>Waiting List ({userRedux.length})</span>
            <button onClick={() => setNewUserForm(true)} type='button' className='px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white '>Add User</button>
          </div>
          {userRedux && userRedux.length === 0 ? <><Loading /></> : userRedux.map((target, index) =>
            <div key={target?._id || index} draggable onDragStart={() => handleDragStart(index)} onDragEnd={handleDragEnd} className='flex relative cursor-pointer items-center duration-300 hover:shadow-2xl rounded-md gap-3 p-3 shadow-lg border w-full active:bg-gray-300 '>
              <div className="w-[50px] h-[50px] rounded-full border border-orange-300" style={{ backgroundImage: `url(https://pics.craiyon.com/2023-12-04/RkicXp6zSCCjyyXKyqg7Uw.webp)`, backgroundPosition: "center", backgroundSize: "cover" }}></div>
              <div className="">
                <div className="font-[600] text-[1.1rem]">{target?.Name}</div>
                <div className="text-[14px] text-gray-500">{target?.Email}</div>
              </div>
              <button onClick={() => deleteUser(target._id)} className='px-2 py-[2px] absolute top-2 right-5 z-10 rounded-md text-[13px] bg-red-600 text-white cursor-pointer'>Delete</button>
              <button onClick={() => updateuser(target._id)} className='px-2 py-[2px] absolute bottom-2 right-5 z-10 rounded-md text-[12px] bg-gray-600 text-white cursor-pointer'>Update</button>
            </div>)}
        </div>
        <div className="flex flex-col gap-5 items-center px-3 py-5 border border-gray-300 rounded-xl" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div className="font-[700] text-[1.5rem]">Finalist (0)</div>
          {Usertwo && Usertwo.map((target, index) => <div key={target._id || 'usertwo' + index} className='flex relative cursor-pointer items-center duration-300 hover:shadow-2xl rounded-md gap-3 p-3 shadow-lg border w-full active:bg-gray-300 '>
            <div className="w-[50px] h-[50px] rounded-full border border-orange-300" style={{ backgroundImage: `url(https://pics.craiyon.com/2023-12-04/RkicXp6zSCCjyyXKyqg7Uw.webp)`, backgroundPosition: "center", backgroundSize: "cover" }}></div>
            <div className="">
              <div className="font-[600] text-[1.1rem]">{target?.Name}</div>
              <div className="text-[14px] text-gray-500">{target?.Email}</div>
              <button onClick={() => deleteUsertwo(index)} className='px-2 py-[2px] absolute top-2 right-5 z-10 rounded-md text-[13px] bg-red-600 text-white cursor-pointer'>Delete</button>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

export default App;

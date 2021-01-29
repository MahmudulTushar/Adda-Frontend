import React, {useState, useEffect} from 'react'
import "./SidebarChat.css"
import { Avatar } from '@material-ui/core';
import axios from './axios.js'
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import CustomDialog from './CustomDialog';
import Pusher from './Pusher'

function SidebarChat({id, name, addNewChat}) {
  const [{user}, dispatch] = useStateValue();
  const [openDialogForAddNewRoom, setOpenialogForAddNewRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [seed, setSeed] = useState("");
  const MAX_LENGTH = 20;

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));        
  }, []);

  const handleClickOpenDialogForAddNewRoom = () => {
    setOpenialogForAddNewRoom(true);
  };

  const handleCloseOpenDialogForAddNewRoom = () => {
    setOpenialogForAddNewRoom(false);
    //setRoomName("");
  };

  const handleAddNewRoom = () =>{
    if (roomName)
    {
      let data = {
        name: roomName,
        roomOwner: user.email,
        roomOwnerDisplayName: user.displayName,
        friends:[]
      }
      axios.post('/rooms/new', data)
      .then(response => {
      })
      .catch(err =>{
      })
    }
    setOpenialogForAddNewRoom(false);
    setRoomName("");
  }
  return addNewChat?
  (
     <div>
      <div onClick = {handleClickOpenDialogForAddNewRoom} className = "sidebarChat"> 
        <h3>Add New Chat</h3>
      </div>
      <CustomDialog openDialog ={openDialogForAddNewRoom}
                        handleCloseOpenDialog = {handleCloseOpenDialogForAddNewRoom}
                        dialogTitle = {`Add New Room`}
                        dialogContentText = {''}
                        textFieldLabel = {'Room Name'}
                        textFieldType = {'text'}
                        setData = {setRoomName}
                        handleSubmitButton = {handleAddNewRoom}
                        cancelButtonText = {'Cancel'}
                        submitButtonText = {'Add'}/> 
     </div>  
  )
   : 
  (
    <Link to ={`/rooms/${id}`}>
      <div className = "sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          {/* {sideBarmessage.length > 0 && (
          <p>
              {sideBarmessage[sideBarmessage.length - 1]?.message?.substring(0, MAX_LENGTH)} {sideBarmessage[sideBarmessage.length - 1]?.message?.length > MAX_LENGTH && '.....'} 
          </p>)
          } */}
        </div>
    </div>
    </Link>  
  )
}

export default SidebarChat

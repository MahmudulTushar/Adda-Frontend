import {React, useState, useEffect, useRef} from 'react'
import "./Chat.css"
import { IconButton, Avatar } from '@material-ui/core';
import {MoreVert,SearchOutlined, AttachFile, InsertEmoticon} from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios.js'
import {useParams} from "react-router-dom";
import Pusher from './Pusher'
import { useStateValue } from './StateProvider';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CustomDialog from './CustomDialog';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socketIo = require('socket.io-client')(process.env.REACT_APP_SOCKET_SERVER_URL);
toast.configure();

function Chat() {
  const chatBody = useRef(null);
  const [input, setInput] = useState("");
  const {roomId} = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{user}, dispatch] = useStateValue();
  const [openDialogForSendJoinReq, setOpenialogForSendJoinReq] = useState(false);
  const [email, setEmail] = useState("");
  const [isConnectedToTheServer, setConnection] = useState(false);
  const [placeHolder, setPlaceHolder] = useState("false");
  const [seed, setSeed] = useState("");
  const [isValidChatRoom, setValidChatRoom] = useState(false);
  const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  let emailIsValid = true;
  const joinRoomEvent = 'joinRoom'
  const leaveRoomEvent = "leaveRoom"
  const sendMessageToRoomEvent = 'sendMessageToRoom'
  const receivedMessageEvent = 'receivedMsg'
  console.log(process.env.REACT_APP_SOCKET_SERVER_URL)
  
  socketIo.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
    setConnection(false)
    setPlaceHolder("Connecting to server...")
  },[isConnectedToTheServer]);

  socketIo.on("connect", () => {
    GetMessagesByRoomId();
    setConnection(true)
    setPlaceHolder("Type a message")
  },[isConnectedToTheServer]);

  useEffect(() => {
    socketIo.emit(joinRoomEvent , roomId)
    GetMessagesByRoomId();
    return () => {
      socketIo.emit(leaveRoomEvent , roomId)
    }
  }, [roomId]);

  const GetMessagesByRoomId = () => {
     if(roomId){
         axios.get(`/messages/${roomId}`)
        .then(response => {
          if (messages != response.data){
            setMessages(response.data);
          }
        })
        .catch(err =>{
        })
        return () =>{
        }
     } 
  }

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));        
  }, [roomId]);

  const handleClickOpenDialogForSendJoinReq = () => {
    setOpenialogForSendJoinReq(true);
  };

  const handleCloseOpenDialogForSendJoinReq = () => {
    setOpenialogForSendJoinReq(false);
  };

  const handleSendJoinReq = () => {
    emailIsValid = true;

    if (!pattern.test(email)) {
      emailIsValid = false;
    }

    if (emailIsValid === false)
    {
      toast.error('Invalid email expression',{position: toast.POSITION.TOP_CENTER});
    }
    else if (user.email === email){
      // show message that you can not send join request to yourself
      toast.info('You can not send join request to yourself!',{position: toast.POSITION.TOP_CENTER})
    }
    else 
    {
      let dataForJoinReq = {
        roomId: roomId,
        receiverEmail: email,
        received : false,
        timeStamp: new Date().toUTCString(),
      }
      axios.post('/rooms/request', dataForJoinReq)
      .then(response => {
        if (response.status === 201)
        {
          // show message that the user is already a member of this room
          toast.success(`Join request has been sent to the user `,{position: toast.POSITION.TOP_CENTER})
        }
      })
      .catch(err =>{

        if (err.response.status === 409)
        {
          // show message that the user is already a member of this room
          toast.error('This user already a member of this room',{position: toast.POSITION.TOP_CENTER})
        }
        else
        {
          // show message that the user is already a member of this room
          toast.error('An error occurred while sending the request',{position: toast.POSITION.TOP_CENTER})
        }
      });
    }
    setOpenialogForSendJoinReq(false);
    setEmail("");
  };

  useEffect(()=>{
    // To set the Chat body at the current bottom
    if (isValidChatRoom)
      chatBody.current.scrollTop = chatBody.current.scrollHeight;
  
    socketIo.on(receivedMessageEvent, (newMessage) => {
      console.log("New message:" + newMessage)
      if (newMessage.senderEmail != user.email){
        setMessages([...messages, newMessage]);
      }
    });
    
    return () =>{
    }
  },[messages, roomId, isValidChatRoom, user.email])

  const sendMessage =  (e) =>{
    e.preventDefault();
    let data = {
      message: input,
      name: user.displayName,
      timeStamp: new Date().toUTCString(),
      roomId : roomId,
      senderEmail: user.email 
    }
    setMessages([...messages, data]);
    socketIo.emit(sendMessageToRoomEvent, data)
    setInput('');
  }
  useEffect(() => {
    if (roomId)
    {

      let userArray = [];
      axios.get(`/rooms/${roomId}`)
      .then(response => {
        
        setRoomName(response.data.name);
        
        if (response.data)
        {
           if (response.data.roomOwner)
           {
             userArray.push(response.data.roomOwner);
           }
           if (response.data.friends)
           {
             userArray.push(...response.data.friends);
           }
        }

        if (userArray.indexOf(user.email) > -1)
          setValidChatRoom(true);
        else
          setValidChatRoom(false);
        
      })
      .catch(err =>{
        setValidChatRoom(false);
      })
    }  
  }, [roomId, user.email])
  
  if (isValidChatRoom)
  {
    return (
      <div className = 'chat'>
        <div className="chat__header">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
          <div className="chat__headerInfo"> 
            <h3>{roomName}</h3>
            {messages.length > 0 && (<p>Last seen at ...
              {new Date(messages[messages.length - 1]?.timeStamp)?.toLocaleString()}
            </p>)
            }
            {isConnectedToTheServer == false && (<p>Connecting to the server...</p>)}
          </div>
          <div className="chat__headerRight">
            <Tooltip title={<h2>Send join request</h2>}> 
              <IconButton disabled = {roomId === undefined}>
                <AddIcon  onClick={handleClickOpenDialogForSendJoinReq}/>  
              </IconButton> 
            </Tooltip> 
            <CustomDialog openDialog ={openDialogForSendJoinReq}
                          handleCloseOpenDialog = {handleCloseOpenDialogForSendJoinReq}
                          dialogTitle = {`Join Request In '${roomName}'`}
                          dialogContentText = {'To send join request to other, please enter email address(Gmail) here'}
                          textFieldLabel = {'Email Address'}
                          textFieldType = {'email'}
                          setData = {setEmail}
                          handleSubmitButton = {handleSendJoinReq}
                          cancelButtonText = {'Cancel'}
                          submitButtonText = {'Send'}/> 
            <IconButton>
              <SearchOutlined/>  
            </IconButton>
            <IconButton>
              <AttachFile/>
            </IconButton>
            <IconButton>
              <MoreVert/>  
            </IconButton>
          </div>
        </div>
        <div className="chat__body" ref = {chatBody}>
          {messages.map(message => (
            <p className = {`chat__message ${message.senderEmail===user.email && "chat__receiver"}`}>
            {message.senderEmail !== user.email && ( <span className = "chat__name"> {message.name}</span>)}
                {message.message} 
              <span className = "chat__timestamp">{new Date(message.timeStamp).toLocaleString()}</span>
            </p>
          ))}
        </div>
        <div className="chat__footer">
          <InsertEmoticon/>
          <form>
            <input value = {input} onChange = {e => setInput(e.target.value)} placeholder = {placeHolder} type = "text" disabled={!isConnectedToTheServer}/>
            <button onClick = {sendMessage} type = "submit">
              Send a message
            </button>  
          </form>  
          <MicIcon/>
        </div>
      </div>
    )
  }
  else
    return (null);
}

export default Chat

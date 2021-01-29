import React from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import "./Notification.css"
import { useStateValue } from './StateProvider';
import axios from './axios.js'
function Notification({setNotificationAnchorEl,requestId, roomInformation, removeNotification, addNewRoom}) {
  const [{user}, dispatch] = useStateValue(); 
  function handleNotificationsClose(requstAceepted){
    setNotificationAnchorEl(null);
    let payLoad = {};
    payLoad.roomId = roomInformation._id;
    payLoad.requestAccepted = requstAceepted;
    payLoad.receiverEmail = user.email;
    axios.delete(`rooms/request/${requestId}`, { data : payLoad})
    .then(response => {
      removeNotification(requestId);
      if (requstAceepted)
        addNewRoom(roomInformation);
    })
    .catch(err =>{
    })
  };
  return (
    <Card className = "notification">
      <CardContent className = "notification__Body">
        You have a chat request for '{roomInformation.name}' - Send by  {roomInformation.roomOwnerDisplayName}
      </CardContent>
      <CardActions className = "notification__Action">
        <Tooltip title={<h3>Accept request</h3>}> 
          <IconButton onClick={()=>handleNotificationsClose(true)}>
              <DoneIcon/>  
          </IconButton>
        </Tooltip>  
        <Tooltip title={<h3>Decline request</h3>}> 
          <IconButton onClick={()=>handleNotificationsClose(false)} >
              <CloseIcon/>  
          </IconButton> 
        </Tooltip>  
      </CardActions>
    </Card>
  )
}

export default Notification

import React, { useState, useEffect } from 'react';
import "./Sidebar.css";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { IconButton, Avatar } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import axios from './axios.js'
import Pusher from './Pusher'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
//... Custom Components....//
import SidebarChat from './SidebarChat'
import Notification from './Notification'
import { useStateValue } from './StateProvider';
function SideBar() {
  const [{user}, dispatch] = useStateValue(); 
  const [rooms, SetRooms] = useState([]);
  const [notifications, SetNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] =useState(null);
  const [numberOfNotification, SetNumberOfNotification] = useState(0);
  useEffect(() => {
    axios.get(`/rooms/sync/${user.email}`)
    .then(response => {
      SetRooms(response.data);
    })
    .catch(err =>{
    })
  }, [])

  useEffect(() => {
    axios.get(`/rooms/request/${user.email}`)
    .then(response => {
      SetNotifications(response.data);
      SetNumberOfNotification(response.data.length)
    })
    .catch(err =>{
    })
  }, [])

  useEffect(()=>{ 
    const channelRooms = Pusher.subscribe('rooms');
    channelRooms.bind('insert', function(newRoom) {
      if ((newRoom.friends.indexOf(user.email) > -1) || (newRoom.roomOwner === user.email))
        SetRooms([...rooms, newRoom])
    });
    return () =>{
      channelRooms.unbind_all();
      channelRooms.unsubscribe();
    }
  },[rooms])

  useEffect(()=>{
    const channelRoomRequest = Pusher.subscribe('roomRequest'); 
    channelRoomRequest.bind('insert', function(newNotification) {
      if (newNotification.receiverEmail === user.email)
      {
        axios.get(`/rooms/${newNotification.roomId}`)
        .then(response => {
          newNotification.roomInformation = [response.data];
          SetNotifications([...notifications, newNotification]);
          SetNumberOfNotification(notifications.length + 1);
        })
        .catch(err =>{
        })
      }
    });
    
    return () =>{
      channelRoomRequest.unbind_all();
      channelRoomRequest.unsubscribe();
    }
  },[notifications])

  const removeNotification = (notificationId) =>{
    const newNotificationList = notifications.filter((item) => item._id !== notificationId);
    SetNotifications(newNotificationList);
    SetNumberOfNotification(notifications.length - 1);
  }

  const addNewRoom = (roomInfo) =>{
    SetRooms([...rooms, roomInfo]);
  }

  const handleNotificationsClick = (e) => {
    setNotificationAnchorEl(e.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };
  return (
    <div className = 'sidebar'>
      <div className="sidebar__header">
        <Avatar src ={user?.photoURL}/>
        <div className="sidebar__headerRight">
          <IconButton>
            <NotificationsIcon onClick={handleNotificationsClick} className="sidebar__NotificationButton"/> 
              <span className="sidebar__NotificationBadge" style={{ display: numberOfNotification ?  "block" : "none" }}>{numberOfNotification}</span>
              <Menu className ="sidebar__NotificationMenu"
                anchorEl={notificationAnchorEl}
                keepMounted
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationsClose}
                style={{ display: numberOfNotification ?  "block" : "none" }}
              >
                {
                  notifications.map( notification => (
                    <Notification key = {notification._id} requestId = {notification._id} roomInformation = {notification.roomInformation[0]} 
                    setNotificationAnchorEl ={setNotificationAnchorEl}
                    removeNotification = {removeNotification}
                    addNewRoom = {addNewRoom}

                    /> 
                  ))
                }
              </Menu> 
          </IconButton>
          <IconButton>
            <DonutLargeIcon/>  
          </IconButton>
          <IconButton>
            <ChatIcon/>
          </IconButton>
          <IconButton>
            <MoreVertIcon/>  
          </IconButton>
        </div>   
      </div>
      <div className = "sidebar__search">
          <div className="sidebar__searchContainer">
            <SearchIcon/>
            <input placeholder = "Search or start new chat" type = "text"/>
          </div>
      </div> 
      <div className="sidebar__chats">
        <SidebarChat addNewChat/> 
        {
          rooms.map( room => (
            <SidebarChat key = {room._id} id = {room._id} name = {room.name}/> 
          ))
        }
      </div>      
    </div>
  )
}
 

export default SideBar

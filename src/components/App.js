import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import './App.css';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({currentUser, currentChannel, isPrivateChannel, userPosts, primaryColour, secondaryColour}) => {
  
    return (
      <Grid columns="equal" className="app" style={{background: secondaryColour}}>
        <ColorPanel key={currentUser && currentUser.name} currentUser={currentUser} />
        <SidePanel 
          key={currentUser && currentUser.uid} 
          currentUser={currentUser}
          primaryColour={ primaryColour }
        />

        <Grid.Column style={{ marginLeft:320 }}>
          <Messages 
            key={currentChannel && currentChannel.id} 
            currentChannel={currentChannel}
            currentUser={currentUser}
            isPrivateChannel = {isPrivateChannel}
          />
        </Grid.Column>

        <Grid.Column style={{width:4}}>
          <MetaPanel 
            key={currentChannel && currentChannel.name}
            currentChannel = {currentChannel}
            isPrivateChannel={isPrivateChannel}
            userPosts= {userPosts}
          />
        </Grid.Column>
          
      </Grid>
    );
  }

  const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    userPosts: state.channel.userPosts,
    primaryColour: state.colours.primaryColour,
    secondaryColour: state.colours.secondaryColour
  });

export default connect(mapStateToProps)(App);

import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../../actions';
import firebase from '../../../firebase';

class DirectMessages extends React.Component{
    state = {
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence'),
        activeChannel: ''
    }

    componentDidMount(){
        if(this.state.user){
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = currentUserUId => {
        let loadedUsers  = [];

        this.state.usersRef.on('child_added', snap => {
            if(currentUserUId !== snap.key){
                let userSnapVal = snap.val();
                userSnapVal['uid'] = snap.key;
                userSnapVal['status'] = 'offline';
                loadedUsers.push(userSnapVal);
                this.setState({ users:loadedUsers });
            }
        });

        this.state.connectedRef.on('value', snap => {
            if(snap.val() === true){
                const ref = this.state.presenceRef.child(currentUserUId);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if(err !== null){
                        console.error(err);
                    }
                })
            }
        });

        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUId !== snap.key){
                this.addStatusToUser(snap.key);
            }
        });

        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUId !== snap.key){
                this.addStatusToUser(snap.key, false);
            }
        });
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.usersRef.off();
        this.state.presenceRef.off();
        this.state.connectedRef.off();
    }

    addStatusToUser = ( userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if(user.uid === userId){
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);
        }, []);
        this.setState({ users:updatedUsers });
    }

    isUserOnline = user => user.status === 'online';

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name,
        };

        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
        this.setActiveChannel(user.uid);
    }

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;
        return userId < currentUserId ? `${userId}/${currentUserId}`: `${currentUserId}/${userId}`
    }

    setActiveChannel = userUId => {
        this.setState({ activeChannel: userUId });
    }

    render(){
        const { users, activeChannel } = this.state;

        return(
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="mail"/> DIRECT MESSAGES
                    </span> {' '}
                    ({ users.length })
                </Menu.Item>
                {users.map(user => (
                    <Menu.Item
                        key={user.uid}
                        active={user.uid === activeChannel}
                        onClick={() => this.changeChannel(user)}
                        style={{ opacity: 0.7, fontStyle: 'italic' }}
                    >
                        <Icon 
                            name='circle'
                            color={this.isUserOnline(user) ? 'green': 'red'}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>   
        )
    }
}


export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);
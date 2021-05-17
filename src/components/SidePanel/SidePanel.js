import React from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel/UserPanel';
import Channels from './Channels/Channels';
import DirectMessages from './DirectMessages/DirectMessages';
import Starred from './Starred/Starred';

class SidePanel extends React.Component {
    render() {
        const { currentUser, primaryColour} = this.props
        return(
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{background: primaryColour, fontSize: '1.2rem'}}
            >
                <UserPanel primaryColour={primaryColour} currentUser={currentUser}/>
                <Starred currentUser={currentUser}/>
                <Channels currentUser={currentUser}/>
                <DirectMessages currentUser={currentUser}/>
            </Menu>
        );
    }
}

export default SidePanel;
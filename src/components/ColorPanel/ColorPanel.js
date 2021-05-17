import React from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { Button, Divider, Icon, Label, Menu, Modal, Segment, Sidebar } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

import { setColours } from '../../actions';

class ColorPanel extends React.Component {
    state ={
        modal: false,
        primary: '',
        secondary: '',
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        userColours: []
    };

    componentDidMount(){
        if(this.state.user){
            this.addListener(this.state.user.uid);
        }
    }

    addListener = userUId => {
        let userColours = [];

        this.state.usersRef
        .child(`${userUId}/colours`)
        .on('child_added', snap => {
            userColours.unshift(snap.val());
            this.setState({ userColours })
        })
    }


    componentWillUnmount() {
        this.removeListener();
    }

    removeListener = () => {
        this.state.usersRef.child(`${this.state.uid}/colours`).off();
    } 

    openModal = () => this.setState({
        modal: true
    });

    closeModal = () => this.setState({
        modal: false
    });

    handleChangePrimary = colour => this.setState({ primary: colour.hex});

    handleChangeSecondary = colour => this.setState({ secondary: colour.hex});

    handleSaveColours = () => {
        if(this.state.primary && this.state.secondary){
            this.saveColours(this.state.primary, this.state.secondary);
        }
    }

    saveColours = (primary, secondary) => {
        this.state.usersRef
            .child(`${this.state.user.uid}/colours`)
            .push()
            .update({
                primary,
                secondary
            })
            .then(() => {
                console.log('Colours Added');
                this.closeModal()
            })
            .catch(err => console.error(err));
    }

    displayUserColours = userColours => (
        userColours.length > 0 && userColours.map( (colour, i) => (
            <React.Fragment key={i}>
                <Divider />
                <div 
                    className="colour__container" 
                    onClick={() => this.props.setColours(colour.primary, colour.secondary)}
                >
                    <div className="colour__square" style={{background: colour.primary}}>
                        <div className="colour__overlay" style={{background: colour.secondary}}>

                        </div>
                    </div>
                </div>

            </React.Fragment>
        ))
    );

    render() {
        const { modal, primary, secondary, userColours } = this.state;

        return(
            <Sidebar
                as={Menu}
                lnverted
                vertical
                icon="labeled"
                visible
                width="very thin"
            >
                <Divider />
                <Button icon="add" size="small" color="blue" onClick={this.openModal}/>
                {this.displayUserColours(userColours)}

                { /* Colour Picker Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Colours</Modal.Header>
                    <Modal.Content>

                        <Segment inverted>
                            <Label content="Primary Colour" />
                            <SliderPicker color={primary} onChange={this.handleChangePrimary}/>
                        </Segment>

                        <Segment inverted>
                            <Label content="Secondary Colour" />
                            <SliderPicker color={secondary} onChange={this.handleChangeSecondary}/>
                        </Segment>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSaveColours}>
                            <Icon name="checkmark" /> Save Colours
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

export default connect(
    null,
    { setColours }
)(ColorPanel);
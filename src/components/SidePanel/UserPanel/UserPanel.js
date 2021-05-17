import React from 'react';
import firebase from '../../../firebase';
import AvatarEditor from 'react-avatar-editor';
import { Button, Dropdown, Grid, Header, Icon, Image, Input, Modal } from 'semantic-ui-react';

class UserPanel extends React.Component{
    state={
        user: this.props.currentUser,
        modal: false,
        previewImage:'',
        blob: '',
        croppedImage: '',
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        updloadCroppedImage: '',
        metadata: {
            contentType: 'image/jpeg'
        }
    };

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    
    dropdownOptions=()=> [
        {
            key:'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span onClick={this.openModal}>Change Avatar</span>,
        },
        {
            key:'signout',
            text: <span onClick={this.handleSignOut}>Sign Out</span>
        }
    ];

    handleSignOut=()=>{
        firebase
        .auth()
        .signOut()
        .then(()=>console.log('Signed Out'))
    };

    handleChangeAvatar = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if(file){
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result });
            });
        }

    }

    handleCroppedImage = () => {
        if(this.avatarEditor){
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageURL = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageURL,
                    blob
                });
            })
        }
    }

    updloadCroppedImage = () => {
        const { storageRef, userRef, blob, metadata } = this.state
        
        storageRef
        .child(`avatars/users/${userRef.uid}`)
        .put(blob, metadata)
        .then( snap => {
            snap.ref.getDownloadURL().then(downloadURL => {
                this.setState({ updloadCroppedImage: downloadURL}, () => this.changeAvatar());
            })
        })
    }

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL: this.state.updloadCroppedImage
            })
            .then(() => {
                console.log('PHOTO Updated!');
                this.closeModal()
            })
            .catch(err => {
                console.error(err);
            });
        
        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.updloadCroppedImage})
            .then(() => {
                console.log('User avatar changed');
            })
            .catch(err => {
                console.error(err);
            });
    }

    render(){
        const { user, modal, previewImage, croppedImage } = this.state;
        const { primaryColour } = this.props

        return(
            <Grid style={{background: primaryColour}}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code"/>
                            <Header.Content>Chat Cat</Header.Content>
                        </Header>
                    
                        <Header style={{ padding: '0.25em' }} as='h4' inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar/>
                                    {user.displayName}
                                </span>
                            } options={this.dropdownOptions()}/>
                        </Header>
                    </Grid.Row>
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input 
                                onChange={this.handleChangeAvatar}
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {croppedImage && (
                                            <Image 
                                                style={{ margin: '3.5em auto'}}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && <Button color="green" inverted onClick={this.updloadCroppedImage}>
                                <Icon 
                                    name="save"
                                />
                                Change Avatar
                            </Button>}
                            <Button color="green" inverted onClick={this.handleCroppedImage}>
                                <Icon 
                                    name="image"
                                />
                                Preview
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon 
                                    name="remove"
                                />
                                Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;
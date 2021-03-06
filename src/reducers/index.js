import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialUserState = {
    currentUser: null,
    isLoading: true
};

const initialChannelState= {
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null
};

const initalColoursState = {
    primaryColour: '#4c3c4c',
    secondaryColour: '#eee'
}

const user_reducer = (state = initialUserState, action) => {
    switch(action.type) {
        case actionTypes.SET_USER: 
            return{
                currentUser: action.payload.currentUser, 
                isLoading: false
            }
        case actionTypes.CLEAR_USER:
            return{
                ...state,
                isLoading: false
            }  
        default: 
            return state;    
    }
};

const channel_reducer = (state = initialChannelState, action) =>  {
    switch(action.type){
        case actionTypes.SET_CURRENT_CHANNEL:
            return{
                ...state,
                currentChannel: action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return{
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel
            }
        case actionTypes.SET_USER_POSTS:
            return{
                ...state,
                userPosts: action.payload.userPosts
            }    
        default:
            return state;    
    }

};

const colours_reducer = (state=initalColoursState, action) => {
    switch(action.type){
        case actionTypes.SET_COLOURS:
            return{
                ...state,
                primaryColour: action.payload.primaryColour,
                secondaryColour: action.payload.secondaryColour
            }

        default:
            return state;
    }
}

const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer,
    colours: colours_reducer
});

export default rootReducer;
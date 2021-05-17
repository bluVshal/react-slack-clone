import * as actionTypes from './types';

/* User Action Types */
export const setUser = user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}

export const clearUser = () => {
    return {
        type: actionTypes.CLEAR_USER
    }
}

/* Channel Action Types */
export const setCurrentChannel = channel => {
    return {
        type: actionTypes.SET_CURRENT_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}

export const setPrivateChannel = isPrivateChannel => {
    return{
        type: actionTypes.SET_PRIVATE_CHANNEL,
        payload: {
            isPrivateChannel
        }
    }
}

export const setUserPosts = userPosts => {
    return{
        type: actionTypes.SET_USER_POSTS,
        payload: {
            userPosts
        }
    }
}

/* Colour Actions */
export const setColours = (primaryColour, secondaryColour) => {
    return{
        type: actionTypes.SET_COLOURS,
        payload: {
            primaryColour,
            secondaryColour
        }
    }
}
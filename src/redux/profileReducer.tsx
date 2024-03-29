import React from 'react'
import {profileAPI, UpdateModelProfileType} from '../api/api'
import {AppThunk} from "./store"
import {setAppError, setAppStatus} from "./appReducer"

export type InitialStateProfileReducerType = typeof initialState
export type ProfileType = typeof initialState.profile

let initialState = {
    profile: {
        fullName: null as null | string,
        aboutMe: null as null | string,
        lookingForAJob: true,
        lookingForAJobDescription: null,
        userId: null as null | number,
        contacts: {
            facebook: null,
            github: null,
            instagram: null,
            mainLink: null,
            twitter: null,
            vk: null,
            website: null,
            youtube: null
        },
        photos: {
            small: '',
            large: ''
        }
    },
    status: ''
}

export const profileReducer = (state: InitialStateProfileReducerType = initialState, action: ProfileReducerActionType): InitialStateProfileReducerType => {
    switch (action.type) {
        case 'SET_USER_PROFILE': {
            return {...state, profile: {...state.profile, ...action.payload}}
        }
        case 'SET_STATUS': {
            return {...state, status: action.status}
        }
        case 'SET_PHOTO_PROFILE': {
            return {...state, profile: {...state.profile, photos: action.photo}}
        }
        default:
            return state
    }
}

//typesActions

export type ProfileReducerActionType =
    | SetUserProfileType
    | SetStatusUserInProfileType
    | SetPhotoProfileType

export type SetUserProfileType = ReturnType<typeof setUserProfile>
export type SetStatusUserInProfileType = ReturnType<typeof setStatusUserInProfile>
export type SetPhotoProfileType = ReturnType<typeof setPhotoProfile>

//actions

export const setUserProfile = (payload: any) => ({type: 'SET_USER_PROFILE', payload}) as const
export const setStatusUserInProfile = (status: string) => ({type: 'SET_STATUS', status}) as const
export const setPhotoProfile = (photo: { small: string, large: string }) => ({
    type: 'SET_PHOTO_PROFILE',
    photo
} as const)

//thunk

export const getProfileTC = (paramsId: number): AppThunk => async (dispatch) => {
    dispatch(setAppStatus('loading'))
    try {
        const response = await profileAPI.getPtofile(paramsId)
        dispatch(setUserProfile(response.data))
    } catch (e) {

    } finally {
        dispatch(setAppStatus('succeeded'))
    }
}

export const setStatusTC = (userId: number): AppThunk => (dispatch) => {
    profileAPI.getStatus(userId)
        .then(response => {
            dispatch(setStatusUserInProfile(response.data))
        })
}


export const updateStatusProfileTC = (status: string): AppThunk => (dispatch) => {
    profileAPI.updateStatus(status)
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(setStatusUserInProfile(status))
            }
        })
}

export const updateInformationProfileTC = (model: UpdateModelProfileType): AppThunk => async (dispatch) => {
    const response = await profileAPI.updatePersonalInformation(model)
    if (response.data.resultCode === 0) {
        dispatch(setUserProfile(model))
        dispatch(setAppStatus('saveSucceeded'))
    } else {
        if (response.data.messages.length) {
            dispatch(setAppError(response.data.messages[0]))
        } else {
            dispatch(setAppError('Some error'))
        }
    }
}

export const editProfileAvatarTC = (photo: any): AppThunk => async (dispatch) => {
    const response = await profileAPI.updatePhoto(photo)
    if (response.data.resultCode === 0) {
        dispatch(setPhotoProfile(response.data.data.photos))
    }
}
import React, {useEffect, useState} from 'react';
import style from "./Users.module.css";
import NoAvatar from "../../images/NoAvatar.png";
import {addFollowTC, addUnfollowTC, getUsersTC, InitialStateUsersReducerType} from "../../redux/usersReducer";
import {NavLink} from "react-router-dom";
import UsersPagination from "./Pagination/UsersPagination";
import {CircularProgress, TextField} from "@mui/material";
import {StatusAppType} from "../../redux/appReducer";
import {useAppDispatch, useDebounce} from "../../common/hooks/hooks";
import Button from "@mui/material/Button";


type UsersPropsType = {
    usersPage: InitialStateUsersReducerType
    statusApp: StatusAppType
    isFriends?: true
}

const Users = (props: UsersPropsType) => {

    const dispatch = useAppDispatch()
    const [search, setSearch] = useState('')
    // const history = useHistory()
    const debouncedValue = useDebounce<string>(search, 700)

    useEffect(() => {
        dispatch(getUsersTC({
            pageSize: props.usersPage.pageSize,
            currentPage: 1,
            searchName: search,
            friend: props.isFriends
        }))
        // props.onClickPage(1, search)
        // history.push({
        //     pathname: '/users',
        //     search: `?term=${search}`
        // })
    }, [debouncedValue])

    const onClickPage = (currentPage: number, searchName: string) => {
        dispatch(getUsersTC({pageSize: props.usersPage.pageSize, currentPage, searchName, friend: props.isFriends}))
    }


    const handlerFollow = (userId: number) => {
        dispatch(addFollowTC(userId))
    }

    const handlerUnfollow = (userId: number) => {
        dispatch(addUnfollowTC(userId))
    }

    if (props.statusApp === 'loading') {
        return <div style={{display: 'flex', height: '70%', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className={style.usersPageBlock}>
            <div className={style.paginationAndSearchBlock}>
                <div className={style.fieldSearch}>
                    <TextField autoFocus={true} value={search} onChange={(e) => setSearch(e.currentTarget.value)}
                               id="filled-basic"
                               label="Search" variant="filled"/>
                </div>
                <div>
                    <UsersPagination totalCount={props.usersPage.totalCount}
                                     pageSize={props.usersPage.pageSize}
                                     currentPage={props.usersPage.currentPage}
                                     handlerCurrentPage={onClickPage}
                                     search={search}/>
                </div>
            </div>

            {props.usersPage.users.map(user => {
                    const ava = user.photos.large ? user.photos.large : NoAvatar
                    return <div key={user.id}>
                        <NavLink to={'/profile' + user.id}>
                            <div style={{backgroundImage: `url(${ava})`}} className={style.photosBlock}>
                            </div>
                        </NavLink>
                        <div className={style.nameUser}>
                            {user.name}
                        </div>
                        <div>
                            {user.status && <div className={style.statusUser}>
                                <span>Status: </span><span>{user.status}</span>
                            </div>}
                        </div>
                        <div className={style.buttonBlockFollowAndUnfollow}>
                            {user.followed
                                ? <Button variant="outlined" size="small"
                                          disabled={props.usersPage.followingInProgress.some(u => u === user.id)}
                                          onClick={() => handlerUnfollow(user.id)}>Unfollow</Button>
                                : <Button variant="outlined" size="small"
                                          disabled={props.usersPage.followingInProgress.some(u => u === user.id)}
                                          onClick={() => handlerFollow(user.id)}>Follow</Button>}
                        </div>
                    </div>
                }
            )}
        </div>
    )
}

export default Users;
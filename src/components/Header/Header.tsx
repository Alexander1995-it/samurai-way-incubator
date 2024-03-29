import React from 'react';
import style from './Header.module.css'
import {connect} from "react-redux";
import {InitialStateAuthReducerType, logoutTC, setAuthMeTC} from "../../redux/authReducer";
import LogoutIcon from '@mui/icons-material/Logout';
import {AppRootStateType} from "../../redux/store";

type HeaderContainerPropsType = MapDispatchToPropsType & MapStateToPropsType

class HeaderContainer extends React.Component<HeaderContainerPropsType> {

    render() {
        return <Header
            logoutTC={this.props.logoutTC}
            auth={this.props.auth}/>;
    }
}

type HeaderPropsType = {
    auth: InitialStateAuthReducerType
    logoutTC: () => void
}

const Header = (props: HeaderPropsType) => {
    return (
        <div className={style.header__block}>
            <div className={style.header__wrapper}>
                <div className={style.header__title}> social network Incubator</div>
                {props.auth.isAuth
                    ? <div className={style.logout__block}>
                        <div className={style.logout__text}>{props.auth.login}</div>
                        <div className={style.logout__icon}><LogoutIcon onClick={() =>props.logoutTC()} sx={{fontSize: '20px'}}/></div>
                    </div>
                    : <div className={style.header__login}>Login</div>
                }
            </div>
        </div>
    );
};

type MapDispatchToPropsType = {
    logoutTC: () => void
}

type MapStateToPropsType = {
    auth: InitialStateAuthReducerType
}
const mapStateToProps = (state: AppRootStateType): MapStateToPropsType => {
    return {
        auth: state.auth
    }
}


export default connect(mapStateToProps, {
    logoutTC
})(HeaderContainer)
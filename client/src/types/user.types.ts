import { Asset } from "./asset.types"
import { IState } from "./erp_report.types"

export type IRole = {
    _id: string,
    role: string,
    permissions: string[],
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IPermission = {
    value: string,
    label: string
}

export type IMenu = {
    label: string,
    menues?: IMenu[],
    permissions: IPermission[]
}

export type IUser = {
    _id: string,
    username: string,
    password: string,
    email: string,
    mobile: string,
    dp: Asset,
    client_id: string,
    connected_number?: string,
    is_admin: Boolean,
    show_only_visiting_card_leads: boolean,
    email_verified: Boolean,
    mobile_verified: Boolean,
    assigned_permissions: string[],
    is_active: Boolean,
    last_login: Date,
    multi_login_token: string | null,
    is_multi_login: boolean,
    assigned_users: IUser[]
    assigned_states: IState[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
    resetPasswordToken: string | null,
    resetPasswordExpire: Date | null,
    emailVerifyToken: string | null,
    emailVerifyExpire: Date | null
}
export type IUserMethods = {
    getAccessToken: () => string,
    comparePassword: (password: string) => boolean,
    getResetPasswordToken: () => string,
    getEmailVerifyToken: () => string
}
export type TUserBody = Request['body'] & IUser;


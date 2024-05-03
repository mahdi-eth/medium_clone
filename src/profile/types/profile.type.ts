import { UserType } from "@/user/user.type"

export type profileType = UserType & {
    folowing: boolean
}
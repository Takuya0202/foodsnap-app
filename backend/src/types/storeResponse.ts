// 店舗、投稿に関するレスポンスの型
export type storeResponse = {
    id : string
    name : string
    address : string
    likeCount : number
    commentCount : number
    photo : string | null
    posts : postResponse[]
}

export type postResponse = {
    id : string
    name : string
    price : number
    photo : string
    description : string | null
}
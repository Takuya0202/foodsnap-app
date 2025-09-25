// 店舗、投稿に関するレスポンスの型
export type storeResponse = {
    id : string,
    name : string,
    address : string,
    likeCount : number,
    commentCount : number,
    photo : string | null,
    latitude : number,
    longitude : number,
    genre : string | null,
    posts : Array<{
        id : string,
        name : string,
        price : number,
        photo : string,
        description : string | null,
    }>
}[]

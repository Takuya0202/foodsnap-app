import { Context, Hono } from "hono";
import { getSupabase } from "../middleware/supabase";
import { storeResponse } from "../types/storeResponse";
import { getCookie, setCookie } from "hono/cookie";

export const storeApp = new Hono()
  .get('/top', async (c: Context) => {
    const supabase = getSupabase(c);
    const { latitude, longitude } = c.req.query();
    // 表示した店を格納
    let cookie = getCookie(c , 'showedStores');
    let showedStores : string[] = cookie ? JSON.parse(cookie) : [];
    const isProd = c.env.NODE_ENV;

    // 取得するクエリ
    let query = supabase
    .from('stores')
    .select(`
    id,
    name,
    address,
    photo,
    latitude,
    longitude,
    genre:genres(name),
    posts (
        id,
        name,
        price,
        photo,
        description
    ),
    likes (count),
    comments (count)
    `);
    
    // 表示した店舗がある場合、表示した店舗を除外
    if (showedStores.length > 0 ) {
        // 対象は文字列形式のタプルで指定する必要がある。Postgreの仕様
        query = query.not('id' , 'in' , `(${showedStores.map((storeId) => `'${storeId}'`).join(',')})`)
    } 
    
    // 位置情報が取得できる場合、半径3km以内の店舗を取得する
    if (latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
        // 対象となる緯度、軽度について考える。1度は111kmと近似できるため、それを元に考える
        const range = 3 / 111;
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        const { data, error } = await query
            .gte('latitude', lat - range)
            .lte('latitude', lat + range)
            .gte('longitude', lon - range)
            .lte('longitude', lon + range)
            .order('created_at', { ascending: false })
            .limit(4, { referencedTable: 'posts' })
            .order('created_at', { ascending: false, referencedTable: 'posts' })
            .limit(20);

        if (error) {
            return c.json({
                message: 'fail to get stores',
                error: '店舗の取得に失敗しました。'
        }, 400);
        }

        // 取得できた場合。
        if (data && data.length > 0) {
            // 表示した店舗をcookieに保存
            showedStores = [...showedStores, ...data.map((store) => store.id)];
            setCookie(c , 'showedStores' , JSON.stringify(showedStores) , {
                httpOnly : true,
                secure : isProd,
                sameSite : isProd ? 'none' : 'lax',
                maxAge : 60 * 30 // 30分
            });

            const res: storeResponse = data.map((store) => ({
                id: store.id,
                name: store.name,
                address: store.address,
                latitude: store.latitude,
                longitude: store.longitude,
                photo: store?.photo,
                genre: store.genre?.name || null,
                likeCount: store.likes[0]?.count || 0,
                commentCount: store.comments[0]?.count || 0,
                posts: store.posts.map((post) => ({
                id: post.id,
                name: post.name,
                price: post.price,
                photo: post.photo,
                description: post?.description || null
            }))
        }));
        return c.json(res, 200);
    }
    }

    // 位置情報がない場合、または近くに店舗がない場合、新規に20件返す
    const { data , error } = await query
        .order('created_at', { ascending: false })
        .limit(4, { referencedTable: 'posts' })
        .order('created_at', { ascending: false, referencedTable: 'posts' })
        .limit(20);

    if (error) {
        return c.json({
            message: 'fail to get stores',
            error: '店舗の取得に失敗しました。'
        }, 400);
    }
    // 表示した店舗をcookieに保存
    showedStores = [...showedStores, ...data.map((store) => store.id)];
    setCookie(c , 'showedStores' , JSON.stringify(showedStores) , {
        httpOnly : true,
        secure : isProd,
        sameSite : isProd ? 'none' : 'lax',
        maxAge : 60 * 30 // 30分
    });
    const res: storeResponse = data.map((store) => ({
        id: store.id,
        name: store.name,
        address: store.address,
        latitude: store.latitude,
        longitude: store.longitude,
        photo: store?.photo,
        genre: store.genre?.name || null,
        likeCount: store.likes[0]?.count || 0,
        commentCount: store.comments[0]?.count || 0,
        posts: store.posts.map((post) => ({
            id: post.id,
            name: post.name,
            price: post.price,
            photo: post.photo,
            description: post?.description || null
      }))
    }));

    return c.json(res, 200);
  })
  .get('/index' , async (c : Context) => {
    
  })
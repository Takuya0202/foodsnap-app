import { Context, Hono } from 'hono';
import { getSupabase } from '../middleware/supabase';
import { commentResponse, storeDetailResponse, storeResponse, storeSearchResponse } from '../types/storeResponse';
import { getCookie, setCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import { CreateCommentRequest, createCommentSchema, searchStoreQuerySchema, SearchStoreQueryRequest, GetRandomStoresResponse, getRandomStoresSchema } from '../schema/store';
import { getValidationErrorResponnse, Bindings } from '../utils/setting';
import  { ZodError } from 'zod';
import cuid from 'cuid';
import { serverError , authError } from '../utils/setting';
export const storeApp = new Hono<{ Bindings: Bindings }>()
  .get('/top', async (c) => {
    try {
      const supabase = getSupabase(c);
      const { data : { user } } = await supabase.auth.getUser();
      const { latitude, longitude } = c.req.query();
      // 表示した店を格納
      let cookie = getCookie(c, 'showedStores');
      let showedStores: string[] = cookie ? JSON.parse(cookie) : [];

      const formattedLat = parseFloat(latitude);
      const formattedLon = parseFloat(longitude);

      // おすすめ店舗を取得するRPCを呼び出す
      const { data : rpcData , error } = await supabase.rpc('get_random_stores',{
        result_limit : 20,
        search_range : 3.0, // 半径3km以内の店舗
        showed_store_ids : showedStores,
        user_latitude : isNaN(formattedLat) ? undefined : formattedLat,
        user_longitude : isNaN(formattedLon) ? undefined : formattedLon,
      });

      if (error) {
        return c.json({
          message : 'fail to get stores',
          error : '店舗の取得に失敗しました。',
        }, 400);
      }

      // RPCはJson型でレスポンスするため、zodでパージ
      const result = getRandomStoresSchema.safeParse(rpcData);
      if (!result.success) {
        return c.json({
          message : 'fail to parse stores',
          error : '予期せぬエラーが発生しました。'
        }, 400);
      }
      const data = result.data;

      if (data && data.length === 0) {
        return c.json({
          message : 'no stores',
          error : '店舗が見つかりませんでした。',
        }, 404);
      }

      // 未表示(showedSroresに含まれないもののみ、cookieに追加)
      const newAddedStores = data.filter(store => !showedStores.includes(store.id));

      // 表示した店舗をcookieに保存
      showedStores = [...showedStores, ...newAddedStores.map(store => store.id)];
      setCookie(c, 'showedStores', JSON.stringify(showedStores), {
        httpOnly: true,
        secure: c.env.ENVIRONMENT === 'production',
        sameSite: c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
        maxAge: 60 * 5, // 5分
        domain : '.foodsnap.org',
      });

      const res: storeResponse = data.map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        prefectureName: store.prefecture?.name || null,
        latitude: store.latitude,
        longitude: store.longitude,
        photo: store?.photo,
        genre: store.genre?.name || null,
        likeCount: store.likes?.length || 0,
        isLiked : store.likes?.some(like => like.user_id === user?.id) || false, // 認証中のユーザーとuser_idが一致したらいいねフラグを立てる
        commentCount: store.comments.count || 0,
        posts: store.posts?.map(post => ({
          id: post.id,
          name: post.name,
          price: post.price,
          photo: post.photo,
          description: post?.description || null,
        })) || [],
      }));

      return c.json(res, 200);
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }
  })
  // なぜかindexにするとうまくルーティングされない。なのでlistに変更
  .get('/list', 
    zValidator('query', searchStoreQuerySchema, async (result, c: Context) => {
      if (!result.success) {
        return c.json({
          message: 'validation error',
          error : "無効なクエリです"
        }, 400);
      }
    }),
    async (c) => {
    try {
      // クエリの取得
      const supabase = getSupabase(c);
      const { data : { user } } = await supabase.auth.getUser();
      const { genreId, keyword, prefectureIds, tagIds , offset }: SearchStoreQueryRequest = c.req.valid('query');
      // 取得する件数
      const limit = 20;
      
      // 取得するクエリ store_tagsは内部結合で取得
      let query = supabase
        .from('stores')
        .select(
          `
          id,
          name,
          address,
          photo,
          latitude,
          longitude,
          genre:genres(name),
          posts!inner(
            id,
            name,
            price,
            photo,
            description
          ),
          prefectures!inner(
            id,
            name
          ),
          likes (
            user_id
          ),
          comments (count),
          store_tags(
            tag_id,
            tags(
              name
            )
          )
        `,
        { count: 'exact' }  // 全体の件数を取得
        )
        .not('posts', 'is', null);

      // ジャンル検索
      if (genreId) {
        query = query.eq('genre_id', genreId);
      }

      // 都道府県検索
      if (prefectureIds && prefectureIds.length > 0) {
        query = query.in('prefecture_id', prefectureIds.map(Number));
      }

      // タグ検索
      if (tagIds && tagIds.length > 0) {
        // タグ検索は内部結合にしないとできないのでクエリを別に作成
        query = supabase
        .from('stores')
        .select(
          `
          id,
          name,
          address,
          photo,
          latitude,
          longitude,
          genre:genres(name),
          posts!inner(
            id,
            name,
            price,
            photo,
            description
          ),
          prefectures!inner(
            id,
            name
          ),
          likes (
            user_id
          ),
          comments (count),
          store_tags!inner(
            tag_id,
            tags(
              name
            )
          )
        `,
        { count: 'exact' }  // 全体の件数を取得
        )
        .not('posts', 'is', null);
        query = query.in('store_tags.tag_id', tagIds.map(Number));
      }

      // キーワード検索
      if (keyword) {
        // ネストされたテーブルはor条件できない。
        query = query.or(`name.ilike.%${keyword}%,address.ilike.%${keyword}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .limit(4, { referencedTable: 'posts' })
        .order('created_at', { ascending: false, referencedTable: 'posts' })
        .range(offset * limit, (offset + 1) * limit - 1);

      if (error) {
        return c.json(
          {
            message: 'fail to get stores',
            error: '店舗の取得に失敗しました。',
          },
          400
        );
      }

      const res: storeResponse = data.map(store => ({
        id: store.id,
        name: store.name,
        prefectureName: store.prefectures?.name || null,
        address: store.address,
        latitude: store.latitude,
        longitude: store.longitude,
        photo: store?.photo,
        genre: store.genre?.name || null,
        likeCount: store.likes.length || 0,
        isLiked : store.likes.some(like => like.user_id === user?.id),
        commentCount: store.comments[0]?.count || 0,
        posts: store.posts.map(post => ({
          id: post.id,
          name: post.name,
          price: post.price,
          photo: post.photo,
          description: post?.description || null,
        })),
      }));

      return c.json({
        content : res,
        total : count || 0, 
        offset : offset,
        limit : limit,
      } , 200);
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }
  })
  // 検索の取得
  .get('/search' , async (c : Context) => {
    try {
      const supabase = getSupabase(c);
      // 存在してるジャンル、地域、タグの取得
      const [genres,prefectures,tags ] = await Promise.all([
        supabase.from('genres').select(`id , name`),
        supabase.from('prefectures').select(`id , name , area`),
        supabase.from('tags').select(`id , name`),
      ]);
      
      if (genres.error || prefectures.error || tags.error) {
        return c.json({
          message : 'fail to get search',
          error : '検索の取得に失敗しました。'
        } , 400);
      }

      const res : storeSearchResponse = {
        genres : genres.data.map((genre) => ({
          id : genre.id,
          name : genre.name
        })),
        prefectures : prefectures.data.map((prefecture) => ({
          id : prefecture.id,
          name : prefecture.name,
          area : prefecture.area
        })),
        tags : tags.data.map((tag) => ({
          id : tag.id,
          name : tag.name
        })),
      };

      return c.json(res , 200);
    } catch (error) {
      return c.json(serverError , 500);
    }
  }) 

  // 店舗詳細取得
  .get('/:storeId', async (c: Context) => {
    try {
      const { storeId } = c.req.param();
      if (!storeId) {
        return c.json(
          {
            message: 'bad request',
            error: '無効なリクエストです。',
          },
          400
        );
      }

      const supabase = getSupabase(c);
      const { data, error } = await supabase
        .from('stores')
        .select(
          `
          id,
          name,
          address,
          photo,
          phone,
          link,
          latitude,
          longitude,
          start_at,
          end_at,
          genres (name),
          prefectures (name),
          comments (
            id,
            user_id,
            content,
            created_at,
            profiles!user_id (
              name,
              icon
            )
          ),
          posts (
            id,
            name,
            price,
            photo,
            description
          ),
          store_tags (
            tags (
              id,
              name
            )
          )
          `
        )
        .eq('id', storeId)
        .single();

      if (!data || error) {
        return c.json(
          {
            message: 'fail to refrence store',
            error: '店舗が存在しません。',
          },
          404
        );
      }

      const res: storeDetailResponse = {
        id: data.id,
        name: data.name,
        address: data.address,
        prefectureName: data.prefectures?.name || null,
        genre: data.genres?.name || null,
        photo: data?.photo,
        phone: data.phone,
        link: data?.link,
        latitude: data.latitude,
        longitude: data.longitude,
        startAt: data?.start_at,
        endAt: data?.end_at,
        comments: data.comments.map(comment => ({
          id: comment.id,
          userId: comment.user_id,
          userName: comment.profiles.name,
          userIcon: comment.profiles?.icon,
          content: comment.content,
          createdAt: comment.created_at,
        })),
        posts: data.posts.map(post => ({
          id: post.id,
          name: post.name,
          price: post.price,
          photo: post.photo,
          description: post?.description,
        })),
        tags: data.store_tags.map(tag => ({
          id: tag.tags.id,
          name: tag.tags.name,
        })),
      };

      return c.json(res, 200);
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }
  })
  // いいね
  .post('/:storeId/like', async (c: Context) => {
    try {
      const { storeId } = c.req.param();
      if (!storeId) {
        return c.json(
          {
            message: 'bad request',
            error: '無効なリクエストです。',
          },
          400
        );
      }

      // ユーザー情報を取得
      const supabase = getSupabase(c);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || !user.id || userError) {
        return c.json(
          authError,
          401
        );
      }

      // ユーザーがいいねしているかどうか
      const { data: isLike, error: isLikeError } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('store_id', storeId)
        .maybeSingle();

      if (isLikeError) {
        return c.json(
          {
            message: 'fail to refrence store',
            error: '対象の店舗が存在しません。',
          },
          404
        );
      }

      // いいねしていない場合、追加
      if (!isLike) {
        const { data: likeData, error: likeError } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            store_id: storeId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (!likeData || likeError) {
          return c.json(
            {
              message: 'fail to add like',
              error: 'いいねに失敗しました。',
            },
            400
          );
        } else {
          return c.json(
            {
              message: 'いいねに成功しました。',
              status : 'like'
            },
            200
          );
        }
      }
      // いいねをしている場合、削除
      else {
        const { data: likeData, error: likeError } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('store_id', storeId)
          .select();

        if (!likeData || likeError) {
          return c.json(
            {
              message: 'fail to delete like',
              error: 'いいねの削除に失敗しました。',
            },
            400
          );
        } else {
          return c.json(
            {
              message: 'いいねを削除しました。',
              status : 'unlike'
            },
            200
          );
        }
      }
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }
  })
  // コメントの取得
  .get('/:storeId/comments', async (c: Context) => {
    try {
      const { storeId } = c.req.param();
      if (!storeId) {
        return c.json(
          {
            message: 'bad request',
            error: '無効なリクエストです。',
          },
          400
        );
      }

      const supabase = getSupabase(c);

      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          id,
          user_id,
          content,
          created_at,
          profiles!user_id (
            name,
            icon
          )
        `
        )
        .eq('store_id', storeId);

      if (!data || error) {
        return c.json(
          {
            message: 'fail to get comments',
            error: 'コメントの取得に失敗しました。',
          },
          400
        );
      }

      const res: commentResponse = data.map(comment => ({
        id: comment.id,
        userId: comment.user_id,
        userName: comment.profiles.name,
        userIcon: comment.profiles?.icon,
        content: comment.content,
        createdAt: comment.created_at,
      }));

      return c.json(res, 200);
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }
  })
  // コメントの投稿
  .post(
    '/:storeId/comments',
    zValidator('json', createCommentSchema, async (result, c: Context) => {
      if (!result.success) {
        const errors = getValidationErrorResponnse(result.error as ZodError);
        return c.json(
          {
            message: 'validation error',
            error: errors,
          },
          400
        );
      }
    }),
    async (c) => {
      try {
        const { storeId } = c.req.param();
        if (!storeId) {
          return c.json(
            {
              message: 'bad request',
              error: '無効なリクエストです。',
            },
            400
          );
        }
        const { content }: CreateCommentRequest = c.req.valid('json');
        const supabase = getSupabase(c);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (!user || !user.id || userError) {
          return c.json(
            authError,
            401
          );
        }

        const { data: insertData, error: insertError } = await supabase
          .from('comments')
          .insert({
            id: cuid(),
            user_id: user.id,
            store_id: storeId,
            content: content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (!insertData || insertError) {
          return c.json(
            {
              message: 'fail to insert comment',
              error: 'コメントの投稿に失敗しました。',
            },
            400
          );
        }

        return c.json(
          {
            message: 'コメントを投稿しました。',
          },
          200
        );
      } catch (error) {
        return c.json(
          serverError,
          500
        );
      }
    }
  )
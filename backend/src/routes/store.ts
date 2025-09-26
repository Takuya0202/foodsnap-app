import { Context, Hono } from 'hono';
import { getSupabase } from '../middleware/supabase';
import { commentResponse, storeDetailResponse, storeResponse } from '../types/storeResponse';
import { getCookie, setCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import { CreateCommentRequest, createCommentSchema } from '../schema/store';
import { getValidationErrorResponnse } from '../utils/setting';
import { ZodError } from 'zod';
import cuid from 'cuid';

export const storeApp = new Hono()
  .get('/top', async (c: Context) => {
    try {
      const supabase = getSupabase(c);
      const { latitude, longitude } = c.req.query();
      // 表示した店を格納
      let cookie = getCookie(c, 'showedStores');
      let showedStores: string[] = cookie ? JSON.parse(cookie) : [];
      const isProd = c.env.NODE_ENV;

      // 取得するクエリ
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
          posts (
            id,
            name,
            price,
            photo,
            description
          ),
          likes (count),
          comments (count)
        `
        )
        .not('posts', 'is', null); // 投稿がない店舗は除外

      // 表示した店舗がある場合、表示した店舗を除外
      if (showedStores.length > 0) {
        // 対象は文字列形式のタプルで指定する必要がある。Postgreの仕様
        query = query.not('id', 'in', `(${showedStores.map(storeId => `'${storeId}'`).join(',')})`);
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
          console.error('Supabase error (nearby stores):', error);
          return c.json(
            {
              message: 'fail to get stores',
              error: '店舗の取得に失敗しました。',
            },
            400
          );
        }

        // 取得できた場合。
        if (data && data.length > 0) {
          // 表示した店舗をcookieに保存
          showedStores = [...showedStores, ...data.map(store => store.id)];
          setCookie(c, 'showedStores', JSON.stringify(showedStores), {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 60 * 30, // 30分
          });

          const res: storeResponse = data.map(store => ({
            id: store.id,
            name: store.name,
            address: store.address,
            latitude: store.latitude,
            longitude: store.longitude,
            photo: store?.photo,
            genre: store.genre?.name || null,
            likeCount: store.likes[0]?.count || 0,
            commentCount: store.comments[0]?.count || 0,
            posts: store.posts.map(post => ({
              id: post.id,
              name: post.name,
              price: post.price,
              photo: post.photo,
              description: post?.description || null,
            })),
          }));
          return c.json(res, 200);
        }
      }

      // 位置情報がない場合、または近くに店舗がない場合、新規に20件返す
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(4, { referencedTable: 'posts' })
        .order('created_at', { ascending: false, referencedTable: 'posts' })
        .limit(20);

      if (error) {
        console.error('Supabase error (all stores):', error);
        return c.json(
          {
            message: 'fail to get stores',
            error: '店舗の取得に失敗しました。',
          },
          400
        );
      }

      // 表示した店舗をcookieに保存
      showedStores = [...showedStores, ...data.map(store => store.id)];
      setCookie(c, 'showedStores', JSON.stringify(showedStores), {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 60 * 30, // 30分
      });

      const res: storeResponse = data.map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        latitude: store.latitude,
        longitude: store.longitude,
        photo: store?.photo,
        genre: store.genre?.name || null,
        likeCount: store.likes[0]?.count || 0,
        commentCount: store.comments[0]?.count || 0,
        posts: store.posts.map(post => ({
          id: post.id,
          name: post.name,
          price: post.price,
          photo: post.photo,
          description: post?.description || null,
        })),
      }));

      return c.json(res, 200);
    } catch (error) {
      console.error('Unexpected error in /top:', error);
      return c.json(
        {
          message: 'Internal server error',
          error: 'サーバーエラーが発生しました。',
        },
        500
      );
    }
  })
  .get('/index', async (c: Context) => {
    try {
      // クエリの取得
      const supabase = getSupabase(c);
      const { genreId, keyword } = c.req.query();
      const prefectureIds: string[] = c.req.queries('prefectureId') || [];
      const tagIds: string[] = c.req.queries('tagId') || [];
      const areas: string[] = c.req.queries('area') || [];

      // 取得するクエリ
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
          posts (
            id,
            name,
            price,
            photo,
            description
          ),
          likes (count),
          comments (count)
        `
        )
        .not('posts', 'is', null);

      // ジャンル検索
      if (genreId) {
        query = query.eq('genre_id', genreId);
      }

      // 都道府県検索
      if (prefectureIds.length > 0) {
        query = query.in('prefecture_id', prefectureIds);
      }

      // タグ検索
      if (tagIds.length > 0) {
        query = query.in('tags.id', tagIds);
      }

      // エリア検索
      if (areas.length > 0) {
        query = query.in('prefectures.area', areas);
      }

      // キーワード検索
      if (keyword) {
        query = query
          .ilike('address', `%${keyword}%`)
          .ilike('prefectures.name', `%${keyword}%`)
          .ilike('genres.name', `%${keyword}%`)
          .ilike('posts.name', `%${keyword}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(4, { referencedTable: 'posts' })
        .order('created_at', { ascending: false, referencedTable: 'posts' })
        .limit(20);

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
        address: store.address,
        latitude: store.latitude,
        longitude: store.longitude,
        photo: store?.photo,
        genre: store.genre?.name || null,
        likeCount: store.likes[0]?.count || 0,
        commentCount: store.comments[0]?.count || 0,
        posts: store.posts.map(post => ({
          id: post.id,
          name: post.name,
          price: post.price,
          photo: post.photo,
          description: post?.description || null,
        })),
      }));

      return c.json(res, 200);
    } catch (error) {
      return c.json(
        {
          message: 'Internal server error',
          error: 'サーバーエラーが発生しました。',
        },
        500
      );
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
        {
          message: 'Internal server error',
          error: 'サーバーエラーが発生しました。',
        },
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
          {
            message: 'unAuthorized',
            error: 'ログインが必要です。',
          },
          401
        );
      }

      // ユーザーがいいねしているかどうか
      const { data: isLike, error: isLikeError } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('store_id', storeId)
        .single();

      if (isLikeError) {
        return c.json(
          {
            message: 'fail to check like',
            error: 'いいねの確認に失敗しました。',
          },
          400
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
            },
            200
          );
        }
      }
    } catch (error) {
      return c.json(
        {
          message: 'Internal server error',
          error: 'サーバーエラーが発生しました。',
        },
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
        {
          message: 'Internal server error',
          error: 'サーバーエラーが発生しました。',
        },
        500
      );
    }
  })
  // コメントの投稿
  .post(
    '/:storeId/comments',
    zValidator('json', createCommentSchema, async (result, c: Context) => {
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

        if (!result.success) {
          const errors = getValidationErrorResponnse(result.error as ZodError);
          return c.json(
            {
              message: 'validation error',
              errors: errors,
            },
            400
          );
        }

        const { content }: CreateCommentRequest = result.data;
        const supabase = getSupabase(c);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (!user || !user.id || userError) {
          return c.json(
            {
              message: 'unAuthorized',
              error: 'ログインが必要です。',
            },
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
          {
            message: 'Internal server error',
            error: 'サーバーエラーが発生しました。',
          },
          500
        );
      }
    })
  );

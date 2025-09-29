import { zValidator } from '@hono/zod-validator';
import { Context, Hono } from 'hono';
import { CreateAdminRequest, createAdminSchema, LoginAdminRequest, loginAdminSchema, UpdateAdminRequest, updateAdminSchema } from '../schema/admin';
import { getValidationErrorResponnse } from '../utils/setting';
import { ZodError } from 'zod';
import { getSupabase } from '../middleware/supabase';
import { v4 as uuidv4 } from 'uuid';
import { AdminDetailReponse, AdminReponse } from '../types/adminReponse';

export const adminApp = new Hono().post(
  '/register',
  zValidator('form', createAdminSchema, async (result, c: Context) => {
    try {
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
      // データの取得
      const {
        name,
        email,
        password,
        phone,
        address,
        latitude,
        longitude,
        prefectureId,
        genreId,
        tags,
        link,
        startAt,
        endAt,
        photo,
      }: CreateAdminRequest = result.data;

      const supabase = getSupabase(c);

      // 正しいジャンルIDか
      if (genreId) {
        const { data: genre, error: genreError } = await supabase
          .from('genres')
          .select('id')
          .eq('id', genreId)
          .single();

        if (!genre || genreError) {
          return c.json(
            {
              message: 'invalid genre id',
              error: '存在しないジャンルです。',
            },
            400
          );
        }
      }

      // 正しい都道府県IDか
      if (prefectureId) {
        const { data: prefecture, error: prefectureError } = await supabase
          .from('prefectures')
          .select('id')
          .eq('id', prefectureId)
          .single();

        if (!prefecture || prefectureError) {
          return c.json(
            {
              message: 'invalid prefecture id',
              error: '存在しない都道府県です。',
            },
            400
          );
        }
      }

      // 正しいタグIDか
      if (tags) {
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('id')
          .in('id', tags);

        // 全てのタグが存在するか
        if (tags.length !== tagsData?.length || tagsError) {
          return c.json(
            {
              message: 'invalid tags',
              error: '存在しないタグです。',
            },
            400
          );
        }
      }
      // photoをstorageに保管して、urlの取得
      let path = null;
      if (photo) {
        try {
          // 拡張子の取得
          const extention = photo.name.split('.').pop();
          // pathの作成
          const photoUrl = `${uuidv4()}.${extention}`;
          // upload
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photo')
            .upload(photoUrl, photo, {
              cacheControl: '3600',
              upsert: false,
            });
          // 失敗
          if (!uploadData || uploadError) {
            throw uploadError;
          }
          // urlの取得
          const {
            data: { publicUrl },
          } = supabase.storage.from('photo').getPublicUrl(photoUrl);
          path = publicUrl;
        } catch (error) {
          return c.json(
            {
              message: 'fail to upload photo',
              error: '写真のアップロードに失敗しました。再度お試しください。',
            },
            400
          );
        }
      }

      // signup
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${c.env.APP_URL}/admin/auth/callback`,
          data: {
            name,
            phone,
            address,
            latitude,
            longitude,
            link,
            photo: path,
            startAt,
            endAt,
            genreId,
            prefectureId,
            tags,
          },
        },
      });

      if (!user || !user.email || error) {
        return c.json(
          {
            message: 'supabase error',
            error: '登録に失敗しました。再度お試しください。',
          },
          400
        );
      }

      return c.json(
        {
          message: 'register success',
          email: user.email,
        },
        200
      );
    } catch (error) {
      return c.json(
        {
          message: 'internal server error',
        },
        500
      );
    }
  })
)
  .post('/login' , zValidator('json' , loginAdminSchema , async(result , c : Context) => {
    if (!result.success) {
      const errors = getValidationErrorResponnse(result.error as ZodError);
      return c.json({
        message : 'validation error',
        errors : errors,
      });
    }

    const { email , password } : LoginAdminRequest = result.data;
    const supabase = getSupabase(c);

    const { data : { user } , error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!user || error ) {
      return c.json({
        message : 'fail for login',
        error : 'メールアドレスまたはパスワードが正しくありません。',
      } , 400);
    }

    // 管理者の情報を取得
    const { data :  admin  , error : adminError } = await supabase
      .from('stores')
      .select(`
          id,
          name,
          likes (count),
          posts (
            id,
            name,
            price,
            photo,
            description,
            updated_at
          ),
          comments (
            count,
            id,
            content,
            user_id,
            profiles!user_id (
              name,
              icon
            ),
            created_at
          )
      `)
      .eq('user_id' , user.id)
      .single();

    if (!admin || adminError) {
      return c.json({
        message : 'fail to get admin',
        error : '管理者の情報の取得に失敗しました。再度ログインをお試しください。',
      } , 400);
    }

    const res : AdminReponse = {
      id : admin.id,
      name : admin.name,
      likeCount : admin.likes[0]?.count,
      commentCount : admin.comments[0]?.count,
      posts : admin.posts.map(post => ({
        id : post.id,
        name : post.name,
        price : post.price,
        photo : post.photo,
        description : post.description,
        updatedAt : post.updated_at,
      })) || null,
      comments : admin.comments.map(comment => ({
        id : comment.id,
        content : comment.content,
        userId : comment.user_id,
        userName : comment.profiles.name,
        userIcon : comment.profiles.icon,
        createdAt : comment.created_at,
      })) || null,
    }

    return c.json(res , 200);
  }))
  .get('/detail' , async (c : Context) => {
    try {
      const supabase = getSupabase(c);
      const { data : { user } , error : userError } = await supabase.auth.getUser();

      if (!user || userError ) {
        return c.json({
          message : 'unAuthorized',
          error : '認証に失敗しました。再度ログインをお試しください。',
        } , 401);
      }

      const { data : admin , error : adminError } = await supabase
        .from('stores')
        .select(`
          id,
          name,
          phone,
          address,
          photo,
          link,
          start_at,
          end_at,
          latitude,
          longitude,
          genre_id,
          prefecture_id,
          store_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq('user_id' , user.id)
        .single();

        if (!admin || adminError ) {
          return c.json({
            message : 'fail to get admin',
            error : '管理者の情報の取得に失敗しました。再度ログインをお試しください。',
          } , 400);
        }

        const res : AdminDetailReponse = {
          id : admin.id,
          name : admin.name,
          address : admin.address,
          latitude : admin.latitude,
          longitude : admin.longitude,
          phone : admin.phone,
          prefectureId : admin.prefecture_id,
          genreId : admin.genre_id,
          tags : admin.store_tags.map((tag) => ({
            id : tag.tags.id,
            name : tag.tags.name,
          })) || null,
          photo : admin.photo,
          link : admin.link,
          startAt : admin.start_at,
          endAt : admin.end_at,
        }

      return c.json(res , 200);
    } catch (error) {
      return c.json({
        message : 'internal server error',
      } , 500);
    }
  })
  .put('/update' , zValidator('form' , updateAdminSchema , async(result , c : Context ) => {
    if (!result.success) {
      const errors = getValidationErrorResponnse(result.error as ZodError);
      return c.json({
        message : 'validation error',
        errors : errors,
      } , 400);
    }

    const { name , phone , address , latitude , longitude , prefectureId , genreId , tags , link , startAt , endAt , photo } : UpdateAdminRequest = result.data;
    const supabase =getSupabase(c);
    const { data : { user } , error : userErrorr } = await supabase.auth.getUser();

    if (!user || userErrorr ) {
      return c.json({
        message : 'unAuthorized',
        error : '認証に失敗しました。再度ログインをお試しください。',
      } , 401);
    } 

    let path = null;
    if (photo) {
      try {
        const extention = photo.name.split('.').pop();
        const photoUrl = `${uuidv4()}.${extention}`;
        const { data : uploadData , error : uploadError } = await supabase
          .storage
          .from('photo')
          .update(photoUrl , photo , {
            cacheControl : '3600',
            upsert : false,
          })
        if (!uploadData || uploadError) {
          throw uploadError;
        }
        const { data : { publicUrl } } = supabase.storage.from('photo').getPublicUrl(photoUrl);
        path = publicUrl;
      } catch (error) {
        return c.json({
          message : 'fail to upload photo',
          error : '写真のアップロードに失敗しました。再度お試しください。',
        } , 400);
      }
    }

    // 更新    storesとstore_tagsのトランザクション。rpcを使う。
    const { data : admin , error : adminError } = await supabase.rpc('update_admin_stores' , {
      _user_id : user.id,
      _name : name,
      _phone : phone,
      _address : address,
      _latitude : latitude,
      _longitude : longitude,
      _end_at : endAt ,
      _start_at : startAt,
      _prefecture_id : prefectureId,
      _genre_id : genreId,
      _link : link,
      _photo : path || undefined,
      _tag_ids : tags || undefined,
    })

      if (adminError) {
        console.log(adminError);
        return c.json({
          message : 'fail to update admin',
          error : '管理者の情報の更新に失敗しました。再度お試しください。',
        } , 400);
      }

    return c.json({
      message : '更新に成功しました。',
    } , 200);
  }))
  .delete('/delete' , async (c : Context ) => {
    try {
      const supabase =getSupabase(c);
      const { data : { user } , error : userError } = await supabase.auth.getUser();
      
      if (!user || userError ){
        return c.json({
          message : 'unAuthorized',
          error : '認証に失敗しました。再度ログインをお試しください。',
        } , 401);
      } 
      // 管理者もauth.userとcascadeなので、消すだけで大丈夫なはず。
      const { data : deleteAdmin , error : deleteAdminError } = await supabase.auth.admin.deleteUser(user.id);

      if (deleteAdminError) {
        console.log(deleteAdminError);
        return c.json({
          message : 'fail to delete admin',
          error : '管理者の削除に失敗しました。再度お試しください。',
        } , 400);
      }

      return c.json({
        message : '削除に成功しました。',
      } , 200);
    } catch (error) {
      console.log(error);
      return c.json({
        message : 'internal server error',
      } , 500);
    }
  })

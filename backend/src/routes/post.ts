import { Context, Hono } from "hono";
import { getSupabase } from "../middleware/supabase";
import { zValidator } from "@hono/zod-validator";
import { CreateAndUpdatePostRequest, createAndUpdatePostSchema } from "../schema/post";
import { getValidationErrorResponnse, uploadImage } from "../utils/setting";
import { ZodError } from "zod";
import cuid from "cuid";
import { serverError , authError } from "../utils/setting";

export const postApp = new Hono()
.post('/create' , zValidator('form' , createAndUpdatePostSchema , async(result , c : Context ) => {
  if (!result.success) {
     const errors = getValidationErrorResponnse(result.error as ZodError);
     return c.json({
      message : 'validation error',
      error : errors,
    } , 400);
  }
}),
async (c) => {
  try {
    const { name , price , photo , description } : CreateAndUpdatePostRequest= c.req.valid('form');
    const supabase = getSupabase(c);
    const { data : { user } , error : getUserError } = await supabase.auth.getUser();
    if (!user || getUserError) {
      return c.json(authError , 401);
    }

    // 店舗idの取得
    const { data : storeData , error : storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id' , user.id)
      .single();

    if (!storeData || storeError) {
      return c.json({
        message : 'fail to get store',
        error : '店舗の取得に失敗しました。',
      } , 400);
    }
    
    // 写真をupload
    let path = null;
    if (photo) {
      try {
        path = await uploadImage(supabase , user.id , photo , 'post');
      } catch (error) {
        return c.json({
          message : 'fail to upload photo',
          error : '写真のアップロードに失敗しました。',
        } , 400);
      }
    }

    if (!path) {
      return c.json({
        message : 'fail to upload photo',
        error : '写真のアップロードに失敗しました。',
      } , 400);
    }
    // 投稿を作成
    const { data : postData , error : postError } = await supabase
      .from('posts')
      .insert({
        id : cuid(),
        store_id : storeData.id,
        name ,
        price ,
        photo : path,
        description : description,
        created_at : new Date().toISOString(),
        updated_at : new Date().toISOString(),
      })
      .select()
      .single();

    if (!postData || postError) {
      return c.json({
        message : 'fail to create post',
        error : '投稿に失敗しました。',
      } , 400);
    }

    return c.json({
      message : '投稿に成功しました。',
    } , 200);

  } catch (error) {
      return c.json(serverError , 500);
  }
}
)
  // メニュー投稿詳細取得
  .get('/:postId' , async (c : Context ) => {
    try {
      const { postId } =c.req.param();
      if (!postId) {
        return c.json({
          message : 'bad request',
          error : '無効なリクエストです。',
        } , 400);
      }

      const supabase = getSupabase(c);
      const { data : { user } , error : getUserError } = await supabase.auth.getUser();
      if (!user || getUserError) {
        return c.json(authError , 401);
      }
      // 実行してるユーザーの店舗idを取得
      const { data : storeData , error : storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id' , user.id)
        .single();
      if (!storeData || storeError) {
        return c.json({
          message : 'fail to get store',
          error : '店舗の取得に失敗しました。',
        } , 400);
      }
      const { data : postData , error : postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id' , postId)
        .eq('store_id' , storeData.id)
        .single();
      
        if (!postData || postError) {
          return c.json({
            message : 'fail to get post',
            error : '投稿の取得に失敗しました。',
          } , 400);
        }
    } catch (error) {
        return c.json(serverError , 500);
    }
  })
  .put('/:postId/update' , zValidator('form' , createAndUpdatePostSchema , async(result , c : Context) => {
    if (!result.success) {
      const errors = getValidationErrorResponnse(result.error as ZodError);
      return c.json({
        message : 'validation error',
        errors : errors,
      } , 400);
    }

    try {
      const { name , price , photo , description } : CreateAndUpdatePostRequest = result.data;
      const supabase = getSupabase(c);
      const { data : { user } , error : getUserError } = await supabase.auth.getUser();
      if (!user || getUserError) {
        return c.json(authError , 401);
      }

      const { postId } = c.req.param();
      if (!postId) {
        return c.json({
          message : 'bad request',
          error : '無効なリクエストです。',
        } , 400);
      }
      
      // 店舗idの取得
      const { data : storeData , error : storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id' , user.id)
        .single();

      if (!storeData || storeError) {
        return c.json({
          message : 'fail to get store',
          error : '店舗の取得に失敗しました。',
        } , 400);
      }

      // 既存データの取得
      const { data : existData , error : existError } = await supabase
        .from('posts')
        .select(`id , photo`)
        .eq('id' , postId)
        .eq('store_id' , storeData.id)
        .single();

      if (!existData || existError) {
        return c.json({
          message : 'fail to get exist data',
          error : '既存データの取得に失敗しました。',
        } , 400);
      }
      
      // 写真をupload
      let path = null;
      if (photo) {
        try {
          path = await uploadImage(supabase , user.id , photo , 'post' , existData.photo);
        } catch (error) {
          return c.json({
            message : 'fail to upload photo',
            error : '写真のアップロードに失敗しました。',
          } , 400);
        }
      }

      if(!path) {
        return c.json({
          message : 'fail to upload photo',
          error : '写真のアップロードに失敗しました。',
        } , 400);
      }
      // 投稿を更新
      const { data : updateData , error : updateError } = await supabase
        .from('posts')
        .update({
          name,
          price,
          photo : path,
          description,
          updated_at : new Date().toISOString(),
        })
        .eq('id' , postId)
        .eq('store_id' , storeData.id)
        .select()
        .single();

      if (!updateData || updateError) {
        return c.json({
          message : 'fail to update post',
          error : '投稿の更新に失敗しました。',
        } , 400);
      }

      return c.json({
        message : '投稿に成功しました。',
      } , 200);
    } catch (error) {
      return c.json(serverError , 500);
    }
  }))
  .delete('/:postId/delete' , async (c : Context ) => {
    try {
      const supabase = getSupabase(c);
      const { data : { user } , error : getUserError } = await supabase.auth.getUser();
      if (!user || getUserError) {
        return c.json(authError , 401);
      }
      const { postId } = c.req.param();
      if (!postId) {
        return c.json({
          message : 'bad request',
          error : '無効なリクエストです。',
        } , 400);
      }

      // 店舗idの取得
      const { data : storeData , error : storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id' , user.id)
        .single();

      if (!storeData || storeError ) {
        return c.json({
          message : 'fail to get store',
          error : '店舗の取得に失敗しました。',
        } , 400);
      }

      // 投稿を削除
      const { data : deleteData , error : deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id' , postId)
        .eq('store_id' , storeData.id)
        .select()
        .single();
    
      if (!deleteData || deleteError) {
        return c.json({
          message : 'fail to delete post',
          error : '投稿の削除に失敗しました。',
        } , 400);
      }

      return c.json({
        message : '投稿の削除に成功しました。',
      } , 200);
    } catch (error) {
      return c.json(serverError , 500);
    }
  })
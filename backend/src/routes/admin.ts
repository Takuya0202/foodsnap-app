import { zValidator } from '@hono/zod-validator';
import { Context, Hono } from 'hono';
import { CreateAdminRequest, createAdminSchema } from '../schema/admin';
import { getAppUrl, getValidationErrorResponnse } from '../utils/setting';
import { ZodError } from 'zod';
import { getSupabase } from '../middleware/supabase';
import { v4 as uuidv4 } from 'uuid';

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
          emailRedirectTo: `${getAppUrl(c)}/admin/auth/callback`,
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
);

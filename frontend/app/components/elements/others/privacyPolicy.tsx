"use client";

import { Close } from "@mui/icons-material";
import { useState } from "react";

// プライバシーポリシーのコンポーネント
export default function PrivacyPolicy() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      {isOpen ? (
        <div className="bg-black bg-opacity-70 fixed top-0 left-0 w-full h-full z-[100] flex items-center justify-center">
          <div className="bg-[#181818] form-shadow rounded-sm p-6 max-w-[640px] w-[90%] max-h-[90vh] overflow-y-auto">
            <div className="w-full flex justify-end sticky top-0 bg-[#181818] pb-2">
              <button onClick={() => setIsOpen(false)} aria-label="閉じる">
                <Close sx={{ width: 24, height: 24, color: "#cccccc" }} />
              </button>
            </div>
            <h1 className="text-white text-[24px] font-bold mb-6">プライバシーポリシー</h1>

            <div className="text-[#cccccc] text-sm space-y-6">
              <section>
                <p className="leading-relaxed">
                  FoodSnap（以下「本サービス」といいます）は、個人開発のポートフォリオ作品として運営されています。
                  本プライバシーポリシーは、本サービスにおけるユーザーの個人情報の取り扱いについて定めるものです。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第1条（収集する情報）</h2>
                <p className="leading-relaxed mb-2">本サービスでは、以下の情報を収集します：</p>

                <h3 className="text-white text-sm font-semibold mt-4 mb-2">
                  1. アカウント登録時に収集する情報
                </h3>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>ユーザー名</li>
                  <li>メールアドレス</li>
                  <li>パスワード（暗号化されて保存されます）</li>
                  <li>プロフィール画像（任意）</li>
                </ul>

                <h3 className="text-white text-sm font-semibold mt-4 mb-2">
                  2. Google認証を利用した場合に取得する情報
                </h3>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>Googleアカウントのユーザー名</li>
                  <li>Googleアカウントのメールアドレス</li>
                  <li>Googleアカウントのプロフィール画像</li>
                </ul>

                <h3 className="text-white text-sm font-semibold mt-4 mb-2">
                  3. サービス利用時に自動的に収集される情報
                </h3>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>アクセス日時</li>
                  <li>IPアドレス</li>
                  <li>ブラウザの種類とバージョン</li>
                  <li>デバイス情報</li>
                  <li>位置情報（ユーザーが許可した場合のみ）</li>
                  <li>Cookie情報</li>
                </ul>

                <h3 className="text-white text-sm font-semibold mt-4 mb-2">
                  4. ユーザーが投稿するコンテンツ
                </h3>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>店舗情報（管理者のみ）</li>
                  <li>メニュー情報（管理者のみ）</li>
                  <li>コメント</li>
                  <li>いいね情報</li>
                  <li>画像ファイル</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第2条（利用目的）</h2>
                <p className="leading-relaxed mb-2">収集した個人情報は、以下の目的で利用します：</p>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>本サービスの提供、維持、改善のため</li>
                  <li>ユーザー認証およびアカウント管理のため</li>
                  <li>ユーザーからのお問い合わせへの対応のため</li>
                  <li>利用規約違反や不正利用の防止のため</li>
                  <li>サービスの改善や新機能開発の検討のため</li>
                  <li>統計データの作成のため（個人を特定できない形式）</li>
                  <li>位置情報を利用した店舗検索機能の提供のため</li>
                </ol>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第3条（第三者提供）</h2>
                <p className="leading-relaxed mb-2">
                  本サービスは、以下の第三者サービスを利用しており、これらのサービスに情報が提供されます：
                </p>

                <h3 className="text-white text-sm font-semibold mt-4 mb-2">1. Supabase</h3>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>用途：認証、データベース管理</li>
                  <li>提供情報：ユーザー情報、投稿コンテンツ</li>
                  <li>
                    プライバシーポリシー：
                    <a
                      href="https://supabase.com/privacy"
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://supabase.com/privacy
                    </a>
                  </li>
                </ul>

                <h3 className="text-white text-sm font-semibold mt-4 mb-2">2. Google OAuth</h3>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>用途：Google認証によるログイン</li>
                  <li>提供情報：Googleアカウント情報（名前、メールアドレス、プロフィール画像）</li>
                  <li>
                    プライバシーポリシー：
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://policies.google.com/privacy
                    </a>
                  </li>
                </ul>

                <h3 className="text-white text-sm font-semibold mt-4 mb-2">
                  3. Cloudflare Workers
                </h3>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>用途：バックエンドAPIのホスティング</li>
                  <li>提供情報：APIリクエスト情報</li>
                  <li>
                    プライバシーポリシー：
                    <a
                      href="https://www.cloudflare.com/privacypolicy/"
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.cloudflare.com/privacypolicy/
                    </a>
                  </li>
                </ul>

                <p className="leading-relaxed mt-4">
                  上記以外では、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第4条（Cookieの使用）</h2>
                <p className="leading-relaxed mb-2">
                  本サービスでは、ユーザー認証やサービスの利便性向上のためにCookieを使用しています。
                  Cookieには以下の情報が含まれます：
                </p>
                <ul className="list-disc ml-5 space-y-1 leading-relaxed">
                  <li>認証セッション情報</li>
                  <li>ユーザー設定情報</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  ブラウザの設定によりCookieを無効化することができますが、その場合、一部の機能が正常に動作しない可能性があります。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第5条（位置情報の利用）</h2>
                <p className="leading-relaxed">
                  本サービスでは、ユーザーの現在地に基づいた店舗検索機能を提供するため、位置情報を取得する場合があります。
                  位置情報の取得には、ユーザーの明示的な許可が必要です。
                  位置情報は店舗検索の目的でのみ使用され、サーバーには保存されません。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第6条（セキュリティ）</h2>
                <p className="leading-relaxed">
                  本サービスは、個人情報の保護のために適切なセキュリティ対策を講じています。
                  パスワードは暗号化されて保存され、通信はHTTPS/TLSにより暗号化されています。
                  ただし、インターネット上での情報送信の完全な安全性を保証することはできません。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第7条（ユーザーの権利）</h2>
                <p className="leading-relaxed mb-2">
                  ユーザーは、自身の個人情報について以下の権利を有します：
                </p>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>開示請求：保存されている個人情報の開示を請求できます</li>
                  <li>訂正請求：個人情報の訂正を請求できます</li>
                  <li>削除請求：個人情報の削除を請求できます</li>
                  <li>利用停止請求：個人情報の利用停止を請求できます</li>
                </ol>
                <p className="leading-relaxed mt-3">
                  これらの請求は、アカウント設定から行うことができます。
                  アカウントを削除すると、関連する個人情報も削除されます（ただし、法令により保存が義務付けられている情報を除く）。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第8条（投稿コンテンツの公開）
                </h2>
                <p className="leading-relaxed">
                  ユーザーが投稿したコメントやいいね情報は、他のユーザーに公開されます。
                  管理者が投稿した店舗情報やメニュー情報も公開されます。
                  これらの情報は、本サービスを利用するすべてのユーザー（ゲストユーザーを含む）が閲覧できます。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第9条（個人情報の保存期間）
                </h2>
                <p className="leading-relaxed">
                  個人情報は、ユーザーがアカウントを削除するまで保存されます。
                  アカウント削除後は、法令により保存が義務付けられている場合を除き、速やかに削除されます。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第10条（未成年者の利用）
                </h2>
                <p className="leading-relaxed">
                  未成年者が本サービスを利用する場合は、保護者の同意を得た上でご利用ください。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第11条（プライバシーポリシーの変更）
                </h2>
                <p className="leading-relaxed">
                  本プライバシーポリシーは、法令の変更やサービス内容の変更に伴い、予告なく変更されることがあります。
                  変更後のプライバシーポリシーは、本サービス上に掲載した時点で効力を生じるものとします。
                </p>
              </section>
              <div className="mt-8 pt-4 border-t border-gray-600 text-xs space-y-1">
                <p>制定日：2025年11月3日</p>
                <p>最終更新日：2025年11月3日</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            className="text-sm text-[#cccccc] hover:text-white transition-colors"
            onClick={() => setIsOpen(true)}
          >
            プライバシーポリシー
          </button>
        </div>
      )}
    </div>
  );
}

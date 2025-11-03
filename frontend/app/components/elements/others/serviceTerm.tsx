"use client";

import { Close } from "@mui/icons-material";
import { useState } from "react";

// 利用規約のコンポーネント
export default function ServiceTerm() {
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
            <h1 className="text-white text-[24px] font-bold mb-6">利用規約</h1>

            <div className="text-[#cccccc] text-sm space-y-6">
              <section>
                <h2 className="text-white text-base font-semibold mb-2">第1条（適用）</h2>
                <p className="leading-relaxed">
                  本規約は、本サービス「FoodSnap」（以下「本サービス」といいます）の利用に関する条件を定めるものです。
                  ユーザーの皆様には、本規約に従って本サービスをご利用いただきます。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第2条（サービスの目的）</h2>
                <p className="leading-relaxed">
                  本サービスは、開発者の技術力向上とポートフォリオ展示を目的として運営される個人開発プロジェクトです。
                  飲食店の情報やメニューの共有を通じて、ユーザー同士の情報交換の場を提供することを目的としています。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第3条（利用料金）</h2>
                <p className="leading-relaxed">
                  本サービスは無料でご利用いただけます。将来的にも課金や商用利用を行う予定はありません。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第4条（アカウント登録）</h2>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>
                    本サービスは、アカウント登録なしでも店舗情報の閲覧・検索機能をご利用いただけます。
                  </li>
                  <li>
                    コメントの投稿やいいね機能などの一部機能を利用する場合は、アカウント登録が必要です。
                  </li>
                  <li>登録時に提供された情報は正確かつ最新のものである必要があります。</li>
                  <li>アカウント情報の管理責任はユーザー自身にあります。</li>
                  <li>
                    アカウントの不正利用が確認された場合、予告なくアカウントを停止することがあります。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第5条（禁止事項）</h2>
                <p className="leading-relaxed mb-2">ユーザーは以下の行為を行ってはなりません：</p>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>虚偽の情報を登録する行為</li>
                  <li>
                    他のユーザーまたは第三者の知的財産権、プライバシー権、その他の権利を侵害する行為
                  </li>
                  <li>誹謗中傷、差別的表現、わいせつな表現を含む投稿</li>
                  <li>本サービスの運営を妨害する行為</li>
                  <li>不正アクセスやシステムへの過度な負荷をかける行為</li>
                  <li>本サービスの信用を毀損する行為</li>
                  <li>営利目的での利用（宣伝、広告、勧誘等）</li>
                  <li>その他、運営者が不適切と判断する行為</li>
                </ol>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第6条（投稿コンテンツの取り扱い）
                </h2>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>
                    ユーザーが投稿したコンテンツ（店舗情報、メニュー、コメント、写真等）の著作権は、投稿者に帰属します。
                  </li>
                  <li>
                    ユーザーは、投稿コンテンツについて本サービス内での利用（表示、複製、配信等）を許諾するものとします。
                  </li>
                  <li>
                    投稿コンテンツに関する第三者からのクレームについては、投稿者の責任において対処するものとします。
                  </li>
                  <li>運営者は、規約違反と判断したコンテンツを予告なく削除できるものとします。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第7条（店舗情報について）
                </h2>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>
                    本サービスに掲載される店舗情報は、管理者またはユーザーにより登録されたものです。
                  </li>
                  <li>店舗情報の正確性、最新性について、運営者は保証しません。</li>
                  <li>
                    実際の営業時間、メニュー内容、価格等は変更されている可能性があるため、利用前に各店舗にご確認ください。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第8条（サービスの変更・中断・終了）
                </h2>
                <p className="leading-relaxed mb-2">
                  運営者は、以下の場合にサービスの全部または一部を変更、中断、終了することがあります。
                  これによりユーザーに損害が生じた場合でも、運営者は責任を負いません。
                </p>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>システムの保守・点検を行う場合</li>
                  <li>火災、停電、天災等の不可抗力によりサービス提供が困難な場合</li>
                  <li>サービス提供が技術的・経済的に困難になった場合</li>
                  <li>その他運営上必要と判断した場合</li>
                </ol>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第9条（免責事項）</h2>
                <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
                  <li>
                    本サービスは「現状のまま」提供されます。運営者は、サービスの正確性、完全性、有用性、安全性について保証しません。
                  </li>
                  <li>
                    本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
                  </li>
                  <li>
                    ユーザー間または第三者とのトラブルについて、運営者は一切関与せず、責任を負いません。
                  </li>
                  <li>投稿された店舗情報やメニュー情報の正確性について、運営者は保証しません。</li>
                  <li>
                    本サービスは個人開発のポートフォリオ作品であり、予告なくサービスを終了する可能性があります。
                  </li>
                  <li>
                    本サービスの利用により発生した機器の故障、データの損失等について、運営者は責任を負いません。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第10条（個人情報の取り扱い）
                </h2>
                <p className="leading-relaxed">
                  個人情報の取り扱いについては、別途定めるプライバシーポリシーに従います。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">第11条（規約の変更）</h2>
                <p className="leading-relaxed">
                  運営者は、必要に応じて本規約を変更できるものとします。
                  変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
                </p>
              </section>

              <section>
                <h2 className="text-white text-base font-semibold mb-2">
                  第12条（準拠法・管轄裁判所）
                </h2>
                <p className="leading-relaxed">
                  本規約の解釈にあたっては、日本法を準拠法とします。
                  本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄裁判所とします。
                </p>
              </section>

              <div className="mt-8 pt-4 border-t border-gray-600 text-xs space-y-1">
                <p>制定日：2025年11月3日</p>
                <p>サービス名：FoodSnap</p>
                <p>運営者：下園 拓哉</p>
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
            利用規約
          </button>
        </div>
      )}
    </div>
  );
}

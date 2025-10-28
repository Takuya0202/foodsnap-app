"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";

type props = {
  latitude: number;
  longitude: number;
};
// ユーザーに位置情報を表示するコンポーネント
export default function ShowAddress({ latitude, longitude }: props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // mapboxを初期化
  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 18,
      minZoom: 10,
      maxZoom: 30,
    });

    // 日本語に変換
    const lang = new MapboxLanguage({ defaultLanguage: "ja" });
    map.addControl(lang);

    // マーカーを表示
    const marker = new mapboxgl.Marker({
      color: "black",
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    mapRef.current = map;

    // クリーンアップ
    return () => {
      map.remove();
    };
  }, [latitude,longitude]);
  return <div ref={mapContainer} className="w-full h-full"></div>;
}

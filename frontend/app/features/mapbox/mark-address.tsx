"use client";
import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToaster } from "@/app/zustand/toaster";

type props = {
  setValue: (name: "latitude" | "longitude", value: number) => void;
  height?: string;
  width?: string;
};

export default function MarkAddress({ setValue, height = "100vh", width = "100%" }: props) {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number }>({
    lat: 35.6811673,
    lng: 139.7670516,
  });
  const marker = useRef<mapboxgl.Marker | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { open } = useToaster();

  // 現在地取得
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          const crd = pos.coords;
          setCurrentPosition({ lat: crd.latitude, lng: crd.longitude });
        },
        () => {
          open("現在地の取得に失敗しました。", "warning");
        }
      );
    }
  }, [open]);

  // Map初期化
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      center: [currentPosition.lng, currentPosition.lat],
      zoom: 18,
      minZoom: 5,
      maxZoom: 30,
      style: "mapbox://styles/mapbox/streets-v11",
    });

    // 日本語に変換
    const language = new MapboxLanguage({ defaultLanguage: "ja" });
    map.addControl(language);

    map.on("click", (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      // 既存マーカー削除
      if (marker.current) {
        marker.current.remove();
      }
      // 新規マーカー
      const createdMarker = new mapboxgl.Marker({
        color: "black",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      // マーカの位置をフォームにセット
      setValue("latitude", lat);
      setValue("longitude", lng);
      marker.current = createdMarker;
    });

    mapRef.current = map;

    // クリーンアップ
    return () => {
      map.remove();
    };
  }, [currentPosition, setValue]);

  return <div ref={mapContainer} style={{ width, height }} />;
}

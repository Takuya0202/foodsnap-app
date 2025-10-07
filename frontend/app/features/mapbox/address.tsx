'use client';
import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'mapbox-gl/dist/mapbox-gl.css';
 
export default function Address() {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
 
  useEffect(() => {
    const initializeMap = ({
      setMap,
      mapContainer,
    }: {
      setMap: any;
      mapContainer: any;
    }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: [139.7670516, 35.6811673], // 東京駅を初期値点として表示（緯度、経度を指定）
        zoom: 15,
        style: 'mapbox://styles/mapbox/streets-v12',
      });
      // 言語変更設定参考
      // defaultLanguageとしてjaを指定
      const language = new MapboxLanguage({ defaultLanguage: 'ja' });
      map.addControl(language);
 
      map.on('load', () => {
        setMap(map);
        map.resize();
      });
    };
 
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);
 
  return (
    <>
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </>
  );
}
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  YONGIN_CENTER,
} from "@/lib/sensing-data";
import type { DeviceStatus, SensingDevice } from "@/types/sensing";

type SensingMapProps = {
  devices: SensingDevice[];
  onSelectDevice: (device: SensingDevice) => void;
};

/** 상태별 지도 마커 HTML (Leaflet DivIcon) */
function markerHtml(status: DeviceStatus): string {
  const color = STATUS_COLOR[status];
  const label = STATUS_LABEL[status];

  // lucide 스타일의 간단한 SVG를 마커 안에 삽입
  const iconSvg =
    status === "normal"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
      : status === "over_threshold"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/></svg>`;

  return `
    <div title="${label}" style="
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;border-radius:9999px;
      background:${color};border:3px solid #fff;
      box-shadow:0 4px 12px rgba(15,23,42,.28);cursor:pointer;
    ">${iconSvg}</div>
  `;
}

/** 용인시를 중심으로 한 관제 지도. VWorld 타일을 우선 사용하고 실패 시 OSM으로 전환 */
export default function SensingMap({
  devices,
  onSelectDevice,
}: SensingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectDevice);

  onSelectRef.current = onSelectDevice;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) {
      return;
    }

    const map = L.map(container, {
      center: [YONGIN_CENTER.lat, YONGIN_CENTER.lng],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
    });

    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      },
    );

    const vworld = L.tileLayer(
      "https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png",
      {
        attribution: "&copy; VWorld",
        maxZoom: 19,
      },
    );

    let usingFallback = false;
    vworld.on("tileerror", () => {
      if (usingFallback) {
        return;
      }
      usingFallback = true;
      map.removeLayer(vworld);
      osm.addTo(map);
    });

    vworld.addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const group = markersRef.current;
    if (!group) {
      return;
    }

    group.clearLayers();

    devices.forEach((device) => {
      const marker = L.marker([device.lat, device.lng], {
        icon: L.divIcon({
          className: "sensing-marker",
          html: markerHtml(device.status),
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
        title: device.name,
      });

      marker.on("click", () => {
        onSelectRef.current(device);
      });

      marker.addTo(group);
    });
  }, [devices]);

  return <div ref={containerRef} className="h-full w-full" />;
}

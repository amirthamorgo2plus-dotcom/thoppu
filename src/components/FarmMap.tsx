"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const iconColors: Record<string, string> = {
  block: "green", borewell: "blue", valve: "orange", house: "violet",
};

function makeIcon(color: string) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
  });
}

const dotIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:12px;height:12px;background:#16a34a;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
  iconSize: [12, 12], iconAnchor: [6, 6],
});

function FitBounds({ markers }: { markers: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) { map.setView([markers[0].lat, markers[0].lng], 16); return; }
    map.fitBounds(L.latLngBounds(markers.map(m => [m.lat, m.lng])), { padding: [40, 40] });
  }, [markers, map]);
  return null;
}

function ClickHandler({ drawing, onAddPoint }: { drawing: boolean; onAddPoint: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (drawing) onAddPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export type MarkerData = { id: string; type: string; label: string; lat: string; lng: string; notes: string };
export type GeofenceData = { id: string; name: string; color: string; points: [number, number][] };

interface Props {
  markers: MarkerData[];
  geofences: GeofenceData[];
  drawing: boolean;
  drawPoints: [number, number][];
  onAddPoint: (lat: number, lng: number) => void;
}

export default function FarmMapLeaflet({ markers, geofences, drawing, drawPoints, onAddPoint }: Props) {
  const [satellite, setSatellite] = useState(true);

  const validMarkers = markers
    .filter(m => m.lat && m.lng && !isNaN(parseFloat(m.lat)) && !isNaN(parseFloat(m.lng)))
    .map(m => ({ ...m, lat: parseFloat(m.lat), lng: parseFloat(m.lng) }));

  const allPoints = [
    ...validMarkers.map(m => ({ lat: m.lat, lng: m.lng })),
    ...geofences.flatMap(g => g.points.map(p => ({ lat: p[0], lng: p[1] }))),
  ];

  const center: [number, number] = allPoints.length > 0
    ? [allPoints[0].lat, allPoints[0].lng]
    : [11.0168, 76.9558];

  return (
    <div className="relative">
      {/* Layer toggle */}
      <div className="absolute top-3 right-3 z-[1000] flex rounded-lg overflow-hidden shadow-md border border-gray-300">
        <button onClick={() => setSatellite(true)}
          className={`px-3 py-1.5 text-xs font-medium ${satellite ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
          Satellite
        </button>
        <button onClick={() => setSatellite(false)}
          className={`px-3 py-1.5 text-xs font-medium ${!satellite ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
          Street
        </button>
      </div>
    <MapContainer center={center} zoom={14} style={{ height: "450px", width: "100%", borderRadius: "12px" }} scrollWheelZoom={true}>
      {satellite ? (
        <>
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            attribution=""
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            opacity={0.8}
          />
        </>
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      {allPoints.length > 0 && <FitBounds markers={allPoints} />}
      <ClickHandler drawing={drawing} onAddPoint={onAddPoint} />

      {/* Saved geofences */}
      {geofences.map(g => (
        <Polygon key={g.id} positions={g.points} pathOptions={{ color: g.color, fillColor: g.color, fillOpacity: 0.15, weight: 2 }}>
          <Popup><div className="text-sm font-semibold">{g.name}</div></Popup>
        </Polygon>
      ))}

      {/* In-progress drawing polygon */}
      {drawPoints.length >= 2 && (
        <Polygon positions={drawPoints} pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.1, weight: 2, dashArray: "6" }} />
      )}
      {drawPoints.map((pt, i) => (
        <Marker key={i} position={pt} icon={dotIcon}>
          <Popup><span className="text-xs">Point {i + 1}</span></Popup>
        </Marker>
      ))}

      {/* Location markers */}
      {validMarkers.map(m => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={makeIcon(iconColors[m.type] || "red")}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{m.label}</div>
              <div className="text-gray-500 text-xs capitalize">{m.type}</div>
              {m.notes && <div className="text-gray-600 text-xs mt-1">{m.notes}</div>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
}

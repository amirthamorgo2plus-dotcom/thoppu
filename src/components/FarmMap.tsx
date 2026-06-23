"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const iconColors: Record<string, string> = {
  block: "green",
  borewell: "blue",
  valve: "orange",
  house: "violet",
};

function makeIcon(color: string) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

function FitBounds({ markers }: { markers: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15);
    } else {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);
  return null;
}

type Marker = { id: string; type: string; label: string; lat: string; lng: string; notes: string };

export default function FarmMapLeaflet({ markers }: { markers: Marker[] }) {
  const validMarkers = markers
    .filter(m => m.lat && m.lng && !isNaN(parseFloat(m.lat)) && !isNaN(parseFloat(m.lng)))
    .map(m => ({ ...m, lat: parseFloat(m.lat), lng: parseFloat(m.lng) }));

  const center: [number, number] = validMarkers.length > 0
    ? [validMarkers[0].lat, validMarkers[0].lng]
    : [11.0168, 76.9558]; // Default: Coimbatore

  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "12px" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {validMarkers.length > 0 && <FitBounds markers={validMarkers} />}
      {validMarkers.map(m => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={makeIcon(iconColors[m.type] || "red")}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{m.label}</div>
              <div className="text-gray-500 text-xs capitalize">{m.type}</div>
              {m.notes && <div className="text-gray-600 text-xs mt-1">{m.notes}</div>}
              <div className="text-gray-400 text-xs mt-1">{m.lat.toFixed(6)}, {m.lng.toFixed(6)}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

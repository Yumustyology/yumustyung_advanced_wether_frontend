import React, { useRef } from "react";
import {
  Map as LeafletMap,
  CircleMarker,
  TileLayer,
  Tooltip,
  Popup,
  Marker,
} from "react-leaflet";
import "../styles/map.css";
import data from "../data";
import "leaflet/dist/leaflet.css";

function MapPage({ center, zoom, radius, temperature, humidity, country }) {
  const initMarker = (ref) => {
    if (ref) {
      ref.leafletElement.openPopup();
    }
  };

  return (
    <div className="map">
      <div className="map_inner">
        <LeafletMap
          style={{ height: "460px" }}
          zoom={zoom}
          className="map_leaflet"
          center={center}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          return (
          <CircleMarker
            center={center}
            radius={radius}
            fillOpacity={0.5}
            stroke={true}
            ref={initMarker}
          >
            <Popup>
              <div className="popup_text">{country}</div>
              <div className="popup_text">Temperature:{temperature}%</div>
              <div className="popup_text">Humidity:{humidity}%</div>
            </Popup>
          </CircleMarker>
          );
        </LeafletMap>
      </div>
    </div>
  );
}

export default MapPage;

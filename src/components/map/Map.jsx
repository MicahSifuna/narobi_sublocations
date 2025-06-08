import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, LayersControl, TileLayer, LayerGroup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../map/map.css"
import SearchBar from '../searchplace/SearchBar';

const Map = () => {
   const [geoData, setGeoData] = useState(null);

   const mapRef = useRef();
   const position = [-1.2921, 36.8219];  // Nairobi

   useEffect(() => {
      fetch('/data/nairobi_cluster.geojson')
         .then((res) => res.json())
         .then((data) => setGeoData(data))
         .catch((err) => console.error("Failed to load GeoJSON", err));
   }, []);

   // Style for transparent polygons
   const geoStyle = {
      fillColor: '#3388ff',
      fillOpacity: 0,
      color: '#3388ff',
      weight: 3
   };

   // Add labels using SLNAME
   const onEachFeature = (feature, layer) => {
      const name = feature.properties?.layer || "Unnamed";
      layer.bindTooltip(name, {
         permanent: true,
         direction: 'center',
         className: 'geo-label'
      });
   };
   return (
      <>
         <>
            <div id="map" style={{ height: "90vh" }}>
               <h4>Nairobi Cluster(Sector Demarcation)</h4>
               <MapContainer
                  center={position}
                  zoom={11}
                  scrollWheelZoom={true}
                  ref={mapRef}
                  style={{ height: "100%", width: "100%" }}
               >
                  <LayersControl position="topright">
                     <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                           attribution='&copy; OpenStreetMap contributors'
                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                     </LayersControl.BaseLayer>

                     <LayersControl.BaseLayer name="Esri Satellite">
                        <LayerGroup>
                           <TileLayer
                              attribution='Tiles &copy; Esri &mdash; Source: Esri'
                              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                           />
                           <TileLayer
                              attribution='Labels &copy; Esri'
                              url="https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                           />
                        </LayerGroup>
                     </LayersControl.BaseLayer>
                  </LayersControl>

                  {geoData && <GeoJSON data={geoData} style={geoStyle} onEachFeature={onEachFeature} />}

                  <SearchBar />
               </MapContainer>
            </div>
         </>
      </>
   )
}

export default Map
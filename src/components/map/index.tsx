"use client";

import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { GG_MAP_KEY } from "@/utils/constant";
import Spinner from "../spinner";
import Marker from "../maker";

const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

export default function SimpleMap() {
  const [isLoading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const defaultProps = {
    zoom: 11,
  };

  useEffect(() => {
    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log(pos);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      });
    };
    getUserLocation();
  }, []);

  const handleApiLoaded = (map: any, maps: any) => {
    // use map and maps objects
    console.log("=========> map", map);
    console.log("=========> maps", maps);
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "50vh", width: "100%" }}>
      {isLoading ? (
        <Spinner />
      ) : (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: GG_MAP_KEY,
            language: "vi",
            region: "vi",
            libraries: ["places"],
          }}
          defaultCenter={userLocation}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          <AnyReactComponent
            lat={userLocation.lat}
            lng={userLocation.lng}
            text="My Position"
          />
        </GoogleMapReact>
      )}
    </div>
  );
}

"use client";

import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { CustomMapControl } from "../auto-complete/map-control";
import MapHandler from "../auto-complete/map-handler";

export default function MapDemo() {
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<any>();
  const [defaultZoom, setDefaultZoom] = useState(18);

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeData = useCallback(
    debounce((data: any) => {
      setPosition(data);
      fetchLocation(data);
    }, 500),
    []
  );

  useEffect(() => {
    if (loading) {
      ((async) => {
        navigator.geolocation.getCurrentPosition((res: any) => {
          console.log("==============> chay get current loction:", res);
          const dataPostion = {
            lat: res.coords.latitude,
            lng: res.coords.longitude,
          };
          setPosition(dataPostion);
          fetchLocation(dataPostion);
          setLoading(false);
        });
      })();
    }
  }, [loading]);

  const fetchLocation = (data: any) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.lat}&lon=${data.lng}`;
    fetch(url)
      .then((res) => res.json())
      .then((data: any) => {
        setAddress(data.address);
      });
  };

  if (loading)
    return (
      <div className="flex flex-row items-center justify-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  return (
    <div>
      <div style={{ height: "45vh", width: "100%" }}>
        <APIProvider apiKey={"AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"}>
          <Map
            defaultCenter={position}
            defaultZoom={defaultZoom}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            onZoomChanged={(e) => setDefaultZoom(e.detail.zoom)}
            mapId={"test AdvancedMarker "}
          >
            <AdvancedMarker
              position={position}
              draggable
              onDrag={(e) =>
                debounceChangeData({
                  lat: e.latLng?.lat() ?? 0,
                  lng: e.latLng?.lng() ?? 0,
                })
              }
            />
            <CustomMapControl
              controlPosition={ControlPosition.TOP}
              onPlaceSelect={setSelectedPlace}
            />

            <MapHandler
              place={selectedPlace}
              setPosition={debounceChangeData}
            />
          </Map>
        </APIProvider>
      </div>
      {address && (
        <div
          className="bg-black text-white flex flex-col space-y-3 text-sm text-center"
          style={{ height: 50 }}
        >
          <div>
            from {address.house_number} {address.road}
          </div>
          <div>
            Q. {address?.city_district ?? address?.suburb}, TP. {address.city},{" "}
            {address.country}
          </div>
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import React from "react";

const Marker = ({}: any) => (
  <div className="marker">
    <Image alt="marker" src="/marker.png" height={32} width={32} />
  </div>
);
export default Marker;

import React from "react";
import ContentLoader from "react-content-loader";

const Skeleton = () => {
  return (
    <>
      <ContentLoader
        className="pizza-block"
        speed={2}
        width={280}
        height={466}
        viewBox="0 0 280 466"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="260" rx="3" ry="3" width="0" height="6" />
        <rect x="508" y="496" rx="10" ry="10" width="150" height="91" />
        <rect x="484" y="542" rx="3" ry="3" width="150" height="15" />
        <circle cx="140" cy="131" r="125" />
        <rect x="0" y="280" rx="3" ry="3" width="280" height="30" />
        <rect x="0" y="330" rx="6" ry="6" width="280" height="66" />
        <rect x="128" y="421" rx="20" ry="20" width="152" height="45" />
        <rect x="0" y="429" rx="6" ry="6" width="90" height="30" />
      </ContentLoader>
    </>
  );
};

export default Skeleton;

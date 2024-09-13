import { Skeleton } from "primereact/skeleton";

const CardSkeleton = () => {
  return (
    <div className="p-d-flex p-ai-center p-m-4">
      <div className="p-d-flex p-flex-column p-ai-center p-mr-4">
        <Skeleton shape="circle" size="4rem" className="p-mb-2" />
        <Skeleton width="10rem" height="1rem" />
      </div>
      <div className="p-flex-1">
        <Skeleton width="40%" className="p-mb-2" />
        <Skeleton width="90%" className="p-mb-2" />
        <Skeleton width="20%" className="p-mb-2" />
        <div className="p-d-flex p-ai-center">
          <Skeleton width="2rem" className="p-mr-2" />
          <Skeleton width="2rem" className="p-mr-2" />
          <Skeleton width="50%" className="p-mr-2" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;

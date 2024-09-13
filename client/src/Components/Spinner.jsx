import { ProgressSpinner } from "primereact/progressspinner";

const Spinner = () => {
  return (
    <div className="card w-[100vw] h-[100vh] flex justify-start items-center">
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    </div>
  );
};

export default Spinner;

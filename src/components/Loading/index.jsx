import PacmanLoader from "react-spinners/PacmanLoader";
const Loading = () => {
    const style = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    };

    return (
        <div style={style}>
            <PacmanLoader color="#4fc5ff" size={25} speedMultiplier={2} />
            <br />
            Loading . . . .
        </div>
    );
};

export default Loading;

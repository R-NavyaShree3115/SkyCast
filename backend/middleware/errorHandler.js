
const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    let status = 500;
    let message = "Something went wrong";

    if (error.response) {
        status = 502;
        message = "Weather API is unavailable";
    } else if (error.name === "CastError") {
        status = 400;
        message = "Invalid search ID";
    } else if (error.message === "Location not found") {
        status = 404;
        message = error.message;
    } else {
        message = error.message;
    }

    res.status(status).json({ message });
};

export default errorHandler;
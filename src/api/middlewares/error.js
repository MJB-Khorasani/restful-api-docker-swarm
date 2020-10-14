const pageNotFound = (req, res, next) => { 
    res.status(404).json({ 
        "errorTitle": 'Page Not Found',
        "errorMessages": [ "404, page not found" ]
    });
};

const errorOccurred = (error, req, res, next) => { 
    console.error(error);
    const { statusCode: status, message, messages } = error;

    if (status) {
        res.status(status).json({ 
            "errorTitle": message || 'An server error occured',
            "errorMessages": messages || [ 'An internall server error occured' ]
        });
    } else {
        res.status(500).json({ 
            "errorTitle": 'An internall server error occured',
            "errorMessages": messages || [ "An internall server error occured" ]
        });
    };
};

process.on('unhandledRejection', error => {
    console.error(error);
    process.exit(1);
});

module.exports = {
    pageNotFound,
    errorOccurred
};
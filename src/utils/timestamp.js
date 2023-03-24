exports.timestamp = () => {
    // making time

    // fetching date module
    let date_ob = new Date();
    // generating current date
    let date = ("0" + date_ob.getDate()).slice(-2); // adjust 0 before single digit date
    // generating current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2); // adjust 0 before single digit month
    // generating current year
    let year = date_ob.getFullYear();
    // generating current hours
    let hours = date_ob.getHours();
    // generating current minutes
    let minutes = date_ob.getMinutes();
    // generating current seconds
    let seconds = date_ob.getSeconds();

    // output
    let date_time = `${date}/${month}/${year} - ${hours}:${minutes}:${seconds}`;

    return date_time;
};

exports.currentDate = () => {
    // making time

    // fetching date module
    let date_ob = new Date();
    // generating current date
    let date = ("0" + date_ob.getDate()).slice(-2); // adjust 0 before single digit date
    // generating current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2); // adjust 0 before single digit month
    // generating current year
    let year = date_ob.getFullYear();
    // // generating current hours
    // let hours = date_ob.getHours();
    // // generating current minutes
    // let minutes = date_ob.getMinutes();
    // // generating current seconds
    // let seconds = date_ob.getSeconds();

    // output
    let today = `${date}-${month}-${year}`;

    return today;
};
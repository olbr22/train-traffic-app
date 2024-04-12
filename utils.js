
const apiKey = "5e2112b3272eba0cb69518d5b14e1f73";
const baseURL = "https://auth.emilfolino.se";

function calculateDelay(startTime, endTime) {
    // Parse the time strings into Date objects
    const startDate = new Date(`2000-01-01T${startTime}`);
    const endDate = new Date(`2000-01-01T${endTime}`);

    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;

    // Convert milliseconds to minutes
    const totalMinutes = Math.floor(timeDifference / (1000 * 60));

    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours, minutes };
}

function removeDuplicatesByTrainNo(arrayOfObjects) {
    // Create a temporary object to store unique TrainNo values
    const uniqueTrainNos = {};

    // Use the filter() method to iterate over each object in the array
    return arrayOfObjects.filter(obj => {
        // Extract the TrainNo value from the current object
        const trainNo = obj.TrainNo;

        // Check if the TrainNo value already exists in the temporary object
        // If it doesn't, add the TrainNo to the object
        // and return true (to keep the object in the filtered array)
        if (!uniqueTrainNos[trainNo]) {
            uniqueTrainNos[trainNo] = true;
            return true;
        }

        // If the TrainNo value already exists,
        // return false (to remove the duplicate object from the filtered array)
        return false;
    });
}

export { apiKey, baseURL, calculateDelay, removeDuplicatesByTrainNo };

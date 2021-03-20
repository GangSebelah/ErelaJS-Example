module.exports = {
    convertTime: function (duration) {

        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);
   
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
   
        if (duration < 3600000) {
          return minutes + ":" + seconds ;
        } else {
          return hours + ":" + minutes + ":" + seconds ;
        }
    },
    convertNumber: function (number, decPlaces) {
        // 2 decimal places => 100, 3 => 1000, etc
        decPlaces = Math.pow(10,decPlaces);

        // Enumerate number abbreviations
        var abbrev = [ "K", "M", "B", "T" ];

        // Go through the array backwards, so we do the largest first
        for (var i=abbrev.length-1; i>=0; i--) {

            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10,(i+1)*3);

            // If the number is bigger or equal do the abbreviation
            if(size <= number) {
                // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                // This gives us nice rounding to a particular decimal place.
                number = Math.round(number*decPlaces/size)/decPlaces;

                // Handle special case where we round up to the next abbreviation
                if((number == 1000) && (i < abbrev.length - 1)) {
                    number = 1;
                    i++;
                }

                // Add the letter for the abbreviation
                number += abbrev[i];

                // We are done... stop
                break;
            }
        }

        return number;
    },
    convertHmsToMs: function (hms) {
        if (hms.length < 3) {
            return hms = ((+a[0]) * 1000)
        } else if (hms.length < 6) {
            const a = hms.split(':')
            return hms = (((+a[0]) * 60 + (+a[1])) * 1000)
        } else {
            const a = hms.split(':')
            return hms = (((+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])) * 1000)
        }
    }
}


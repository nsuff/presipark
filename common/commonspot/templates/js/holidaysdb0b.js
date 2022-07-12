// DJM 12/11/2019: This has been setup to holidays in the operating schedule
// and returns dates in the same format as start_date and end_date MMMM dd
// modified from https://stackoverflow.com/questions/32342753/calculate-holidays-in-javascript
// Depends on date.js https://github.com/datejs/Datejs

var holidays = { // keys are formatted as month,week,day
    "0,3,1": "Birthday of Martin Luther King, Jr.",      //3rd Mon in Jan
    "1,3,1": "Washingtons Birthday",            //3rd Mon in Feb
    "2,2,0": "Daylight Savings Time Begins",     //2nd Sun in Mar
    "3,3,3": "Administrative Professionals Day", //3rd Wed in Apr
    "4,2,0": "Mother's Day",                     //2nd Sun in May (in the US, but not all countries)
    "4,5,1": "Memorial Day",                     //Last Mon in May
    "5,3,0": "Father's Day",                     //3rd Sun in Jun (in the US, but not all countries)
    "6,4,0": "Parents Day",                      //4th Sun of Jul
    "8,1,1": "Labor Day",                        //1st Mon in Sept
    "8,5,0": "Gold Star Mothers Day",            //Last Sun in Sep
    "9,2,1": "Columbus Day",                     //2nd Mon in Oct
    "10,1,0": "Daylight Savings Time Ends",      //1st Sun in Nov
	"10,4,4": "Thanksgiving"                 
};

function getHolidayDate(year, month, week, day) {
  
  var date = new Date(year, month, 1);
  var today = new Date().clearTime();

  var add = (day - date.getDay() + 7) % 7 + (week - 1) * 7;

  // make sure that we stay in the same month
  do {
    date.setMonth(month);
    date.setDate(1 + add);
    add -= 7;
  } while (date.getMonth() != month);

  return date;
}

function getHoliday(month, week, day) {
    return holidays[month + "," + week + "," + day];
}

function getDateString(year, month, week, day) {
    var date = getHolidayDate(year, month, week, day);
    var holiday = getHoliday(month, week, day);
    var dateString = date.toLocaleDateString();
    if (holiday) {
        dateString += " \xa0\xa0\xa0" + holiday;
    }
    return dateString;
}

function getKeyByValue( object, value ) {
	return Object.keys( object ).find( key => object[key] === value );
}
					
function getDateForHoliday( holiday_name ) {
	//console.log( holiday_name );
	var today = new Date().clearTime();
	
	var currentYear = today.getFullYear();
	
	if ( holiday_name == 'New Years Day' || holiday_name == 'New Year’s Day' ) {
		
		return 'January 1';
		
	}
    else if ( holiday_name == 'Juneteenth' || holiday_name == 'Juneteenth National Independence Day' ) {
		
		return 'June 19'; 
		
	}
	else if ( holiday_name == 'Independence Day' ) {
		
		return 'July 4'; 
		
	}
	else if ( holiday_name == 'Veterans Day' ) {
		
		return 'November 11';
		
	}
	else if ( holiday_name == 'Christmas Day' ) {
		
		return 'December 25';
		
	}
	else if ( holiday_name == 'Washingtons Birthday' || holiday_name == 'Washington’s Birthday' || holiday_name == 'Memorial Day' || holiday_name == 'Labor Day' || holiday_name == 'Columbus Day' || holiday_name == 'Thanksgiving Day' || holiday_name == 'Thanksgiving' || holiday_name == 'Martin Luther King Jr. Day' ||
	holiday_name == 'Birthday of Martin Luther King, Jr.' ) {
		
		if ( holiday_name == 'Washington’s Birthday' ) {
			holiday_name = 'Washingtons Birthday';	
		}
		
		if ( holiday_name == 'Thanksgiving Day' ) { 
		
			holiday_name = 'Thanksgiving';
			
		}
		else if ( holiday_name == 'Martin Luther King Jr. Day' ) { 
			
			holiday_name = 'Birthday of Martin Luther King, Jr.';
			
		}
		
		var holiday_val = getKeyByValue( holidays, holiday_name ).split( ',' );
		
		var currentHoliday = getHolidayDate( currentYear, holiday_val[0], holiday_val[1], holiday_val[2] );
		
		var returnHolidayDate = getHolidayDate( currentYear, holiday_val[0], holiday_val[1], holiday_val[2] ).toString( 'MMMM dd' );
		
		if ( currentHoliday < today ) {
			
			returnHolidayDate = getHolidayDate( currentYear + 1, holiday_val[0], holiday_val[1], holiday_val[2] ).toString( 'MMMM dd' );
			
		}
		
		return returnHolidayDate;
		
	}
	else {
		
		return ''; 
		
	}
	
}

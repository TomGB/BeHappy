BeHappy is a Happy Me clone with added functionality

The app has been created using Phonegap and Cordova.

To create an APK use "phonegap build" command.
The APK can be found in /platforms/android/output

------ Functions ------

update_file(current_data)
  updates the data_array with the data from the current_date
  Then writes all the data within the data_array to the file using ExternalStorageSdcardAccess.scanPath();

format_date(date)
  good short simple function formats data like: 21/03/2016

read_write_file()
  uses global flag: new_data_to_be_written_to_file
  either reads the data from the file on app launch or writes data to the file on save.

process_data_array()
  extracts any data on the currently selected date
  updates the DOM with that information

load_date()
  loads the selected date from the data_array
  then updates the DOM with that information

go_back()
  method when back button is pressed to go from item selection to day view

MISC
  Changing pages, setting pages to displayed and hidden,
  updating bits of the DOM such as currently selected date
  adding a newly created or loaded date to the date selection screen
    * currently not done

------ Listeners ------

All the buttons on the different pages,

the back button between the selecting of the items such as food, this then updates the data object in the DOM and writes the changes to the file.

Adding a new date or selecting one that already exists.

------ Objects -------

data_array:
  array of objects for each of the days
  also contains the config_object
  * The config_object should be separated from the data_array

current_data:
  stores all the info about the currently selected date

// no long used: selected_date:
  The date that is currently being shown in the home_page

config_object:
  Contains the defaults for each of the categories such as diet, people, work, activities

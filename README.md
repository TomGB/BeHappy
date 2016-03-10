BeHappy is a Happy Me clone with added functionality

The app has been created using Phonegap and Cordova.

------ Functions ------

update_file(current_data)
  updates the data_array with the data from the current_date
  Then writes all the data within the data_array to the file using ExternalStorageSdcardAccess.scanPath();

format_date(date)
  good short simple function formats data like: 21/03/2016

ExternalStorageSdcardAccess and gotFiles()
  Bloated methods as too much goes on in gotFiles,
  reading and writing to the external file, used on app load and on data update
  * currently difficult to understand

process_data_array()
  extracts any data on the currently selected date
  updates the DOM with that information

load_date()
  loads the selected date from the data_array
  then updates the DOM with that information

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

selected_date:
  The date that is currently being shown in the home_page

config_object:
  Contains the defaults for each of the catagories such as diet, people, work, activities

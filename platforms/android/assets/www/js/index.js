/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		// $(app.receivedEvent('jqueryready'));
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {

		function format_date(input_date){
			var temp_date;
			if(input_date == null){
				temp_date = new Date();
			}else{
				temp_date = new Date(input_date);
			}
			var dd = temp_date.getDate();
			var mm = temp_date.getMonth()+1; //January is 0!
			var yyyy = temp_date.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			}

			if(mm<10) {
			    mm='0'+mm
			}

			return dd+'/'+mm+'/'+yyyy;
		}

		var selected_date = format_date();

		$(".selected_date").text(selected_date);

		var new_data_to_be_written_to_file = false;

		var current_data = {
		 date: selected_date
		};

		var data_array = [];

		var config_object = {
			name: "config_object",
			diet: ["vegetables", "joylent", "chocolate","Cereal","Toast", "alcohol"],
			people: ["Dad","Best Friend","Boss"],
			activities: ["Sports","Walking","Browsing the Internet","Watching a Movie"],
			work: ["Made progress","Impressed Boss","Helped College","Finished Project"]
		};

		var storage_path = cordova.file.externalRootDirectory;

		alert("the data directory: "+storage_path);


		var current_page = "home_page";

		document.addEventListener("backbutton", function(e){
			e.preventDefault();
			if(current_page!="home_page"){
				go_back();
			}
		}, false);

		var ExternalStorageSdcardAccess = function ( fileHandler, errorHandler ) {
			var root = "file:///";

			return {
			    scanRoot:scanRoot,
			    scanPath:scanPath
			};

			function scanPath( path ) {
			    window.resolveLocalFileSystemURL(path, gotFiles, errorHandler );
			}

			function scanRoot() {
			    scanPath( root );
			}

			function gotFiles(entry) {
		    // ? Check whether the entry is a file or a directory
		    if (entry.isFile) {
					alert("file name: "+entry.name);
		        // * Handle file
		        // fileHandler( entry );
		    }else {

					var dirReader = entry.createReader();
	        dirReader.readEntries( function(entryList) {
						if(
							entryList.find(
								function(file) {
									return file.name === 'behappy_log.txt';
								}
							)
						){
							// alert("already exists");

							if(new_data_to_be_written_to_file){

								entry.getFile('behappy_log.txt', {create: false}, function(fileEntry) {

							    // Create a FileWriter object for our FileEntry (log.txt).
							    fileEntry.createWriter(function(fileWriter) {

							      fileWriter.onwriteend = function(e) {
							        console.log('Write completed.');
							      };

							      fileWriter.onerror = function(e) {
							        console.log('Write failed: ' + e.toString());
							      };

							      // Create a new Blob and write it to log.txt.
							      var blob = new Blob([JSON.stringify(data_array)], {type: 'text/plain'});

							      fileWriter.write(blob);

										new_data_to_be_written_to_file = false;

							    }, errorHandler);

							  }, errorHandler);

							}else{
								entry.getFile('behappy_log.txt', {}, function(fileEntry) {
									fileEntry.file(function(file) {
							       var reader = new FileReader();

							       reader.onloadend = function(e) {
							        //  alert(this.result);
											 fileHandler(this.result);
							       };

							       reader.readAsText(file);
							    }, errorHandler);
						    }, errorHandler);
							}
						}else{
							// alert("doesn't exist, create blank file");

							entry.getFile("behappy_log.txt", {create: true, exclusive: true}, function(fileEntry) {

								// alert("file entry: "+JSON.stringify(fileEntry));

								fileEntry.createWriter(function(fileWriter) {

									fileWriter.onwriteend = function(e) {
										alert('Write completed.');
									};

									fileWriter.onerror = function(e) {
										alert('Write failed: ' + e.toString());
									};

									// Create a new Blob and write it to log.txt.

									var blob = new Blob([new_data_to_be_written_to_file?JSON.stringify(data_array):""], {type: 'text/plain'});

									fileWriter.write(blob);

									new_data_to_be_written_to_file = false;

									fileHandler("empty");

								}, errorHandler);
							}, errorHandler);
						}
	        }, errorHandler );
		    }
			}
		};



		function errorHandler(e) {
		  var msg = '';

		  switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		      msg = 'QUOTA_EXCEEDED_ERR';
		      break;
		    case FileError.NOT_FOUND_ERR:
		      msg = 'NOT_FOUND_ERR';
		      break;
		    case FileError.SECURITY_ERR:
		      msg = 'SECURITY_ERR';
		      break;
		    case FileError.INVALID_MODIFICATION_ERR:
		      msg = 'INVALID_MODIFICATION_ERR';
		      break;
		    case FileError.INVALID_STATE_ERR:
		      msg = 'INVALID_STATE_ERR';
		      break;
		    case FileError.PATH_EXISTS_ERR:
		      msg = 'PATH_EXISTS_ERR (file may already exist)';
		      break;
		    case FileError.ENCODING_ERR:
		      msg = 'ENCODING_ERR (error 5, problem with url maybe?)';
		      break;
		    default:
		      msg = JSON.stringify(e);
		      break;
		  };

		  alert('Error: ' + msg);
		}

		function load_current_file(){
			new ExternalStorageSdcardAccess( fileHandler, errorHandler ).scanPath( storage_path );
			function fileHandler( fileEntry ) {
				data_array = JSON.parse(fileEntry);

				process_data_array();

				alert("data loaded from file");
			}
		}

		load_current_file();

		function process_data_array() {
			var index = findWithAttr(data_array, "date", current_data.date);

			if(index != undefined){
				if(data_array[index].hasOwnProperty("score")){
					$(".rate_output").text(data_array[index].score);
					$("input.rating").val(data_array[index].score);
					current_data.score = data_array[index].score;
				}
				if(data_array[index].hasOwnProperty("text")){
					$(".happy_text").val(data_array[index].text);
					current_data.text = data_array[index].text;
				}

				var section_names = [];
				$(".open_page").each(function(){
					section_names.push(this.id);
				});

				// alert(section_names);

				$(section_names).each(function() {
					// alert(this);
					if(data_array[index].hasOwnProperty(this)){


						$("#"+this+" .info").text("");
						$("#"+this+" .info").append(data_array[index][this].join(", "));
						$("#"+this).data("selected",data_array[index][this]);
						current_data[this] = data_array[index][this];
					}
				});
			}

			index = findWithAttr(data_array, "name", "config_object");

			if(index != undefined){

				var section_names = [];
				$(".open_page").each(function(){
					section_names.push(this.id);
				});

				$(section_names).each(function() {
					// alert(this);
					if(data_array[index].hasOwnProperty(this)){

						$("#"+this).data("options",data_array[index][this]);
						config_object[this] = data_array[index][this];
					}
				});
			}

			$(data_array).each(function() {
				if (this.hasOwnProperty('date')) {
				  $(".day_list").append('<div class="day"><h1>'+this.date+'</h1><h2>'+this.score+'</h2></div>');
				}
			});
		}

		function findWithAttr(array, attr, value) {
			for(var i = 0; i < array.length; i += 1) {
				if(array[i][attr] === value) {
					return i;
				}
			}
		}

		function update_file(data_to_update){

			// alert("call to update_file");

			new_data_to_be_written_to_file = true;

			var index = findWithAttr(data_array,"date",data_to_update.date);

			if(index != undefined){
				data_array[index] = data_to_update;
			}else{
				data_array.push(data_to_update);
			}

			index = findWithAttr(data_array,"name","config_object");

			if(index != undefined){
				data_array[index] = config_object;
			}else{
				data_array.push(config_object);
			}

			new ExternalStorageSdcardAccess( fileHandler, errorHandler ).scanPath( storage_path );
			function fileHandler( fileEntry ) {
				data_array = JSON.parse(fileEntry);
				alert("data loaded from file");
			}
		}

		$(".add_new_date").click(function() {
			$(".date_picker").click();
		});

		$(".date_picker").change(function() {
			load_date(format_date($(this).val()));
		});

		function load_date(input_date) {

			selected_date = input_date;

			$(".selected_date").text(selected_date);

			var index = findWithAttr(data_array, "date", selected_date);

			current_data = {};
			current_data.date = selected_date;

			if(index != undefined){
				if(data_array[index].hasOwnProperty("score")){
					$(".rate_output").text(data_array[index].score);
					$("input.rating").val(data_array[index].score);
					current_data.score = data_array[index].score;
				}
				if(data_array[index].hasOwnProperty("text")){
					$(".happy_text").val(data_array[index].text);
					current_data.text = data_array[index].text;
				}

				var section_names = [];
				$(".open_page").each(function(){
					section_names.push(this.id);
				});

				// alert(section_names);

				$(section_names).each(function() {
					// alert(this);
					if(data_array[index].hasOwnProperty(this)){


						$("#"+this+" .info").text("");
						$("#"+this+" .info").append(data_array[index][this].join(", "));
						$("#"+this).data("selected",data_array[index][this]);
						current_data[this] = data_array[index][this];
					}
				});
			}else{

				// alert("day not found");

				$(".day_list").append('<div class="day"><h1>'+current_data.date+'</h1><h2 class="day_score"></h2></div>');

				$(".rate_output").text(50);
				$("input.rating").val(50);
				current_data.score = 50;

				// alert("score set");

				$(".happy_text").val("");
				current_data.text = "";

				// alert("text set");

				$(".open_page").each(function() {
					$(this).data("selected","");
					$(this).find(".info").text("");
				});

				// alert("rest set");
			}
			//
			$(".page").addClass("hidden");
			$(".home_page").removeClass("hidden");

			// alert("home page should be showing");
		};

		$(".happy_text").on("change", function(){
			current_data.text = $(this).val();
			update_file(current_data);
		});

		$("input.rating").on( "touchmove mousemove change", function(){
			$(".rate_output").text($("input.rating").val());
			current_data.score = $("input.rating").val();
		});

		$("input.rating").on("change", function() {
			update_file(current_data);
		});

		$(".js_history").click(function() {
			$(".page").addClass("hidden");
			$(".date_page").removeClass("hidden");
		});

		$(".date_page").on("click",".day",function() {
			load_date($(this).find("h1").text());
		});


		$(".add_image").on("click",function(){
			alert("upload image");
		});

		$(".open_page").on("click",function(){
			current_page = $(this).attr("id");
			$(".page").addClass("hidden");
			$(".select_page").removeClass("hidden");
			$(".today_text").text($(this).data("todaytext"));

			$(".select_page_title").text($(this).find(".title").text());

			$(".options_area").text("");

			var options = $(this).data("options");

			for (var i = 0; i < options.length; i++) {
				$("<div class='item'><p class='name'>"+options[i]+"</p></div>").appendTo(".options_area");
			}

			$(".selected_area").text("");

			var selected = $(this).data("selected");

			for (var i = 0; i < selected.length; i++) {
				$("<div class='item'><p class='name'>"+selected[i]+"</p></div>").appendTo(".selected_area");
			}

		});




		$(".options_area").on("click", ".item", function () {
			$(this).clone().appendTo(".selected_area");
		});


		$(".selected_area").on("click", ".item", function () {
			$(this).remove();
		});

		var pressTimer;

		var current_item;

		$(".options_area").on("mouseup", ".item", function(){
			clearTimeout(pressTimer)
			// Clear timeout
			return false;
		}).on("mousedown", ".item", function(){
			current_item = $(this);
			// Set timeout
			pressTimer = window.setTimeout(function() {
				if (confirm('Would you like to remove '+$(current_item).find(".name").text())+"?") {
					$(current_item).remove();
				} else {
					//
				}
			},200)
			return false;
		});


		$(".add_new_item").on("change", function () {
			if($(this).val()!=""){
				$("<div class='item'><p class='name'>"+$(this).val()+"</p></div>").appendTo(".selected_area");
				$("<div class='item'><p class='name'>"+$(this).val()+"</p></div>").appendTo(".options_area");
				$(this).val("");
			}
		});

		$(".back_icon").on("click",go_back);

		function get_selected_list() {

			var output = [];

			var selected_items = $(".selected_area .item");

			for (var i = 0; i < selected_items.length; i++) {
				// alert($(selected_items[i]).find(".name").text());
				output.push($(selected_items[i]).find(".name").text());
			}
			return output;
		}

		function get_options_list() {

			var output = [];

			var option_items = $(".options_area .item");

			for (var i = 0; i < option_items.length; i++) {
				// alert($(option_items[i]).find(".name").text());
				output.push($(option_items[i]).find(".name").text());
			}

			return output;
		}

		function go_back(){
			$(".page").addClass("hidden");
			$(".home_page").removeClass("hidden");
			$("#"+current_page+" .info").text("");
			$("#"+current_page+" .info").append(get_selected_list().join(", "));
			$("#"+current_page).data("selected",get_selected_list());
			$("#"+current_page).data("options",get_options_list());
			current_data[current_page] = get_selected_list();
			config_object[current_page] = get_options_list();
			update_file(current_data);
		}

	}
};

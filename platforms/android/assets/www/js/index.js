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

		var new_data_to_be_written_to_file = false;

		var current_data = {};
		current_data.date = format_date();

		$(".selected_date").text(current_data.date);

		var data_array = [];

		var config_object = {
			name: "config_object",
			diet: ["vegetables", "joylent", "chocolate","Cereal","Toast", "alcohol"],
			people: ["Dad","Best Friend","Boss"],
			activities: ["Sports","Walking","Browsing the Internet","Watching a Movie"],
			work: ["Made progress","Impressed Boss","Helped College","Finished Project"]
		};

		var storage_path = cordova.file.externalRootDirectory;

		$(".save_location").text(storage_path);

		var current_page = "home_page";

		read_write_file( storage_path );

		function read_write_file( path ) {
		    window.resolveLocalFileSystemURL(path, gotFiles, file_error_handling );
		}

		function gotFiles(entry) {
	    if (entry.isDirectory){
				var dirReader = entry.createReader();
        dirReader.readEntries( function(entryList) {

					var file_exists = entryList.find(function(file) {
						return file.name === 'behappy_log.txt';
					})?true:false;

					entry.getFile('behappy_log.txt', {create: !file_exists}, function(fileEntry) {

						if(new_data_to_be_written_to_file){
							write_to_file(fileEntry);
						}else{ // no new data to be written to file, therefore READ the data
							read_from_file(fileEntry);
						}

						// end of file opperations
					}, file_error_handling);
        }, file_error_handling );
	    }
		}

		function write_to_file(input_file) {
			input_file.createWriter(function(fileWriter) {

				fileWriter.onwriteend = function(e) {
					console.log('Write completed.');
				};

				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString());
				};

				var blob = new Blob([JSON.stringify(data_array)], {type: 'text/plain'});
				fileWriter.write(blob);

				new_data_to_be_written_to_file = false;
			}, file_error_handling);
		}

		function read_from_file(input_file) {
			input_file.file(function(file) {
				var reader = new FileReader();

				reader.onloadend = function(e) {
					process_data_array(JSON.parse(this.result));
				};
				reader.readAsText(file);
			}, file_error_handling);
		}

		function file_error_handling(e) {
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

		function set_score(input_score) {
			$(".rate_output").text(input_score);
			$("input.rating").val(input_score);
			current_data.score = input_score;
			$(".day_list .day[data-date='"+current_data.date+"']").find(".day_score").text(input_score);
		}

		function set_happy_text(input_text) {
			$(".happy_text").val(input_text);
			current_data.text = input_text;
		}

		function set_section_data(input_data) {
			var section_names = [];
			$(".open_page").each(function(){
				section_names.push(this.id);
			});

			$(section_names).each(function() {
				if(input_data.hasOwnProperty(this)){
					$("#"+this+" .info").text("");
					$("#"+this+" .info").append(input_data[this].join(", "));
					$("#"+this).data("selected",input_data[this]);
					current_data[this] = input_data[this];
				}
			});
		}

		function process_data_array(input_data) {
			data_array = input_data;

			var index = findWithAttr(data_array, "date", current_data.date);

			if(index != undefined){
				if(data_array[index].hasOwnProperty("score")){
					set_score(data_array[index].score);
				}
				if(data_array[index].hasOwnProperty("text")){
					set_happy_text(data_array[index].text);
				}
				set_section_data(data_array[index]);
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

			read_write_file( storage_path );
		}

		function load_date(input_date) {

			current_data = {};
			current_data.date = input_date;

			$(".selected_date").text(current_data.date);

			set_score(50);
			set_happy_text("");

			$(".open_page").each(function() {
				$(this).data("selected","");
				$(this).find(".info").text("");
			});

			var index = findWithAttr(data_array, "date", current_data.date);

			if(index != undefined){
				if(data_array[index].hasOwnProperty("score")){
					set_score(data_array[index].score);
				}
				if(data_array[index].hasOwnProperty("text")){
					set_happy_text(data_array[index].text);
				}
				set_section_data(data_array[index]);

			}else{
				data_array.push(current_data);
			}
			//
			$(".page").addClass("hidden");
			$(".home_page").removeClass("hidden");

			// alert("home page should be showing");
		};

		function clear_and_fill_item_area(selector, data_name, data_area) {
			$(selector).text("");

			var items = data_area.data(data_name);

			for (var i = 0; i < items.length; i++) {
				$("<div class='item'><p class='name'>"+items[i]+"</p></div>").appendTo($(selector));
			}
		}

		function get_item_list(item_selector) {
			var item_list = $(item_selector);
			var output = [];
			for (var i = 0; i < item_list.length; i++) {
				output.push($(item_list[i]).find(".name").text());
			}
			// alert("output "+JSON.stringify(output));
			return output;
		}

		function go_back_from_item_page(){
			$("#"+current_page+" .info").text("");
			$("#"+current_page+" .info").append(get_item_list(".selected_area .item").join(", "));
			$("#"+current_page).data("selected",get_item_list(".selected_area .item"));
			$("#"+current_page).data("options",get_item_list(".options_area .item"));
			current_data[current_page] = get_item_list(".selected_area .item");
			config_object[current_page] = get_item_list(".options_area .item");
			update_file(current_data);
			go_to_home_page();
		}

		function go_to_history_page() {

			$(".day_list").text("");

			var index = findWithAttr(data_array,"date",current_data.date);

			if(index != undefined){
				data_array[index] = current_data;
			}else{
				data_array.push(current_data);
			}

			$(data_array).each(function() {
				if (this.hasOwnProperty('date')) {
					var score = "50";
					if (this.hasOwnProperty('score')) {
						score = this.score;
					}
				  $(".day_list").append('<div class="day" data-date="'+this.date+'"><h2 class="day_score">'+score+'</h2><h1>'+this.date+'</h1></div>');
				}
			});

			$(".page").addClass("hidden");
			$(".date_page").removeClass("hidden");
			current_page = "date_page";
		}

		function go_to_home_page() {
			current_page = "home_page";
			$(".page").addClass("hidden");
			$(".home_page").removeClass("hidden");
		}

		document.addEventListener("backbutton", function(e){
			e.preventDefault();
			if(current_page!="home_page"&&current_page!="date_page"){
				go_back_from_item_page();
			}else if(current_page=="home_page"){
				go_to_history_page();
			}else if(current_page=="date_page"){
				go_to_home_page();
			}
		}, false);

		$(".add_new_date").click(function() {
			$(".date_picker").val("");
			$(".date_picker").click();
		});

		$(".date_picker").change(function() {
			load_date(format_date($(this).val()));
		});

		$(".happy_text").on("change", function(){
			current_data.text = $(this).val();
			update_file(current_data);
		});

		$("input.rating").on( "touchmove mousemove change", function(){
			$(".rate_output").text($("input.rating").val());
			$(".day_list .day[data-date='"+current_data.date+"']").find(".day_score").text($("input.rating").val());
			current_data.score = $("input.rating").val();
		});

		$("input.rating").on("change", function() {
			update_file(current_data);
		});

		$(".js_history").click(function() {
			go_to_history_page();
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

			clear_and_fill_item_area(".options_area", "options", $(this));
			clear_and_fill_item_area(".selected_area", "selected", $(this));
		});

		$(".options_area").on("click", ".item", function () {
			$(this).clone().appendTo(".selected_area");
		});


		$(".selected_area").on("click", ".item", function () {
			$(this).remove();
		});

		var hold_down = {};

		$(".options_area").on("mouseup", ".item", function(){
			clearTimeout(hold_down.pressTimer)
			// Clear timeout
			return false;
		}).on("mousedown", ".item", function(){
			hold_down.current_item = $(this);
			// Set timeout
			hold_down.pressTimer = window.setTimeout(function() {
				if (confirm('Would you like to remove '+$(hold_down.current_item).find(".name").text())+"?") {
					$(hold_down.current_item).remove();
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

		$(".back_icon").on("click", go_back_from_item_page);

	}
};

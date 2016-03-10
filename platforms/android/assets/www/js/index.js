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

		alert("device ready event");

		alert("the data directory: "+""+cordova.file.externalRootDirectory+"hi/");


		var current_page = "home_page";

		document.addEventListener("backbutton", function(e){
			e.preventDefault();
			if(current_page!="home_page"){
				go_back();
			}
		}, false);



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




		function onInitFs(fs) {

			fs.root.getFile(""+cordova.file.externalRootDirectory+"hi/", {create: true, exclusive: true}, function(fileEntry) {

				alert("file entry: "+JSON.stringify(fileEntry));

				fileEntry.createWriter(function(fileWriter) {

					fileWriter.onwriteend = function(e) {
						alert('Write completed.');
					};

					fileWriter.onerror = function(e) {
						alert('Write failed: ' + e.toString());
					};

					// Create a new Blob and write it to log.txt.
					var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

					fileWriter.write(blob);

				}, errorHandler);

			}, errorHandler);

		}

		window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
			window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
		}, function(e) {
			alert('Error', e);
		});

		// window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);



		$("input.rating").on( "touchmove mousemove change", function(){
			$(".rate_output").text($("input.rating").val());
		});


		$(".add_image").on("click",function(){
			alert("upload image");
		});

		$(".open_page").on("click",function(){
			current_page = $(this).attr("id");
			$(".home_page").addClass("hidden");
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
			$(".select_page").addClass("hidden");
			$(".home_page").removeClass("hidden");
			$("#"+current_page+" .info").text("");
			$("#"+current_page+" .info").append(get_selected_list().join(", "));
			$("#"+current_page).data("selected",get_selected_list());
			$("#"+current_page).data("options",get_options_list());
		}

	}
};

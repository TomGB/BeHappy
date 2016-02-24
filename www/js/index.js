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
		// document.addEventListener('deviceready', this.onDeviceReady, false);
		$(app.receivedEvent('jqueryready'));
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


		$("input.rating").on( "touchmove mousemove change", function(){
			$(".rate_output").text($("input.rating").val());
		});


		$(".add_image").on("click",function(){
			alert("upload image");
		});


		$(".diet_area").on("click",function(){
			$(".home_page").addClass("hidden");
			$(".diet_page").removeClass("hidden");
		});


		$(".select_area").on("click", ".item", function () {
			var this_id = $(this).data("itemid");
			var chosen_items = $(".chosen_area .item");
			
			if(has_not_been_chosen(this_id)){
				$(this).clone().appendTo(".chosen_area");
			}
		});


		$(".chosen_area").on("click", ".item", function () {
			$(this).remove();
		});

		var pressTimer

		$(".select_area").mouseup(function(){
			clearTimeout(pressTimer)
			// Clear timeout
			return false;
		}).mousedown(function(){
			// Set timeout
			pressTimer = window.setTimeout(function() { alert("delete")},500)
			return false; 
		});


		$(".add_new_food").on("change", function () {
			if($(this).val()!=""){
				$("<div class='item'><p class='name'>"+$(this).val()+"</p></div>").appendTo(".chosen_area")
				$(this).val("");
			}
		});


		function has_not_been_chosen(the_id) {
			var matched = false;

			for (var i = chosen_items.length - 1; i >= 0; i--) {
				if($(chosen_items[i]).data("itemid") == the_id){
					matched = true;
				}
			}

			return !matched;
		}
	}
};

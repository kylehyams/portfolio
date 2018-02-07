$(document).ready (function() {
	// Declare the variable to display the menu
	var $toggleMenu = $('.icon-menu');
	
	// This function adds the class that displays the menu
	$toggleMenu.on('click', function () {
	    $(this).closest('.menu').toggleClass('open');
	});
	
	// Declare the variable to close the menu
	var $toggleLink = $('.menu-link');
	
	// This function removes the class that displays the menu
	$toggleLink.on('click', function () {
	    $(this).closest('.menu').toggleClass('open');
	});
});
$(function() {

	console.log("go !");

	var st = 0, sd = 0, step = 10, change_pic = false;

	$('.previewZone input[type="range"]').on('mousemove', onRangeChange);
	$('.stack li:first-child').addClass('on');
	$('.stack .on')

	function onRangeChange() {

		var $img 		= $(this).parent().find('img');
		var $stack 	= $(this).parent().find('.stack');
		var $label  = $(this).parent().find('.label'); 

		var val 		= $(this).val();

		var currentPreview = $stack.find('.on').index();

		$stack.find('li').removeClass('on');
		$stack.find(':nth-child('+val+')').addClass('on');

		$label.html(val + '/' + $(this).attr("max"));

		$img.attr('src',$stack.find('.on').attr('src'));

	};

});
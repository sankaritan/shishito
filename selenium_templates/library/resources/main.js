$(document).ready(function() {

	reset_sort_headers();

	split_debug_onto_two_rows();

	$('.show_error').hide();

	$('.sortable').click(toggle_sort_states);
    $('.failed.results-table-row').click(function() {
        $(this).next('tr.debug').toggle('fast');
        $(this).children('.col-result').children('.hide_error').toggle();
        $(this).children('.col-result').children('.show_error').toggle();
    });
    $('.show_all_errors').click(function() {
        $('tr.debug').show();
        $('.hide_error').show();
        $('.show_error').hide();
    });
    $('.hide_all_errors').click(function() {
        $('tr.debug').hide();
        $('.hide_error').hide();
        $('.show_error').show();
    });
    $('.passed.clickable').click(function() {
        $('.passed.results-table-row').show();
        $('.failed.results-table-row').hide();
        hide_all_errors();
        $('.all.clickable').css("font-weight","normal");
        $('.failed.clickable').css("font-weight","normal");
        $('.passed.clickable').css("font-weight","Bold");
    });

    $('.failed.clickable').click(function() {
        $('.passed.results-table-row').hide();
        $('.failed.results-table-row').show();
        show_all_errors();
        $('.all.clickable').css("font-weight","normal");
        $('.failed.clickable').css("font-weight","Bold");
        $('.passed.clickable').css("font-weight","normal");
    });

    $('.all.clickable').click(function() {
        $('.passed.results-table-row').show();
        $('.failed.results-table-row').show();
        show_all_errors();
        $('.all.clickable').css("font-weight","Bold");
        $('.failed.clickable').css("font-weight","normal");
        $('.passed.clickable').css("font-weight","normal");
    });

	$('.sortable').click(function() {
		var columnName = $(this).attr('col');
		if ($(this).hasClass('numeric')) {
			sort_rows_num($(this), 'col-' + columnName);
		} else {
		sort_rows_alpha($(this), 'col-' + columnName);
		}
	});

});

function show_all_errors() {
    $('tr.debug').show();
    $('.hide_error').show();
    $('.show_error').hide();
}
function hide_all_errors() {
    $('tr.debug').hide();
    $('.hide_error').hide();
    $('.show_error').show();
}

function show_tests(type) {
    switch(type) {
        case "passed":
            $('.passed.results-table-row').show();
            $('.failed.results-table-row').hide();
            hide_all_errors();
            break;
        case "failed":
            $('.passed.results-table-row').hide();
            $('.failed.results-table-row').show();
            show_all_errors();
            break;
        case "all":
            $('.passed.results-table-row').show();
            $('.failed.results-table-row').show();
            show_all_errors();
            break;
    }
}

function sort_rows_alpha(clicked, sortclass) {
	one_row_for_data();
	var therows = $('.results-table-row');
	therows.sort(function(s, t) {
		var a = s.getElementsByClassName(sortclass)[0].innerHTML.toLowerCase();
		var b = t.getElementsByClassName(sortclass)[0].innerHTML.toLowerCase();
		if (clicked.hasClass('asc')) {
			if (a < b)
				return -1;
			if (a > b)
				return 1;
			return 0;
		} else {
			if (a < b)
				return 1;
			if (a > b)
				return -1;
			return 0;
		}
	});
	$('#results-table-body').append(therows);
	split_debug_onto_two_rows();
}

function sort_rows_num(clicked, sortclass) {
	one_row_for_data();
	var therows = $('.results-table-row');
	therows.sort(function(s, t) {
		var a = s.getElementsByClassName(sortclass)[0].innerHTML
		var b = t.getElementsByClassName(sortclass)[0].innerHTML
		if (clicked.hasClass('asc')) {
			return a - b;
		} else {
			return b - a;
		}
	});
	$('#results-table-body').append(therows);
	split_debug_onto_two_rows();
}

function reset_sort_headers() {
	$('.sort-icon').remove();
	$('.sortable').prepend('<div class="sort-icon">vvv</div>');
	$('.sortable').removeClass('asc desc inactive active');
	$('.sortable').addClass('asc inactive');
}

function toggle_sort_states() {
	//if active, toggle between asc and desc
	if ($(this).hasClass('active')) {
		$(this).toggleClass('asc');
		$(this).toggleClass('desc');
	}

	//if inactive, reset all other functions and add ascending active
	if ($(this).hasClass('inactive')) {
		reset_sort_headers();
		$(this).removeClass('inactive');
		$(this).addClass('active');
	}
}

function split_debug_onto_two_rows() {
	$('tr.results-table-row').each(function() {
		$('<tr class="debug">').insertAfter(this).append($('.debug', this));
	});
	$('td.debug').attr('colspan', 5);
}

function one_row_for_data() {
	$('tr.results-table-row').each(function() {
		if ($(this).next().hasClass('debug')) {
			$(this).append($(this).next().contents().unwrap());
		}
	});
}

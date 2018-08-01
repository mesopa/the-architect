
$(document).ready( function(){

  // ========================
  // Set Main Content Margins
  // ========================
  function set_main_margin_top () {
    if ( !$('header') ) {
      return false;
    }

    var header_height       = $('.header.wrap').outerHeight();
    var article_padding_top = 30;

    $('.article.wrap').css( 'margin-top', header_height + article_padding_top );
  }

  set_main_margin_top();

  function set_main_margin_bottom() {
    if ( !$('footer') ) {
      return false;
    }

    var footer_height       = $('.footer.wrap').outerHeight();
    var article_padding_bottom = 0;

    $('.article.wrap').css( 'margin-bottom', footer_height + article_padding_bottom );
  }

  set_main_margin_bottom();

  // ================
  // Header Animation
  // ================

  $(document).scroll(function(e){
    if ( !$('header') ) {
      return false;
    }

    var scrollAmount  = $(window).scrollTop();
    var header_height = $('.header.wrap').outerHeight();

    if ( scrollAmount >= header_height ) {
      $('.header.wrap').addClass('floating');
    } else {
      $('.header.wrap').removeClass('floating');
    }
  });

  // ==================
  // Load Defered Fonts
  // ==================
  $("<link />", {
    'rel': 'stylesheet',
    'href': 'assets/css/the-architect-styles-fonts.min.css'
  }).appendTo('head');
});
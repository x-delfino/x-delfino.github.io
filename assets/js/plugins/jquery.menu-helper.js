$(function() {

  function is_touch_enabled() {
      return ( 'ontouchstart' in window ) || 
             ( navigator.maxTouchPoints > 0 ) ||
             ( navigator.msMaxTouchPoints > 0 );
  }
  
  var $toggle = $('.dropdown-toggle');
  var $dropdown = $('.dropdown')
  var $ddparent = $('.parent')
  var $hlinks = $("nav.greedy-nav .hidden-links");
  var $blind = $(".blind");
  var $btn = $("nav.greedy-nav .greedy-nav__toggle");
  var $hlinks = $("nav.greedy-nav .hidden-links");

  function closeGreedy(){
      $blind.removeClass('close');  //open blind
      $hlinks.addClass('hidden');  //hide the hidden links menu
      $btn.removeClass('close');  //switch toggle button back
  }
  $toggle.on('click', function() {
    console.log('click')
    var $thisdropdown = $(this).closest('.dropdown');
    console.log($thisdropdown)
    if($(this).closest('.visible-links')[0]){
        console.log('visible')
        console.log($thisdropdown)
      $('.dropdown').not($thisdropdown).removeClass('dd_expanded');  // close other dropdowns
      console.log($thisdropdown)

      closeGreedy();
    }
    $thisdropdown.toggleClass('dd_expanded'); // toggle this menu
  })

if(!(is_touch_enabled())){
  $ddparent.on({
    mouseover:function(){
      if($(this).closest('.visible-links')[0]){
        var $thisdropdown = $(this).find('.dropdown');
        $('.dropdown').not($thisdropdown).removeClass('dd_expanded');  // close other dropdowns
        closeGreedy();
        $thisdropdown.addClass('dd_expanded'); // open this menu
      }
    },
    mouseout:function(){
      if($(this).closest('.visible-links')[0]){
        var $thisdropdown = $(this).find('.dropdown');
        $thisdropdown.removeClass('dd_expanded'); // close this menu
      }
    }
  })
}
  $(window).click(function(e){
    console.log(e.target)
   if (!(e.target.closest('.hidden-links, .dropdown, .greedy-nav__toggle'))){
      closeGreedy();
      $dropdown.removeClass('dd_expanded');  // close all dropdowns
  }
  })
})
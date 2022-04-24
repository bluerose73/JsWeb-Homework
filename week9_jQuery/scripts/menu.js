$(function(){
    console.log('in menu');
    $(".menu-icon").on('click', function(){
        $(this).toggleClass('fa-bars');
        $(this).toggleClass('fa-xmark');
        $(".menu").toggle();
    });
});
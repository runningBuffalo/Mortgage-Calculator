//app script
$(function(){

    $('input').focus(function(){
        $(this).select();
    });

    //sessionStorage.setItem('username', 'false');

/*
    if (sessionStorage.getItem('username') == "true") {
        alert("it's OK");
    }
*/
});

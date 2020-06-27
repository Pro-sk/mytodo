window.onload  = function(){
    document.getElementById('openMenu').addEventListener('click',function(){
        var display = document.getElementById('navUl');
        display.style.display = 'block';
        display.style.transition = 'all 0.5s';
    });
    
    document.getElementById('closeMenu').addEventListener('click',function(){
        var display = document.getElementById('navUl');
        display.style.display = 'none';
        display.style.transition = 'all 0.5s';
    });
};
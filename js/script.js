$(function(){
    var moving = false;
    $("#stage").on('touchstart mousedown', function(e){
       if (!moving){
        console.log(e.originalEvent);
        if (typeof e.originalEvent.touches != 'undefined'){
            for (var i = 0; i<e.originalEvent.touches.length; i++){
                var block = $('<div class="block"></div>');
                block.css({
                    left: e.originalEvent.touches[i].pageX,
                    top: e.originalEvent.touches[i].pageY,
                });
                $('#stage').append(block);
            }
        }
        else {
            var block = $('<div class="block"></div>');
             block.css({
                left: e.originalEvent.pageX,
                top: e.originalEvent.pageY,
            })
               $('#stage').append(block);
        }
     
        e.stopPropagation();
        return false;
        }
    })
    $("#stage").hammer().on('drag', '.block', function(e){
        moving = true;
       $(this).css({
           left: e.gesture.touches[0].pageX,
           top: e.gesture.touches[0].pageY,
           background: 'blue'
       });
       e.stopPropagation()
       return false;
    });
});
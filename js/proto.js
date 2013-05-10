$(function() {
  var moving = false; // variabel som är true när man flyttar, så det inte kommer till fler fyrkanter när man flyttar
  var currentWidth = 50; // hur bred är fyrkanten som just nu flyttas
  var finished = false; // har användaren börjat pincha? om så flytta inget mer

  $('#stage').on('mousedown touchstart', function(e) { // skapa fyrkanter på klick och touch start

    if (!moving) {
      if (typeof e.originalEvent.touches != 'undefined') {
        for (var i = 0; i < e.originalEvent.touches.length; i++) {
          var block = $('<div class="block"></div>');
          block.css({
            left: e.originalEvent.touches[i].pageX,
            top: e.originalEvent.touches[i].pageY
          });
          $('#stage').append(block);
        }
      }
      else {
        var block = $('<div class="block"></div>');
        block.css({
          left: e.originalEvent.pageX,
          top: e.originalEvent.pageY
        });
        $(block).hammer();
        $('#stage').append(block);
      }
    }
    e.preventDefault();
    return false;
  });

  $('#stage').hammer().on('dragend', '.block', function(e) {
    moving = false;
    $(document).off('transform');
  });

  $('#stage').hammer().on('mousedown touchstart dragstart drag', '.block', function(e) {
    var self = this;
    moving = true;

    if (e.type == 'touchstart' || e.type == 'mousedown') {
      currentWidth = $(this).width();
      finished = false;

      $(this).hammer().on('transform', function(e) {
        finished = true;
        $(this).css({
          left: e.gesture.center.pageX - ((currentWidth/2) * e.gesture.scale),
          top: e.gesture.center.pageY - ((currentWidth/2) * e.gesture.scale),
          width: e.gesture.scale * currentWidth,
          height: e.gesture.scale * currentWidth,
          'webkitTransform': 'rotate('+e.gesture.rotation+'deg)'
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      $(this).hammer().on('transformend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }
    else {
      if (!finished) {
        $(this).css({
          left: e.gesture.touches[0].pageX - (currentWidth/2),
          top: e.gesture.touches[0].pageY - (currentWidth/2)
        });
        e.stopPropagation();
        return false;
      }
    }
  });
});

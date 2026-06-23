$(document).ready(function () {
  // Init Masonry — exclude any .grid elements inside #degroot-root (React component)
  var $grid = $(".grid").not("#degroot-root, #degroot-root *").masonry({
    gutter: 10,
    horizontalOrder: true,
    itemSelector: ".grid-item",
  });
  // Layout Masonry after each image loads
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
  });
});

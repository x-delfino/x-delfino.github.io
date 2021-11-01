/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function menuHelper(menuId) {
    menu = document.getElementById(menuId);
    if (menu.style.display === "none") {
        menu.style.display = "block";
      } else {
        menu.style.display = "none";
      }
}
  

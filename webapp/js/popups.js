define(function() {
    var template =
        '<div class="popup">' +
        '  <div>' +
        '     <div class="popup-title">{title}</div>' +
        '     <div class="popup-content">{message}</div>' +
        '     <div class="popup-buttons"><button id="popup-yes">Yes</button><button id="popup-no">No</button></div>' +
        '  </div>' +
        '</div>';

    function createHtml(title, message) {
        var msg = message.replace("<", "&lt;").replace(/\n/g, "<br>");
        var ttl = title.replace("<", "&lt;").replace(/\n/g, "<br>");
        console.log(message);
        var innerHTML = template.replace("{title}", ttl);
        innerHTML = innerHTML.replace("{message}", msg);
        return innerHTML;
    }

    function removePopup() {
        var removeMe = document.getElementById("popup-veil");
        document.querySelector("main").removeChild(removeMe);
    }

    function confirm(title, message, onYes, onNo) {
        var main = document.querySelector("main");
        var node = document.createElement("div");
        node.id = "popup-veil";
        node.innerHTML = createHtml(title, message);
        main.appendChild(node);

        document.getElementById('popup-yes').onclick = function(e) {
            e.stopPropagation();
            removePopup();
            onYes();
        };
        document.getElementById('popup-veil').onclick = function(e) {
            e.stopPropagation();
            removePopup();
            onNo();
        };
    }

    return {
        confirm: confirm
    }
});